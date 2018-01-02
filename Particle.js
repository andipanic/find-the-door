/**
 * Particle Object
 */
var Particle = function(x, y, size) {
  this.x = x;
  this.y = y;
  this.dy = Math.random();
  this.dx = Math.random() - .5;
  this.gravity = .9;
  this.size = size;
  this.alpha = 1;
  this.color = r() + ", " + r() + ", " + r();
  this.draw = function() {
    game.c.fillStyle = "rgba(" + this.color + "," + this.alpha + ")";
    game.c.fillRect(this.x, this.y, this.size, this.size);
  }
  this.update = function() {
    this.dy /= this.gravity;
    this.y += this.dy;
    this.x += this.dx;
    this.alpha -= .03;
    this.size -= (this.size * .04);
    this.draw();
  }
}
