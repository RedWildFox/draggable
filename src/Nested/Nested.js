import {closest} from '../shared/utils';

import Sortable from '../Sortable';
import {NestedInEvent, NestedOutEvent} from './NestedEvent';
import {DragOverEvent,DragOverContainerEvent} from '../Draggable/DragEvent';

const onDragStart = Symbol('onDragStart');
const onDragStop = Symbol('onDragStop');
const onDragMove = Symbol('onDragMove');
const onDragOverContainer = Symbol('onDragOverContainer');

const defaultClasses = {
    'container:nested': 'NestedList',
};

const defaultOptions = {
    indent: 60,
    maxLevel: 3,
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
        // this.indentMove = this.options.indent / 2;

        // this.mouse = {
        //   offsetX: 0,
        //   startX: 0,
        //   lastX: 0,
        //   nowX: 0,
        //   indentLevelX: 0,
        //   distY: 0,
        //   dirAx: 0,
        //   dirX: 0,
        //   lastDirX: 0,
        //   distAxX: 0,
        // };

        // this.isTouch    = false;
        // this.moving     = false;
        // this.dragEl     = null;
        // this.dragRootEl = null;
        // this.dragDepth  = 0;
        // this.hasNewRoot = false;
        // this.pointEl    = null;

        this[onDragStart] = this[onDragStart].bind(this);
        this[onDragStop] = this[onDragStop].bind(this);
        this[onDragMove] = this[onDragMove].bind(this);
        this[onDragOverContainer] = this[onDragOverContainer].bind(this);


        this.on('drag:start', this[onDragStart])
            .on('drag:move', this[onDragMove])
            .on('drag:stop', this[onDragStop])
            .on('drag:over:container', this[onDragOverContainer]);
    }

    /**
     * Destroys Sortable instance.
     */
    destroy() {
        super.destroy();

        this.off('drag:start', this[onDragStart])
            .off('drag:stop', this[onDragStop])
            .off('drag:move', this[onDragMove])
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

        this.initialLevel = level;
        this.currentLevel = level;
    }


    /**
     * Drag stop handler
     * @private
     * @param {DragStopEvent} event - Drag stop event
     */
    [onDragStop](event) {
        // console.log('nested onDragOver', event);
    }

    /**
     * Drag stop handler
     * @private
     * @param {DragStopEvent} event - Drag stop event
     */
    [onDragMove](event) {
        const { options, nestedLevel } = this;
        const { sensorEvent, source } = event;

        const container = source.parentNode;
        const items = this.getDraggableElementsForContainer(container);

        const containerLevel = getContainerLevel(this.containers, container);

        this.lastX = sensorEvent.clientX;

        this.distanceX = this.lastX - this.startX;
        this.moveLevel = Math.round(this.distanceX / (options.indent / 2));
        this.moveDirection = this.moveLevel ? (this.moveLevel > 0 ? 1 : -1) : 0;
        this.newLevel = Math.max(Math.min(this.initialLevel + this.moveLevel, options.maxLevel), 1);


        // Move out
        if (this.moveDirection < 0 && (containerLevel - this.newLevel) === 1) {
            const isLastItem = isLast(items, source);

            if (isLastItem) {
                console.log('move', containerLevel, this.currentLevel);

                insertAfter(container.parentNode, source);
                this.currentLevel = containerLevel;
            }
        }
        // Move in
        else if (this.moveDirection > 0) {
            if (containerLevel + nestedLevel < options.maxLevel && !isFirst(items, source)) {
                console.log('Можно двигать');
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
