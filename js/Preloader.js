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
  CLICKED: 2,
  ROUND_OVER: 3,
  GAME_OVER: 4
})

function init(){
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
