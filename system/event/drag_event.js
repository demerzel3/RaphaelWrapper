/**
 * Created by JetBrains PhpStorm.
 * User: assa
 * Date: 18/03/11
 * Time: 22.57
 * To change this template use File | Settings | File Templates.
 */
Raphael.DragEvent = SC.Object.extend(
/** @scope Raphael.DragEvent.prototype */ {
  element: null,
  startPoint: null,
  delta: null,
  isNative: YES,

  init: function() {
    // initialize points
    this.startPoint = this.startPoint || {x: 0, y: 0};
    this.delta = this.delta || {x: 0, y: 0};
  }
});