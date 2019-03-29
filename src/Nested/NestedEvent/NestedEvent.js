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
 * Nested start event
 * @class NestedStartEvent
 * @module NestedStartEvent
 * @extends NestedEvent
 */
export class NestedStartEvent extends NestedEvent {
  static type = 'Nested:start';
  static cancelable = true;

  /**
   * Start index of source on Nested start
   * @property startIndex
   * @type {Number}
   * @readonly
   */
  get startIndex() {
    return this.data.startIndex;
  }

  /**
   * Start container on Nested start
   * @property startContainer
   * @type {HTMLElement}
   * @readonly
   */
  get startContainer() {
    return this.data.startContainer;
  }
}

/**
 * Nested sort event
 * @class NestedSortEvent
 * @module NestedSortEvent
 * @extends NestedEvent
 */
export class NestedSortEvent extends NestedEvent {
  static type = 'Nested:sort';
  static cancelable = true;

  /**
   * Index of current draggable element
   * @property currentIndex
   * @type {Number}
   * @readonly
   */
  get currentIndex() {
    return this.data.currentIndex;
  }

  /**
   * Draggable element you are hovering over
   * @property over
   * @type {HTMLElement}
   * @readonly
   */
  get over() {
    return this.data.oldIndex;
  }

  /**
   * Draggable container element you are hovering over
   * @property overContainer
   * @type {HTMLElement}
   * @readonly
   */
  get overContainer() {
    return this.data.newIndex;
  }
}

/**
 * Nested sorted event
 * @class NestedSortedEvent
 * @module NestedSortedEvent
 * @extends NestedEvent
 */
export class NestedSortedEvent extends NestedEvent {
  static type = 'Nested:sorted';

  /**
   * Index of last sorted event
   * @property oldIndex
   * @type {Number}
   * @readonly
   */
  get oldIndex() {
    return this.data.oldIndex;
  }

  /**
   * New index of this sorted event
   * @property newIndex
   * @type {Number}
   * @readonly
   */
  get newIndex() {
    return this.data.newIndex;
  }

  /**
   * Old container of draggable element
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

/**
 * Nested stop event
 * @class NestedStopEvent
 * @module NestedStopEvent
 * @extends NestedEvent
 */
export class NestedStopEvent extends NestedEvent {
  static type = 'Nested:stop';

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
