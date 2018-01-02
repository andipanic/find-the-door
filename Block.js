/**
 * Block Object
 */
 var Block = function(x = null, y = null, size = null) {
   this.x = x;
   this.y = y;
   this.size = size;
   this.explode = false;
   this.particles = [];
   this.particle_size = Math.max(size / 8, 8);
   this.hidden = false;
   this.finished = false;
   this.isDoor = false;
   this.color = r() + ", " + r() + ", " + r();
   this.draw = function() {
     if (!this.hidden) {
       game.c.fillStyle = 'rgba(' + this.color + ', 1)';
       game.c.fillRect(this.x, this.y, this.size, this.size);
     }

   }
   this.drawParticles = function() {
     if (this.particles.length == 0) {
       this.finished = true;
     }
     for (var i = 0; i < this.particles.length; i++) {
       this.particles[i].update();
       if (this.particles[i].alpha < .1) {
         this.particles.splice(i, 1);
       }
     }
   }
   this.update = function() {
     if (this.explode && !this.hidden) {
       for (var i = this.x; i < this.x + this.size; i += this.particle_size) {
         for (var j = this.y; j < this.y + this.size; j += this.particle_size) {
           this.particles.push(new Particle(i, j, this.particle_size));
         }
       }
       this.hidden = true;
       this.explode = false;
     }
     if (this.hidden) {
       this.drawParticles();
     } else {
       this.draw();
     }
   }
 }
