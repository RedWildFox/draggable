import Sortable from '../Sortable';
import {NestedInEvent, NestedOutEvent} from './NestedEvent';

const onDragStart = Symbol('onDragStart');
const onDragOverContainer = Symbol('onDragOverContainer');
const onDragOver = Symbol('onDragOver');
const onDragStop = Symbol('onDragStop');
const onDragMove = Symbol('onDragMove');
const onDragOut = Symbol('onDragOut');
const onDragOutContainer = Symbol('onDragOutContainer');

export default class Nested extends Sortable {
  constructor(containers = [], options = {}) {
    super(containers, {
      ...options,
      announcements: {
        ...(options.announcements || {}),
      },
    });

    /**
     * start index of source on drag start
     * @property startIndex
     * @type {Number}
     */
    this.startIndex = null;

    /**
     * start container on drag start
     * @property startContainer
     * @type {HTMLElement}
     * @default null
     */
    this.startContainer = null;

    this[onDragStart] = this[onDragStart].bind(this);
    this[onDragOverContainer] = this[onDragOverContainer].bind(this);
    this[onDragOver] = this[onDragOver].bind(this);
    this[onDragStop] = this[onDragStop].bind(this);
    this[onDragMove] = this[onDragMove].bind(this);
    this[onDragOut] = this[onDragOut].bind(this);
    this[onDragOutContainer] = this[onDragOutContainer].bind(this);

    this.on('drag:start', this[onDragStart])
      .on('drag:over:container', this[onDragOverContainer])
      .on('drag:over', this[onDragOver])
      .on('drag:stop', this[onDragStop])
      .on('drag:move', this[onDragMove])
      .on('drag:out', this[onDragOut])
      .on('drag:out:container', this[onDragOutContainer]);
  }

  /**
   * Destroys Sortable instance.
   */
  destroy() {
    super.destroy();

    this.off('drag:start', this[onDragStart])
      .off('drag:over:container', this[onDragOverContainer])
      .off('drag:over', this[onDragOver])
      .off('drag:stop', this[onDragStop])
      .off('drag:move', this[onDragMove])
      .off('drag:out', this[onDragOut])
      .off('drag:out:container', this[onDragOutContainer]);
  }

  /**
   * Drag start handler
   * @private
   * @param {DragStartEvent} event - Drag start event
   */
  [onDragStart](event) {
    console.log('nested onDragStart', event);
  }


  /**
   * Drag start handler
   * @private
   * @param {DragStartEvent} event - Drag start event
   */
  [onDragStart](event) {
    console.log('nested onDragStart', event);
    console.log('nested onDragStart', event.originalSource.offsetLeft);

  }

  /**
   * Drag over container handler
   * @private
   * @param {DragOverContainerEvent} event - Drag over container event
   */
  [onDragOverContainer](event) {
    console.log('nested onDragOverContainer', event);

  }

  /**
   * Drag over handler
   * @private
   * @param {DragOverEvent} event - Drag over event
   */
  [onDragOver](event) {
    console.log('nested onDragOver', event);

  }

  /**
   * Drag stop handler
   * @private
   * @param {DragStopEvent} event - Drag stop event
   */
  [onDragStop](event) {
    console.log('nested onDragOver', event);

  }

  /**
   * Drag stop handler
   * @private
   * @param {DragStopEvent} event - Drag stop event
   */
  [onDragMove](event) {
    // console.log('nested onDragMove', event.originalSource.offsetLeft);
    console.log('nested onDragMove', event.originalSource.previousSibling);

  }

  /**
   * Drag stop handler
   * @private
   * @param {DragStopEvent} event - Drag stop event
   */
  [onDragOut](event) {
    console.log('nested onDragOut', event);

  }

  /**
   * Drag stop handler
   * @private
   * @param {DragStopEvent} event - Drag stop event
   */
  [onDragOutContainer](event) {
    console.log('nested onDragOutContainer', event);

  }
}
