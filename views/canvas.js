/*!
 * RaphaelWrapper Sproutcore Framework
 *
 * Copyright (c) 2011 Gabriele Genta (http://gabrielegenta.wordpress.com/)
 * Licensed under the MIT license.
 */

/**
 * @class
 * @extends SC.View
 */
Raphael.CanvasView = SC.View.extend(
/** @scope Raphael.CanvasView.prototype */ {

  // default background color is white (oh yeah..)
  backgroundColor: "#fff",
  // reference to the native Raphael canvas
  nativeCanvas: null,

  didCreateLayer: function() {
    //sc_super();
    // create native canvas
    var frame = this.get("frame");
    this.nativeCanvas = new Raphael(this.get("layer"), 0, 0);
    this.nativeCanvas.setSize(frame.width, frame.height);
  },

  viewDidResize: function() {
    sc_super();
    if (this.nativeCanvas)
    {
      this.nativeCanvas.setSize(this.get("frame").width, this.get("frame").height);
    }
  },

  add: function(element) {
    element.addToCanvas(this);
  },
  remove: function(element) {
    element.removeFromCanvas();
  },

  /////////////////////////////////////////////////////////
  /////  events from elements
  /////////////////////////////////////////////////////////
  elementDragBegin: function(event) {},
  elementDragMove: function(event) {},
  elementDragEnd: function(event) {}


});
