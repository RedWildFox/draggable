import Sortable from '../Sortable';
import {NestedInEvent, NestedOutEvent} from './NestedEvent';

const onDragStart = Symbol('onDragStart');
const onDragStop = Symbol('onDragStop');
const onDragMove = Symbol('onDragMove');

const defaultOptions = {
  indent: 60,
  level: 3,
};

export default class Nested extends Sortable {
  constructor(containers = [], options = {}) {
    super(containers, {
      ...defaultOptions,
      ...options,
      announcements: {
        ...(options.announcements || {}),
      },
    });


    console.log(this.options);
    /**
     * start index of source on drag start
     * @property startIndex
     * @type {Number}
     */
    this.indentMove = this.options.indent / 2;

    this.mouse = {
      offsetX: 0,
      startX: 0,
      lastX: 0,
      nowX: 0,
      indentLevelX: 0,
      distY: 0,
      dirAx: 0,
      dirX: 0,
      lastDirX: 0,
      distAxX: 0,
    };

    this.isTouch    = false;
    this.moving     = false;
    this.dragEl     = null;
    this.dragRootEl = null;
    this.dragDepth  = 0;
    this.hasNewRoot = false;
    this.pointEl    = null;

    this[onDragStart] = this[onDragStart].bind(this);
    this[onDragStop] = this[onDragStop].bind(this);
    this[onDragMove] = this[onDragMove].bind(this);

    this.on('drag:start', this[onDragStart])
      .on('drag:stop', this[onDragStop])
      .on('drag:move', this[onDragMove]);
  }

  /**
   * Destroys Sortable instance.
   */
  destroy() {
    super.destroy();

    this.off('drag:start', this[onDragStart])
      .off('drag:stop', this[onDragStop])
      .off('drag:move', this[onDragMove]);
  }

  /**
   * Drag start handler
   * @private
   * @param {DragStartEvent} event - Drag start event
   */
  [onDragStart](event) {
    // console.log('nested onDragStart', event);
    this.mouse.startX = event.sensorEvent.clientX;
    this.mouse.startY = event.sensorEvent.clientY;
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
    console.log('nested onDragMove', event);


    let list;
    let parent;
    let prev;
    let next;
    let depth;
    const opt = this.options;
    const mouse = this.mouse;

    // mouse position last events
    mouse.lastX = mouse.nowX;
    mouse.lastY = mouse.nowY;
    // mouse position this events
    mouse.nowX = event.sensorEvent.clientX;
    mouse.nowY = event.sensorEvent.clientY;
    // distance mouse moved between events
    mouse.indentLevelX = (mouse.nowX - mouse.lastX) / this.options.indent;
    mouse.distY = mouse.nowY - mouse.lastY;
    // direction mouse is now moving (on both axis)
    mouse.dirX = Math.min(this.options.level, mouse.indentLevelX);

      // mouse.distX === 0 ? 0 : mouse.distX > this.indentMove ? 1 : -1;
    mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
    // axis mouse is now moving on
    var newAx = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

    // do nothing on first move
    if (!mouse.moving) {
      mouse.dirAx = newAx;
      mouse.moving = true;
      return;
    }

    // calc distance moved on this axis (and direction)
    if (mouse.dirAx !== newAx) {
      mouse.distAxX = 0;
      mouse.distAxY = 0;
    } else {
      mouse.distAxX += Math.abs(mouse.distX);
      if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
        mouse.distAxX = 0;
      }
      mouse.distAxY += Math.abs(mouse.distY);
      if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
        mouse.distAxY = 0;
      }
    }
    mouse.dirAx = newAx;

    /**
     * move horizontal
     */
    if (mouse.dirAx && mouse.distAxX >= opt.threshold) {
      // reset move distance on x-axis for new phase
      mouse.distAxX = 0;
      prev = this.placeEl.prev(opt.itemNodeName);
      // increase horizontal level if previous sibling exists and is not collapsed
      if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass)) {
        // cannot increase level when item above is collapsed
        list = prev.find(opt.listNodeName).last();
        // check if depth limit has reached
        depth = this.placeEl.parents(opt.listNodeName).length;
        if (depth + this.dragDepth <= opt.maxDepth) {
          // create new sub-level if one doesn't exist
          if (!list.length) {
            list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);
            list.append(this.placeEl);
            prev.append(list);
            this.setParent(prev);
          } else {
            // else append to next level up
            list = prev.children(opt.listNodeName).last();
            list.append(this.placeEl);
          }
        }
      }
      // decrease horizontal level
      if (mouse.distX < 0) {
        // we can't decrease a level if an item preceeds the current one
        next = this.placeEl.next(opt.itemNodeName);
        if (!next.length) {
          parent = this.placeEl.parent();
          this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
          if (!parent.children().length) {
            this.unsetParent(parent.parent());
          }
        }
      }
    }

    var isEmpty = false;

    // find list item under cursor
    if (!hasPointerEvents) {
      this.dragEl[0].style.visibility = 'hidden';
    }
    this.pointEl = $(document.elementFromPoint(event.pageX - document.body.scrollLeft, event.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
    if (!hasPointerEvents) {
      this.dragEl[0].style.visibility = 'visible';
    }
    if (this.pointEl.hasClass(opt.handleClass)) {
      this.pointEl = this.pointEl.parent(opt.itemNodeName);
    }
    if (this.pointEl.hasClass(opt.emptyClass)) {
      isEmpty = true;
    }
    else if (!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {
      return;
    }
  }
}
