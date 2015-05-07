/*Game.js
 *Dylan Nelkin
 *Last Modified: 5/6/15
 *The actual code and logic of the game, also the drawing
*/

'use strict'

var app = app || {};

app.Game = {

  // "Global" Attributes, not really global since we're in our own module here
  canvas: undefined, ctx: undefined, //Canvas
  paused: false, //Is the game paused?
  isMouseDown: false, //Is the mouse down?
  gameOver: false, //Is the game over?
  animationID: 0, //Current frame index
  levelScore: 0, //Current score - maybe use later
  totalScore: 0, //Overall Score - maybe use later
  lastTime: 0, //The last actual time since the frame changed
  timer: 0, //Timer
  player: undefined, //Player character
  enemies: [],  //Array of enemy characters
  
  gameState: app.GAME_STATES.DEFAULT, //The state of the game

  //tileAudio : undefined, //Audio Var

  init: function(){
    // Pausing event listeners
    window.addEventListener("blur", this.onBlur.bind(this)); //When focus is lost from the canvas
    window.addEventListener("focus", this.onFocus.bind(this)); //When focus is back to the canvas

    // Add mouse events
    window.addEventListener("mousedown", this.doMouseDown.bind(this));
    window.addEventListener("mouseup", this.doMouseUp.bind(this));

	//Get the canvas
    this.canvas = document.querySelector("#MainCanvas");
    this.ctx = this.canvas.getContext("2d");
	
	//Load the audio
    /*this.tileAudio = document.querySelector("#tileAudio");
	this.tileAudio.src = app.SOUNDS.TILE;
    this.tileAudio.volume = 1;
	*/
    this.reset();

    this.update();
  },

  reset: function(){
	this.levelScore = 0; //Reset the score
	this.moveCount = 0; //Reset Moves
	this.timer = 0;
	this.fillEnemies();
    this.player = new app.Player(320,320);
  },
  
  //check for collisions 
  checkForCollisions: function() {
	//check for player collision with enemy
	this.enemies.forEach(function(enemy) {
		if( self.collides(enemy, self.player)) {
			player.health -= 10;
		}
    });
	
	//check collisions with each bullet and enemy
	player.bullets.forEach(function(bullet) {
		self.enemies.forEach(function(enemy) {
			if( self.collides(bullet, enemy)) {
				enemy.health -= 2;
				bullet.active = false;
			}
		});
	});
  },
  
  //check collisions between two characters
  collides: function(a, b) {
	var ax = a.x - a.width/2;
	var ay = a.y - a.height/2;
	var bx = b.x - b.width/2;
	var by = b.y - b.height/2;
	
	return ax < bx + b.widht &&
		   ax + a.width > bx &&
		   ay < by + b.height &&
		   ay + a.height > by;
  },

  // Mouse goes down
  doMouseDown: function(e){
    if(!this.isMouseDown){
      this.isMouseDown = true;
    } else {
      return;
    }
  },

  //Mouse goes up
  doMouseUp: function(e){
    this.isMouseDown = false;
	
	//Unpause
    if(this.paused){
      this.paused = false;
      this.update();
      return;
    }

  	//Start all over if the game is over
    if(this.gameState == app.GAME_STATES.GAME_OVER){
      this.gameState = app.GAME_STATES.DEFAULT;
      //Reset Everything
	  this.levelIndex = 0;
      this.levelScore = 0;
      this.totalScore = 0;
      this.gameOver = false;
      this.reset();
      this.update();
      return;
    }

    if(this.gameState != app.GAME_STATES.CLICKED){ //Can we click again?   
		var mouse = app.Utilities.getMouse(e); //Get the mouse
    }
  }, 

  // Update the game
  update: function(){
    // Update deltaTime
    var dt = this.calculateDeltaTime();
	
    // Check paused
    // Update methods go in here
    if(!this.paused){
        //KEY PRESSES
	       if(app.keysDown[app.KEYS.KEY_S]){
	       	   app.keysDown[app.KEYS.KEY_S] = false; //So they only register once
	       }                      
	                              
	       if(app.keysDown[app.KEYS.KEY_W]){
               app.keysDown[app.KEYS.KEY_W] = false; //So they only register once
                this.player.jump();
	       }                      
	                              
	       if(app.keysDown[app.KEYS.KEY_A]){
	       	app.keysDown[app.KEYS.KEY_A] = false; //So they only register once
               this.player.moveLeft();
	       }                      
                                   
	       if(app.keysDown[app.KEYS.KEY_D]){
	       	   app.keysDown[app.KEYS.KEY_D] = false; //So they only register once
                this.player.moveRight();
	       }                      
	                              
	       if(app.keysDown[app.KEYS.KEY_ENTER]){
	       	   app.keysDown[app.KEYS.KEY_ENTER] = false; //So they only register once
	       }
		   
		   if(app.keysDown[app.KEYS.KEY_SPACE]){
				app.keysDown[app.KEYS.KEY_SPACE] = false; //So they only register once
				this.player.fire(this.player.x, this.player.y);
		   }
        this.player.update(dt);
		
		//loop through bullets and make them move
		for( var i = 0; i < this.player.bullets.length; i++ )
		{
			this.player.bullets.update(this.dt);
		}
    }

    // Draw
    this.drawBackground();
	this.drawGUI();
    this.player.draw(this.ctx);
      
    if(this.paused){
      this.drawPauseScreen();
      return; //Don't count this as a frame since no one was playing
    }

    // Loop
    this.animationID = requestAnimationFrame( this.update.bind(this) );
  },


  // Drawing functions
  
  //Draw text
  drawText: function(string, x, y, size, color) {
    this.ctx.font = '900 '+size+'px Arial';
    this.ctx.fillStyle = color;
    this.ctx.fillText(string, x, y);
  },
  
  //Draw the background
  drawBackground: function(){
    this.ctx.save();
    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(0,0,app.CANVAS_WIDTH, app.CANVAS_HEIGHT);
    this.ctx.restore();
  },
  
  //Draw the pause screen
  drawPauseScreen: function(){
    this.ctx.save();
    this.ctx.globalAlpha = 0.6;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0,0,app.CANVAS_WIDTH, app.CANVAS_HEIGHT);
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.drawText("...PAUSED...", app.CANVAS_WIDTH/2, app.CANVAS_HEIGHT/2 + 200, 60, "white");
    this.ctx.restore();
  },
  
  //Draw the GUI
  drawGUI: function(){
    // draw move text
	this.drawText("Score: " + this.levelScore, app.CANVAS_WIDTH - 180, 20, 16, "white");
  
    if(this.gameState == app.GAME_STATES.BEGIN){
      this.ctx.save();
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.restore();
    }

    if(this.gameState == app.GAME_STATES.ROUND_OVER){
      this.ctx.save();
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
  	  this.ctx.save();
  	  this.ctx.globalAlpha = 0.6;
  	  this.ctx.fillStyle = "black";
  	  this.ctx.fillRect(0,0,app.CANVAS_WIDTH, app.CANVAS_HEIGHT);
  	  this.ctx.restore();
  	  this.ctx.restore();
  	  this.drawText("Round Over!", app.CANVAS_WIDTH/2, app.CANVAS_HEIGHT/2 - 40, 50, "white");
  	  this.drawText("Click anywhere to continue...", app.CANVAS_WIDTH/2, app.CANVAS_HEIGHT/2 + 35, 35, "white");
      this.ctx.restore();
    }

    if(this.gameState == app.GAME_STATES.GAME_OVER){
      this.ctx.save();
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.save();
      this.ctx.globalAlpha = 0.6;
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0,0,app.CANVAS_WIDTH, app.CANVAS_HEIGHT);
      this.ctx.restore();
      this.drawText("Game Over!", app.CANVAS_WIDTH/2, app.CANVAS_HEIGHT/2 - 40, 50, "white");
      this.drawText("You lasted: " + this.moveCount + " moves", app.CANVAS_WIDTH/2, app.CANVAS_HEIGHT/2, 25, "white");
	  this.drawText("Final Score: " + this.levelScore, app.CANVAS_WIDTH/2, app.CANVAS_HEIGHT/2 + 30, 25, "#white");
      this.ctx.restore();
    }
  },
  
  //Fill the enemies array with enemies
  fillEnemies: function(){
  
  },
  
  // Utilities
  //Gets the Delta time, which is the change in time between frames. Important for frame animation.
  calculateDeltaTime: function(){
    var now, fps;
    now = (+new Date);
    fps = 1000 / (now - this.lastTime);
    fps = app.Utilities.clamp(fps, 12, 60);
    this.lastTime = now;
    return 1/fps;
  },
  
  stopAudio: function(){
    //we can use this later
  },
  playEffect: function(key){
    //we can use this later too
  },

  // Pause functions
  onBlur: function(){
    //this.stopAudio();
    this.paused = true;
    cancelAnimationFrame(this.animationID);
    this.update();
  },
  
  onFocus: function(){
    cancelAnimationFrame(this.animationID);
    this.paused = false;
    this.update();
  }
}
