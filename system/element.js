/**
 * User: assa
 * Date: 6-ott-2010
 * Time: 19.25.52
 */
Raphael.Element = SC.Object.extend(
  /** @scope Raphael.Element.prototype */{

  /**
   * Walks like a duck
   */
  isRaphaelElement: YES,

  nativeElement: null,
  isDraggable: true,
  _nativeIsDraggable: false,
  id: null,
  location: null,
  attrs: null,
  canvas: null,
  _dragEvent: null,
  _group: null,
  isDragging: function() {
    return !(SC.none(this._dragEvent));
  }.property(),

  /**
   * Information on the current animation:
   * {
   *   startTime: ...,
   *   duration: ...
   * }
   */
  _animInfo: null,

  init: function() {
    // load location from attrs
    if (this.attrs && this.attrs["location"])
    {
      this.set("location", this.attrs["location"]);
      delete this.attrs["location"];
    }
    if (SC.none(this.location)) {
      this.location = {x: 0, y: 0};
    }
  },

  /**
   * Change native element position when location changes
   *
   * @private
   * @param canvas
   * @param nativeCanvas
   */
  _locationDidChange: function() {
    if (this.nativeElement) {
      var translation = this._locationChangeToTranslation();
      this.nativeElement.translate(translation.x, translation.y);
    } else {
      // TODO: try to remember why I put this else here
    }
  }.observes("location"),

  _isDraggableDidChange: function() {
    if (!this.nativeElement) {
      return;
    }
    // change draggable state on the fly
    if (this.isDraggable && !this._nativeIsDraggable) {
      this.nativeElement.drag(this._nativeDragMove, this._nativeDragBegin, this._nativeDragEnd);
    } else if (!this.isDraggable && this._nativeIsDraggable) {
      this.nativeElement.undrag(this._nativeDragMove, this._nativeDragBegin, this._nativeDragEnd);
    }
    this._nativeIsDraggable = this.isDraggable;
  }.observes("isDraggable"),

  /**
   * @private
   * @return Hash
   */
  _locationChangeToTranslation: function(newLocation) {
    var curLoc = this.attr("translation");
    newLocation = newLocation || this.location;
    return {x: newLocation.x - curLoc.x, y: newLocation.y - curLoc.y};
  },

  /**
   *
   * @param canvas Raphael.Canvas
   * @param nativeCanvas Raphael
   */
  createNativeElement: function(canvas, nativeCanvas) {
    var r = nativeCanvas.rect(0, 0, 40, 40, 5);
    r.attr({stroke: "#000", fill: "#fff"});
    return r;
  },

  /**
   * Template method, invoked before the addition to canvas
   * (useful to setup animations - not play them, since the nativeElement isn't in place at this stage)
   * @param canvas
   */
  willAddToCanvas: function(canvas) {},
  addToCanvas: function(canvas) {
    //console.log("Element " + this.id + " added to canvas");

    this.set("canvas", canvas);
    var el = this.createNativeElement(canvas, canvas.get("nativeCanvas"));
    // assign animation handler
    el.onAnimation(this._nativeOnAnimation);
    // make in the native element a reference to the wrapper (this element)
    el._wrapper = this;
    if (this.attrs)
      el.attr(this.attrs);
    if (!SC.none(el.node)) {
      if (this._group) {
        //console.log("Element " + this.id + " in group");
        el.node.id = this._group.get("id") + "__" + this.id;
      } else
        el.node.id = this.id;
    }
    this.set("nativeElement", el);
    // set location to the native element
    this._locationDidChange();
    this._isDraggableDidChange();
  },
  /**
   * Template method, invoked just after the addition to the canvas
   * (useful to play animations to put the element on scene)
   * @param canvas
   */
  didAddToCanvas: function(canvas) {},

  /**
   * Template method, called just before removing this element from the canvas
   * @param canvas
   */
  willRemoveFromCanvas: function(forced) { return true },
  removeFromCanvas: function(forced) {
    if (this.willRemoveFromCanvas(forced) || forced) {
      this.set("canvas", null);
      this.nativeElement.remove();
      this.set("nativeElement", null);
      this.didRemoveFromCanvas();
    }
  },
  /**
   * Template method, called just after this element has been removed from the canvas
   */
  didRemoveFromCanvas: function() {},

  attr: function(attr) {
    var hash = null;
    if (arguments.length == 2) {
      hash = {};
      hash[arguments[0]] = arguments[1];
    } else if (arguments.length == 1 && SC.typeOf(arguments[0]) == SC.T_HASH) {
      hash = arguments[0];
    }

    if (hash) {
      // special treatment for location!
      for (var attrName in hash) {
        if (attrName == "location") {
          this.set("location", hash[attrName]);
          delete hash[attrName];
        }
      }

      if (this.nativeElement) {
        return this.nativeElement.attr(hash);
      } else {
        for (var key in hash) {
          this.attrs[key] = hash[key];
        }
      }
    } else {
      // special threatment for location
      if (attr == "location")
        return this.get("location");
      else if (this.nativeElement)
        return this.nativeElement.attr(attr);
      else
        return this.attrs[attr];
    }
  },

  _ll_animate: function(sourceElement, newAttrs, ms, easing, callback, syncElement) {
    // convert a location animation to a translation animation before committing it
    for (var attrName in newAttrs) {
      if (attrName == "location") {
        var translation = this._locationChangeToTranslation(newAttrs["location"]);
        newAttrs["translation"] = "%@,%@".fmt(translation.x, translation.y);
        //delete newAttrs["location"];
        break;
      }
    }
    
    var newCallback = function() {
      if (!SC.none(this._wrapper))
        this._wrapper._ll_animationCallback.call(this._wrapper, sourceElement, newAttrs, callback);
    };

    // setup animation info
    this._animInfo = {
      startTime: new Date().getTime(),
      duration: ms
    };
    //console.log(this._animInfo.startTime + "  " + this._animInfo.duration);

    // handle synching
    var nativeSyncElement = syncElement;
    if (!SC.none(nativeSyncElement) && SC.typeOf(nativeSyncElement) == SC.T_OBJECT) {
      nativeSyncElement = nativeSyncElement.get("nativeElement");
    }

    if (SC.none(nativeSyncElement)) {
      // apply the animation on the native element
      if (SC.none(easing)) {
        this.nativeElement.animate(newAttrs, ms, newCallback);
      } else {
        this.nativeElement.animate(newAttrs, ms, easing, newCallback);
      }
    } else {
      // apply the animation on the native element (with synchronization)
      if (SC.none(easing)) {
        this.nativeElement.animateWith(nativeSyncElement, newAttrs, ms, newCallback);
      } else {
        this.nativeElement.animateWith(nativeSyncElement, newAttrs, ms, easing, newCallback);
      }
    }
  },
  animateWith: function(syncElement, newAttrs, ms, easing, callback) {
    // TODO: implement it in such a way that it works for keyframe animations as well
    if (SC.typeOf(easing) == SC.T_FUNCTION && SC.none(callback)) {
      callback = easing;
      easing = undefined;
    }
    this._ll_animate(this, newAttrs, ms, easing, callback, syncElement);
  },
  animate: function(newAttrs, ms, easing, callback) {
    // TODO: implement so that it works for keyframe animations as well
    // try to determine callback function in order to override it
    if (SC.typeOf(easing) == SC.T_FUNCTION && SC.none(callback)) {
      callback = easing;
      easing = undefined;
    }
    this._ll_animate(this, newAttrs, ms, easing, callback);
  },

  /**
   * @private
   */
  _ll_animationCallback: function(sourceElement, newAttrs, originalCallback) {
    // roughly reset location
    if (!SC.none(newAttrs["location"])) {
      var loc = newAttrs["location"];
      this.location = {x: loc.x,  y: loc.y};
    }
    // invoke user callback
    if (SC.none(this._group) || sourceElement == this)
    {
      if (!SC.none(originalCallback))
        originalCallback.call(sourceElement);
    } else {
      this._group._ll_animationCallback(sourceElement, newAttrs, originalCallback);
    }
  },
  toFront: function() { this.nativeElement.toFront(); },
  toBack: function() { this.nativeElement.toBack(); },

  _ll_onAnimation: function() {
    if (SC.none(this.onAnimation)) {
      return;
    }
    
  },

  _nativeOnAnimation: function() {
    if (this._wrapper == null)
      return;
    var elapsed = new Date().getTime() - this._wrapper._animInfo.startTime;
    var progress = ((elapsed / this._wrapper._animInfo.duration) * 100);
    //console.log("_nativeOnAnimation: " + progress + "% " + elapsed + "/" + this._wrapper._animInfo.duration);
  },
  _nativeDragBegin: function() {
    if (this._wrapper._group)
      this._wrapper._group.dragBegin(true);
    else
      this._wrapper.dragBegin(true);
  },
  _nativeDragMove: function(dx, dy) {
    if (this._wrapper._group)
      this._wrapper._group.dragMove(true, dx, dy);
    else
      this._wrapper.dragMove(true, dx, dy);
  },
  _nativeDragEnd: function() {
    if (this._wrapper._group)
      this._wrapper._group.dragEnd(true);
    else
      this._wrapper.dragEnd(true);
  },

  dragBegin: function(isNative) {
    var loc = this.get("location");
    this._dragEvent = Raphael.DragEvent.create({
      element: this,
      isNative: isNative,
      startPoint: {x: loc.x, y: loc.y}
    });

    this.animate({opacity: 0.5}, 100);
    this.toFront();

    this._notifyCanvas("elementDragBegin", [this._dragEvent]);
  },
  _checkDrag: function() {
    if (SC.none(this._dragEvent)) {
      throw new SC.Error.desc("Element is not being dragged");
    }
  },
  getDragLocation: function(dx, dy) {
    this._checkDrag();
    return {x: this._dragEvent.startPoint.x + dx, y: this._dragEvent.startPoint.y + dy};
  },
  dragMove: function(isNative, dx, dy) {
    var newLoc = this.getDragLocation(dx, dy);

    this.set("location", newLoc);

    this._dragEvent.isNative = isNative;
    this._dragEvent.delta = {x: dx, y: dy};
    this._notifyCanvas("elementDragMove", [this._dragEvent]);
  },
  dragEnd: function(isNative) {
    this._checkDrag();
    this.animate({opacity: 1}, 100);

    this._dragEvent.isNative = isNative;
    var isValidated = this._notifyCanvas("elementDragEnd", [this._dragEvent]);

    if (!isValidated) {
      this.rollbackDrag(this._dragEvent);
    } else {
      this.commitDrag(this._dragEvent);
    }
    this._dragEvent = null;
  },
  commitDrag: function(dragEvent) {
    // really nothing to do here.
  },
  rollbackDrag: function(dragEvent) {
    // put the element back with a bouncy animation
    this.animate({location: dragEvent.startPoint}, 500, "elastic");
  },

  /**
   * Notify the canvas that a certain event occured to us
   *
   * @param event
   * @param arguments
   */
  _notifyCanvas: function(event, arguments) {
    var canvas = this.get("canvas");
    if (!SC.none(canvas) && !SC.none(canvas[event]))
      return canvas[event].apply(canvas, arguments);
    else
      return NO;
  },


  // .......................................................
  // SC.RESPONDER SUPPORT
  //

  /** @property
    The nextResponder is usually the parentView.
  */
  nextResponder: function() {
    return this.get('canvas') ;
  }.property('canvas').cacheable()

});