/*!
 * RaphaelWrapper Sproutcore Framework
 *
 * Copyright (c) 2011 Gabriele Genta (http://gabrielegenta.wordpress.com/)
 * Licensed under the MIT license.
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