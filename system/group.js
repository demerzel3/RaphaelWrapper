/*!
 * RaphaelWrapper Sproutcore Framework
 *
 * Copyright (c) 2011 Gabriele Genta (http://gabrielegenta.wordpress.com/)
 * Licensed under the MIT license.
 */
Raphael.Group = Raphael.Element.extend(
/** @scope Raphael.Group.prototype */{

  /**
   * Walks like a duck
   */
  isRaphaelGroup: YES,

  _elements: null,

  init: function() {
    sc_super();
    this._elements = [];
    this._locationDidChange();
  },

  pushElement: function(element) {
    //if (!element.instanceOf(Raphael.Element))
    //  return;

    // save in the element a group reference to be able to refer to the group
    element._group = this;
    // push the element in the list and hash
    this._elements.pushObject(element);
    // pass on attributes (and location) to the element
    element.attr(this.get("attrs"));
    element.set("location", this.location);
    element.set("isDraggable", this.isDraggable);
  },
  /**
   * Removes the specified element from the canvas and from the group
   *
   * @param element
   */
  removeElement: function(element) {
    element.removeFromCanvas();
    this._elements.remove(element);
  },

  /**
   * Change native element position when location changes
   *
   * @private
   * @param canvas
   * @param nativeCanvas
   */
  _locationDidChange: function() {
    this._elements.invoke("set", "location", this.get("location"));
  }.observes("location"),

  /**
   * Change group elements draggable state whn triggered
   */
  _isDraggableDidChange: function() {
    this._elements.invoke("set", "isDraggable", this.get("isDraggable"));
  }.observes("isDraggable"),

  addToCanvas: function(canvas) {
    this.willAddToCanvas(canvas);
    this.set("canvas", canvas);
    this._elements.invoke("addToCanvas", canvas);
    this.didAddToCanvas(canvas);
  },
  removeFromCanvas: function(forced) {
    if (this.willRemoveFromCanvas(forced) || forced) {
      this._elements.invoke("removeFromCanvas");
      this.set("canvas", null);
      this.didRemoveFromCanvas();
    }
  },
  /**
   * Low level animation function, passes the source and other infos to the
   * child elements. The callback is passed to the first element only, in order to be
   * called just one time for every call to animate.
   *
   * @param sourceElement
   * @param newAttrs
   * @param ms
   * @param easing
   * @param callback
   */
  _ll_animate: function(sourceElement, newAttrs, ms, easing, callback, syncElement) {
    // pass on the callback only to the first element
    for (var i = 0; i < this._elements.length; i++) {
      if (i == 0) {
        this._elements[i]._ll_animate(sourceElement, newAttrs, ms, easing, callback, syncElement);
        if (SC.none(syncElement))
          syncElement = this._elements[i];
      } else
        this._elements[i]._ll_animate(sourceElement, newAttrs, ms, easing, null, syncElement);
    }
  },
  /**
   * Animates all the objects in the group at once.
   *
   * @param newAttrs
   * @param ms
   * @param easing
   * @param callback
   */
  animate: function(newAttrs, ms, easing, callback) {
    // support the Raphael syntax, in which easing can be omitted and replaced by callback
    if (SC.none(callback) && SC.typeOf(easing) == SC.T_FUNCTION) {
      callback = easing;
      easing = undefined;
    }
    return this._ll_animate(this, newAttrs, ms, easing, callback);
  },
  attr: function(attr) { this._elements.invoke("attr", attr); },
  toFront: function() { this._elements.invoke("toFront"); },
  toBack: function() {
    // must invoke toBack in inverse order to preserve internal group z-order
    for (var i = this._elements.length-1; i >= 0; i--) {
      this._elements[i].toBack();
    }
  }

  // Automatically handled by the implementation in "element"
  //dragBegin: function() { this._elements.invoke("dragBegin"); },
  //dragMove: function(dx, dy) { this._elements.invoke("dragMove", dx, dy); },
  //dragEnd: function() { this._elements.invoke("dragEnd"); }

});