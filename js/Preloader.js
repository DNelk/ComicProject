/*Preloader.js
 *Dylan Nelkin
 *Last Modified: 4/26/15
 *Preload the assets and get the game ready
*/
'use strict'

var app = app || {};

// Setup window events
window.addEventListener('load', init);

// CONSTANTS
app.CANVAS_HEIGHT = 600;
app.CANVAS_WIDTH = 800;

//Keys
app.KEYS = {
	KEY_S: 83,
	KEY_W: 87,
	KEY_A: 65,
	KEY_D: 68,
	KEY_ENTER: 13
};

app.keysDown = [];

// Media
app.IMAGES = {
  //RED: "media/images/red.png",
}

app.SOUNDS = {
	//CREDIT: http://opengameart.org/content/54-casino-sound-effects-cards-dice-chips
  TILE: "media/sounds/chipsHandle6.wav"
}

// ENUMS


// STATES
app.GAME_STATES = Object.freeze({
  BEGIN: 0,
  DEFAULT: 1,
  ROUND_OVER: 2,
  GAME_OVER: 3
})

function init(){
	window.addEventListener("keydown", function(e){
			app.keysDown[e.keyCode] = true;
	});
	
	window.addEventListener("keyup", function(e){
			app.keysDown[e.keyCode] = false;
	});
	app.Game.init(app);
  // Preload images and sounds
	/*app.queue = new createjs.LoadQueue(false);
	app.queue.installPlugin(createjs.Sound);
	app.queue.on("complete", function(){
		//console.log("Images loaded");
		app.Game.init(app);
	});

  //app.Game.init();
  // Load images/sounds
  app.queue.loadManifest([
    {id: "TILE", src: app.SOUNDS.TILE},
    {id: "RED", src: app.BLOCK_IMAGES.RED}
  ]);
  */
}
