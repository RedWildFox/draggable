import {closest} from '../shared/utils';

import Sortable from '../Sortable';
import {NestedInEvent, NestedOutEvent} from './NestedEvent';
import {DragOverEvent,DragOverContainerEvent} from '../Draggable/DragEvent';

const onDragStart = Symbol('onDragStart');
const onDragStop = Symbol('onDragStop');
const onDragMove = Symbol('onDragMove');
const onDragOverContainer = Symbol('onDragOverContainer');
const onDragOver = Symbol('onDragOver');
const DragOutEvent = Symbol('DragOutEvent');

const defaultClasses = {
    'container:nested': 'NestedList',
};

const defaultOptions = {
    indent: 60,
    maxLevel: 4,
    containerTag: 'ul',
};

export default class Nested extends Sortable {
    constructor(containers = [], options = {}) {
        super(containers, {
            ...defaultOptions,
            ...options,
            classes: {
                ...defaultClasses,
                ...(options.classes || {}),
            },
            announcements: {
                ...(options.announcements || {}),
            },
        });

        /**
         * start index of source on drag start
         * @property startIndex
         * @type {Number}
         */
        this[onDragStart] = this[onDragStart].bind(this);
        this[onDragMove] = this[onDragMove].bind(this);
        this[onDragStop] = this[onDragStop].bind(this);
        this[onDragOverContainer] = this[onDragOverContainer].bind(this);
        this[DragOutEvent] = this[DragOutEvent].bind(this);
        this[onDragOver] = this[onDragOver].bind(this);


        this.on('drag:start', this[onDragStart])
            .on('drag:move', this[onDragMove])
            .on('drag:stop', this[onDragStop])
            .on('drag:over', this[onDragOver])
            .on('drag:out', this[DragOutEvent])
            .on('drag:over:container', this[onDragOverContainer]);
    }

    /**
     * Destroys Sortable instance.
     */
    destroy() {
        super.destroy();

        this.off('drag:start', this[onDragStart])
            .off('drag:move', this[onDragMove])
            .off('drag:stop', this[onDragStop])
            .off('drag:over', this[onDragOver])
            .off('drag:out', this[DragOutEvent])
            .off('drag:over:container', this[onDragOverContainer]);
    }

    /**
     * Drag start handler
     * @private
     * @param {DragStartEvent} event - Drag start event
     */
    [onDragStart](event) {
        const { sensorEvent, source, sourceContainer } = event;
        const containerClass = `.${ this.getClassNameFor('container:nested') }`;

        const level = getContainerLevel(this.containers, sourceContainer);
        const nestedLevel = getItemNestedLevel(source, containerClass);

        this.startX = sensorEvent.clientX;

        this.initialLevel = level;
        this.currentLevel = level;
        this.nestedLevel  = nestedLevel;
    }

    /**
     * Drag over container handler
     * @private
     * @param {DragOverContainerEvent} event - Drag over container event
     */
    [onDragOverContainer](event) {
        const { overContainer } = event;

        const level = getContainerLevel(this.containers, overContainer);

        // this.initialLevel = level;
        this.currentLevel = level;
    }


    /**
     * Drag stop handler
     * @private
     * @param {DragStopEvent} event - Drag stop event
     */
    [onDragStop](event) {
        // TODO!! проверить целесообразность.
        if (this.containerEmpty.childNodes.length === 1) {
            this.containerEmpty.remove();
        }
    }

    /**
     * Drag out handler
     * @private
     * @param {DragOutEvent} event - Drag out event
     */
    [DragOutEvent](event) {
        // console.warn('DragOutEvent', event);
    }

    /**
     * Drag over handler
     * @private
     * @param {DragOverEvent} event - Drag over event
     */
    [onDragOver](event) {
        // console.warn('onDragOver', event);
    }

    /**
     * Drag stop handler
     * @private
     * @param {DragStopEvent} event - Drag stop event
     */
    [onDragMove](event) {
        const { options, nestedLevel, currentLevel } = this;
        const { sensorEvent, source } = event;

        const container = source.parentNode;
        const items = this.getDraggableElementsForContainer(container);

        const getAllowItem = ({ move, sourceItem, firstMove }) =>{
            let allowItem = sourceItem;

            const container = sourceItem.parentNode;
            const items = this.getDraggableElementsForContainer(container);

            // console.log({
            //     move,
            //     current: this.currentLevel,
            //     need: this.newLevel,
            //     sourceItem,
            //     firstMove,
            // });

            // Out
            if (move < 0) {
                // not allow out not last item
                if (!isLast(items, sourceItem)) {
                    return sourceItem;
                }

                const closestItem = closest(container, options.draggable);

                if (closestItem) {
                    allowItem = getAllowItem({ move: move + 1, sourceItem: closestItem });
                }
            }
            // In
            else if (move > 0) {
                if(isFirst(items, sourceItem)) {
                    return sourceItem;
                }

                const closestItem = firstMove ? sourceItem.previousSibling : sourceItem.lastChild.lastChild;

                if (closestItem) {
                    allowItem = getAllowItem({ move: move - 1, sourceItem: closestItem });
                }
            }

            return allowItem;
        };

        const move = this.newLevel - (this.currentLevel + nestedLevel);
        const toItem = getAllowItem({ move, sourceItem: source, firstMove: true });

        this.prevX = this.lastX;
        this.lastX = sensorEvent.clientX;

        this.distanceX = this.lastX - this.startX;
        this.moveLevel = Math.round(this.distanceX / options.indent);
        this.moveDirection = (this.lastX - this.prevX) > 0 ? 1 : -1;
        this.newLevel = Math.max(Math.min(this.initialLevel + this.moveLevel, options.maxLevel), 1);

        // console.log({
        //     moveDirection: this.moveDirection,
        //     sdf: nestedLevel
        // });

        // Move out
        if (this.moveDirection < 0) {
            const isLastItem = isLast(items, source);

            if (isLastItem && toItem !== source) {
                this.currentLevel = this.newLevel;

                // TODO!! проверить целесообразность.
                this.containerEmpty = container;
                insertAfter(toItem, source);
            }
        }
        // Move in
        else if (this.moveDirection > 0) {
            if (currentLevel + nestedLevel < options.maxLevel && !isFirst(items, source) && toItem !== source) {
                const containerClass = `.${ this.getClassNameFor('container:nested') }`;
                let container = toItem.querySelector(containerClass);

                if (!container) {
                    this.currentLevel = this.newLevel;
                    let prevEl = source.previousSibling;

                    container = document.createElement(options.containerTag);
                    container.setAttribute('class', this.getClassNameFor('container:nested'));
                    container.appendChild(source);

                    prevEl.appendChild(container);

                    this.addContainer(container);
                }

                container.appendChild(source);
            }
        }
    }
}

function getContainerLevel(containers, container) {
    let level = 1;

    while (container) {
        container = closest(container.parentNode, containers);

        if (container) {
            level += 1;
        }
    }

    return level;
}

function getItemNestedLevel(item, nestedSelector) {
    let maxLevel = 0;

    const container = item.querySelector(nestedSelector);

    if (container) {
        const items = [...container.children];

        items.forEach((item) => {
            let level = 1 + getItemNestedLevel(item, nestedSelector);

            if (level > maxLevel) {
                maxLevel = level;
            }
        });
    }

    return maxLevel;
}

function insertAfter(el, nextEl) {
    if (el && nextEl) {
        el.after(nextEl);
    }
}

function insertBefore(el, prevEl) {
    if (el && prevEl) {
        el.before(prevEl);
    }
}

function index(items, element) {
    return Array.prototype.indexOf.call(items || element.parentNode.children, element);
}

function isFirst(items, element) {
    const i = index(items, element);

    return i === 0;
}

function isLast(items, element) {
    const i = index(items, element);

    return i === items.length - 1;
}
