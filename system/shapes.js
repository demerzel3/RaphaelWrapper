/**
 * User: assa
 * Date: 7-ott-2010
 * Time: 9.15.31
 */

Raphael.Rect = Raphael.Element.extend({
  createNativeElement: function(canvas, nativeCanvas) {
    return nativeCanvas.rect(
            this.attr("x") || 0,
            this.attr("y") || 0,
            this.attr("width") || 20,
            this.attr("height") || 20);
  }
});

Raphael.Circle = Raphael.Element.extend({
  createNativeElement: function(canvas, nativeCanvas) {
    return nativeCanvas.circle(
            this.attr("cx") || 0,
            this.attr("cy") || 0,
            this.attr("r") || 0);
  }
});

Raphael.Ellipse = Raphael.Element.extend({
  createNativeElement: function(canvas, nativeCanvas) {
    return nativeCanvas.ellipse(
            this.attr("cx") || 0,
            this.attr("cy") || 0,
            this.attr("rx") || 0,
            this.attr("ry") || 0);
  }
});

Raphael.Text = Raphael.Element.extend({
  createNativeElement: function(canvas, nativeCanvas) {
    return nativeCanvas.text(
            this.attr("x") || 0,
            this.attr("y") || 0,
            this.attr("text") || "",
            this.attr("dir") || "",
            this.attr("size") || "");
  }
});

Raphael.Path = Raphael.Element.extend({
  createNativeElement: function(canvas, nativeCanvas) {
    return nativeCanvas.path(this.attr("path"));
  }
});