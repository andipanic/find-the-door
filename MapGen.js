/**
 * Map Generator Object
 * This should be keeping track of updated and exploded and only updating
 * those that need to be.
 */

var MapGen = function(x) {
  var grid = [];
  var div = game.height / x;
  for (var i = 0; i < game.height; i += div) {
    for (var j = 0; j < game.height; j += div) {
      grid.push(new Block(i, j, div));
    }
  }
  grid[r(grid.length)].isDoor = true;
  return grid;
}
