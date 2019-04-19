import AbstractEvent from 'shared/AbstractEvent';

/**
 * Base sortable event
 * @class SortableEvent
 * @module SortableEvent
 * @extends AbstractEvent
 */
export class NestedEvent extends AbstractEvent {
  static type = 'nested';

  /**
   * Original drag event that triggered this nested event
   * @property dragEvent
   * @type {DragEvent}
   * @readonly
   */
  get dragEvent() {
    return this.data.dragEvent;
  }
}

/**
 * Nested stop event
 * @class NestedStopEvent
 * @module NestedStopEvent
 * @extends NestedEvent
 */
export class NestedStopEvent extends NestedEvent {
    static type = 'nested:stop';

    /**
     * Original index on Nested start
     * @property oldIndex
     * @type {Number}
     * @readonly
     */
    get oldIndex() {
        return this.data.oldIndex;
    }

    /**
     * New index of draggable element
     * @property newIndex
     * @type {Number}
     * @readonly
     */
    get newIndex() {
        return this.data.newIndex;
    }

    /**
     * Original container of draggable element
     * @property oldContainer
     * @type {HTMLElement}
     * @readonly
     */
    get oldContainer() {
        return this.data.oldContainer;
    }

    /**
     * New container of draggable element
     * @property newContainer
     * @type {HTMLElement}
     * @readonly
     */
    get newContainer() {
        return this.data.newContainer;
    }
}
