/**
 * Player Object
 */
 var Player = {
   x: 100,
   y: 100,
   vx: 4,
   vy: 4,
   color: 255 + ", " + 0 + ", " + 0,
   size: 8,
   update: function() {

     // Left
     if (KeyHandler.pressed[37]) {
       this.x -= this.vx;
     }
     // Up
     if (KeyHandler.pressed[38]) {
       this.y -= this.vy;
     }
     // Right
     if (KeyHandler.pressed[39]) {
       this.x += this.vx;
     }
     // Down
     if (KeyHandler.pressed[40]) {
       this.y += this.vy;
     }

     // keep player in screen
     if (this.x > (canvas.height - this.size)) {
       this.x = canvas.height - this.size
     }
     if (this.x < 0) {
       this.x = 0
     }
     if (this.y > (canvas.height - this.size)) {
       this.y = (canvas.height - this.size)
     }
     if (this.y < 0) {
       this.y = 0
     }

     this.draw();
   },
   draw: function() {
     game.c.fillStyle = "rgba(" + this.color + ", 1)";
     game.c.fillRect(this.x, this.y, this.size, this.size);
   }
 }
