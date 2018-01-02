/**
 * Game Object
 */
var Game = function () {
  this.canvas = document.getElementById("canvas")
  this.c = this.canvas.getContext("2d")
  this.height = window.innerHeight - 4 // minus menu?
  this.width = this.height
  this.canvas.width = this.height
  this.canvas.height = this.height
}

var game = new Game()

/**
 * Game Loop
 */
var current_map = MapGen(16)
var loop = function () {
  game.c.fillStyle = "white";
  game.c.fillRect(0, 0, game.width, game.height)
  Player.update()

  // All of this should be in MapGen.update width
  // something to handle only updating the right blocks.
  for (var i=0; i < current_map.length; i++) {
    if (intersectRect(Player, current_map[i])) {
      current_map[i].explode = true;
    }
    current_map[i].update()
  }
  requestAnimationFrame(loop)
}

loop()
