import {closest} from '../shared/utils';

import Draggable from '../Draggable';
import {NestedInEvent, NestedOutEvent} from './NestedEvent';

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

export default class Nested extends Draggable {
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
        this.currentLevel = level;
        this.initialLevel = level;
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

        this.currentLevel = level;
    }


    /**
     * Drag stop handler
     * @private
     * @param {DragStopEvent} event - Drag stop event
     */
    [onDragStop](event) {

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
        // sortable
        const {source, over, overContainer} = event;
        if (event.over === event.originalSource || event.over === event.source) {
            return;
        }

        const children = this.getDraggableElementsForContainer(overContainer);
        const moves = move({source, over, overContainer, children});

        if (!moves) {
            return;
        }
    }

    /**
     * Drag stop handler
     * @private
     * @param {DragStopEvent} event - Drag stop event
     */
    [onDragMove](event) {
        const { options, nestedLevel, currentLevel } = this;
        const { sensorEvent, source } = event;

        this.prevX = this.lastX;
        this.lastX = sensorEvent.clientX;

        this.distanceX = this.lastX - this.startX;
        this.moveLevel = Math.round(this.distanceX / options.indent);
        this.moveDirection = (this.lastX - this.prevX) > 0 ? 1 : -1;
        this.newLevel = Math.max(Math.min(this.initialLevel + this.moveLevel, options.maxLevel), 1);

        const containerClass = `.${ this.getClassNameFor('container:nested') }`;
        const container = source.parentNode;
        const items = this.getDraggableElementsForContainer(container);

        const getAllowItem = ({ move, sourceItem, fromRecursion }) =>{
            let allowItem = sourceItem;
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
                if (isFirst(items, sourceItem)) {
                    return sourceItem;
                }

                let target = fromRecursion ? sourceItem : sourceItem.previousSibling;

                if (!items.includes(target)) {
                    target = target.previousSibling || target.nextSibling;
                }

                const container = target.querySelector(containerClass);

                if (move <= 1 || !container || !container.lastChild || !items.includes(container.lastChild)) {
                    return target;
                }
                else {
                    return getAllowItem({ move: move - 1, sourceItem: container.lastChild, fromRecursion: true });
                }
            }

            return allowItem;
        };

        const move = this.newLevel - this.currentLevel;

        const toItem = getAllowItem({ move, sourceItem: source, firstMove: true });

        if (toItem === source) {
            return;
        }

        // Move out
        if (this.moveDirection < 0) {
            const isLastItem = isLast(items, source);

            if (isLastItem) {
                this.currentLevel = this.newLevel;

                insertAfter(toItem, source);
            }
        }
        // Move in
        else if (this.moveDirection > 0) {
            if (currentLevel + nestedLevel < options.maxLevel && !isFirst(items, source)) {
                let container = toItem.querySelector(containerClass);
                this.currentLevel = this.newLevel;

                if (!container) {
                    container = document.createElement(options.containerTag);
                    container.setAttribute('class', this.getClassNameFor('container:nested'));
                    container.appendChild(source);

                    toItem.appendChild(container);

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

// sortable
function move({source, over, overContainer, children}) {
    const emptyOverContainer = !children.length;
    const differentContainer = source.parentNode !== overContainer;
    const sameContainer = over && !differentContainer;

    if (emptyOverContainer) {
        return moveInsideEmptyContainer(source, overContainer);
    } else if (sameContainer) {
        return moveWithinContainer(source, over);
    } else if (differentContainer) {
        return moveOutsideContainer(source, over, overContainer);
    } else {
        return null;
    }
}

function moveInsideEmptyContainer(source, overContainer) {
    const oldContainer = source.parentNode;

    overContainer.appendChild(source);

    return {oldContainer, newContainer: overContainer};
}

function moveWithinContainer(source, over) {
    const oldIndex = index(source);
    const newIndex = index(over);

    if (oldIndex < newIndex) {
        if (over.nextElementSibling && over.nextElementSibling.parentNode == source.parentNode) {
            source.parentNode.insertBefore(source, over.nextElementSibling);
        }
    }
    else {
        if (over && over.parentNode == source.parentNode) {
            source.parentNode.insertBefore(source, over);
        }
    }

    return {oldContainer: source.parentNode, newContainer: source.parentNode};
}

function moveOutsideContainer(source, over, overContainer) {
    const oldContainer = source.parentNode;

    if (over) {
        over.parentNode.insertBefore(source, over);
    } else {
        // need to figure out proper position
        overContainer.appendChild(source);
    }

    return {oldContainer, newContainer: source.parentNode};
}
