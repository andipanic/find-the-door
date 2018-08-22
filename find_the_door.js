var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

var menu = document.getElementById("menu");

console.log(window.innerWidth - canvas.height)

menu.style.width = (window.innerWidth - canvas.height - 30) + "px";
canvas.style.width = canvas.width;

// Handle key input
var KeyHandler = {
  init: function() {
    window.addEventListener('keydown', event =>
      KeyHandler.keyDown(event), false);
    window.addEventListener('keyup', event =>
      KeyHandler.keyUp(event), false);
  },
  pressed: [],
  keyDown: function(e) {
    this.pressed[e.keyCode] = true;
  },
  keyUp: function(e) {
    this.pressed[e.keyCode] = false;
  },
}

KeyHandler.init();

var joystick = new VirtualJoystick({container: document.getElementById('body'),
                                    mouseSupport: true,
                                    limitStickTravel: true})

// Objects
var Player = {
  x: 100,
  y: 100,
  vx: 4,
  vy: 4,
  color: 255 + ", " + 0 + ", " + 0,
  size: 8,
  update: function() {

    // Left
    if (KeyHandler.pressed[37] || joystick.left()) {
      this.x -= this.vx;
    }
    // Up
    if (KeyHandler.pressed[38] || joystick.up()) {
      this.y -= this.vy;
    }
    // Right
    if (KeyHandler.pressed[39] || joystick.right()) {
      this.x += this.vx;
    }
    // Down
    if (KeyHandler.pressed[40] || joystick.down()) {
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
    c.fillStyle = "rgba(" + this.color + ", 1)";
    c.fillRect(this.x, this.y, this.size, this.size);
  }
}


function r(n) {
  if (n) {
    return parseInt(Math.random() * n);
  } else {
    return parseInt(Math.random() * 255);
  }
}

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
    c.fillStyle = "rgba(" + this.color + "," + this.alpha + ")";
    c.fillRect(this.x, this.y, this.size, this.size);
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

var Tile = function(x = null, y = null, size = null) {
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
      c.fillStyle = 'rgba(' + this.color + ', 1)';
      c.fillRect(this.x, this.y, this.size, this.size);
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

function intersectRect(r1, r2) {
  return !(r2.x > r1.x + r1.size ||
    r2.x + r2.size < r1.x ||
    r2.y > r1.y + r1.size ||
    r2.y + r2.size < r1.y);
}



var generate_map = function(x) {
  var grid = [];
  var div = canvas.height / x;
  for (var i = 0; i < canvas.height; i += div) {
    for (var j = 0; j < canvas.height; j += div) {
      grid.push(new Tile(i, j, div));
    }
  }
  grid[r(grid.length)].isDoor = true;
  return grid;
}

var exploded = [];
var level = 1;
var blocks = generate_map(level);
var found = false;
var now = new Date().getTime();
var update = undefined
var update_color = 500
var foundTime = undefined
var theDoor = undefined
var timeSinceFound = undefined
var alpha = 0

function loop() {
  update = new Date().getTime() - now;
  if (update % 2 === 0) {
    update_color -= 1
  }
  if (update_color < 100) {
    alpha += .01
  }
  c.fillStyle = "rgba(" + update_color + ", " + update_color + ", " + update_color + ", 1)"
  c.fillRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].finished) {
      continue
    }
    if (intersectRect(Player, blocks[i])) {
      if (Player.color == blocks[i].color || blocks[i].color == "0, 0, 255" || blocks[i].color == "0, 255, 0") {
        console.log('Found one!')
        update_color += 500
      }
      if (blocks[i].isDoor) {
        found = true;

        if (foundTime === undefined) {
          foundTime = new Date().getTime()
        }
        theDoor = blocks[i]

      } else {
        blocks[i].explode = true;
        //var removed = blocks.splice(i, 1)[0]
        var removed = blocks[i]
        if (!exploded.indexOf(removed)) {
          exploded.push(removed);
          console.log(exploded.indexOf(removed));
        }
      }
    }

    if (found && new Date().getTime() - foundTime > 1500) {
      level *= 2;
      // Player.size += (Player.size * .1)
      // Player.vx += 1
      // Player.vy += 1
      blocks = generate_map(level);
      found = false;
      foundTime = undefined
      update_color += 250
    } else if (found) {
      c.fillStyle = "white"
      c.fillRect(0, 0, canvas.width, canvas.height)
      if (update % 2 === 0) {
        theDoor.color = r() + ", " + r() + ", " + r()
      }
      theDoor.explode = true
      if (theDoor.hidden) {
        theDoor.hidden = false
      }
      theDoor.update()
      continue
    }

    blocks[i].update();
  }
  for (var i = 0; i < exploded.length; i++) {
    if (!exploded[i].finished) {
      exploded[i].update();
    }
  }

  c.fillStyle = "rgba(" + update_color + ", " + update_color + ", " + update_color + ", " + alpha + ")"
  c.fillRect(0, 0, canvas.width, canvas.height);
  if (update_color < 0) {
    console.log("Game over!")
    level = 1
    update_color = 500
    alpha = 0
    blocks = generate_map(level)
  }
  Player.update()
  requestAnimationFrame(loop);
}
loop();
