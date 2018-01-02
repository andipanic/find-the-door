/**
 * KeyHandler Object
 */
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
