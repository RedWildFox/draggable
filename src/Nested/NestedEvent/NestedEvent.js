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
 * Nested in event
 * @class NestedStartEvent
 * @module NestedStartEvent
 * @extends NestedEvent
 */
export class NestedInEvent extends NestedEvent {
  static type = 'nested:in';

  /**
   * Element you put the item
   * @property nestedElement
   * @type {Number}
   * @readonly
   */
  get nestedElement() {
    return this.data.nestedElement;
  }
}

/**
 * Nested sort event
 * @class NestedSortEvent
 * @module NestedSortEvent
 * @extends NestedEvent
 */
export class NestedOutEvent extends NestedEvent {
  static type = 'Nested:out';

  /**
   * Index of current draggable element
   * @property currentIndex
   * @type {Number}
   * @readonly
   */
  get nestedElement() {
    return this.data.nestedElement;
  }
}
