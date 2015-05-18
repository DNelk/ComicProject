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
  lastTime: 0,
  levelScore: 0, //Current score - maybe use later
  totalScore: 0, //Overall Score - maybe use later
  animationTimer: 0, //Timer
  blinkTimer: 0,
  textTimer: 0,
  startFade: 1.0,
  player: undefined, //Player character
  enemies: [],  //Array of enemy characters
  enemyCount: 10,
  gameState: app.GAME_STATES.BEGIN, //The state of the game
  blink: false,
  bg: undefined,
  start:undefined,
  controls:undefined,
  goText:undefined,
  controlFade: 0.0,    
  bgX: 0,
  bgY: 0,
  bgX2: 1600,
  bgY2: 0,
  level: 0,
  goFade: 0.0,
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
    this.bg = new Image();
    this.bg.src = app.IMAGES.BG;
    
    this.start = new Image();
    this.start.src = app.IMAGES.START;
      
    this.controls = new Image();
    this.controls.src = app.IMAGES.CONTROLS;
      
    this.goText = new Image();
    this.goText.src = app.IMAGES.GAME_OVER;
    this.reset();

    this.update();
  },

  reset: function(){
    this.bgX = 0;
    this.bgX2 = 1600;
	this.blinkTimer = 0;
    this.animationTimer = 0;
    this.level = 1;
	this.fillEnemies();
    this.player = new app.Player(320,app.CANVAS_HEIGHT);
  },
  
  //check for collisions 
  checkForCollisions: function() {
	//check for player collision with enemy
	this.enemies.forEach(function(enemy) {
		if( app.Game.collides(enemy, app.Game.player)) {
			app.Game.player.takeDamage(10);
		}
    });
	
	//check collisions with each bullet and enemy
	this.player.bullets.forEach(function(bullet) {
		app.Game.enemies.forEach(function(enemy) {
			if( app.Game.collides(bullet, enemy) && bullet.active) {
				enemy.takeDamage(bullet.damage);
				bullet.active = false;
			}
		});
	});
  },
  
  //check collisions between two characters
  collides: function(a, b) {
	var ax = a.pos.x - a.width/2;
	var ay = a.pos.y - a.height/2;
	var bx = b.pos.x - b.width/2;
	var by = b.pos.y - b.height/2;
	
	return ax < bx + b.width &&
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

    if(this.gameState == app.GAME_STATES.BEGIN){
        this.gameState = app.GAME_STATES.DEFAULT;   
        this.startFade = 1.0;
    }
      
  	//Start all over if the game is over
    if(this.gameState == app.GAME_STATES.GAME_OVER){
      this.gameState = app.GAME_STATES.DEFAULT;
      //Reset Everything
	  this.levelIndex = 0;
      this.levelScore = 0;
      this.totalScore = 0;
	  this.enemies = [];
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
      
    //Animate  
    if(this.startFade > 0 && this.gameState == app.GAME_STATES.DEFAULT){
      this.startFade -= 0.01;
      if(this.startFade < 0)
          this.startFade = 0;
    }
      
    if(this.animationTimer > 0){
        this.animationTimer-=10;
        this.bgX-=10;
        this.bgX2-=10;
        if(this.bgX <= -1600)
            this.bgX = 1600;
        if(this.bgX2 <= -1600)
            this.bgX2 = 1600;
        
    }
    // Check paused
    // Update methods go in here
    if(!this.paused && this.gameState != app.GAME_STATES.BEGIN && !this.gameOver){
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
               if(this.gameState == app.GAME_STATES.ROUND_OVER && this.textTimer < 150)
                   this.nextLevel();
	       }                      
	                              
	       if(app.keysDown[app.KEYS.KEY_ENTER]){
	       	   app.keysDown[app.KEYS.KEY_ENTER] = false; //So they only register once
			   this.player.fire();
	       }
		   
		   if(app.keysDown[app.KEYS.KEY_SPACE]){
				app.keysDown[app.KEYS.KEY_SPACE] = false; //So they only register once
				this.player.fire();
		   }
        this.player.update(dt);
		
		for( var i = 0; i < this.enemies.length; i++ ){
			this.enemies[i].update(dt);
			if(this.enemies[i].dead && !this.enemies[i].hit){
				this.enemies.splice(i,1);
				i--;
				if( !this.gameOver ) {
					this.totalScore += 10;
				}
			}
		} 
	
		if(this.enemies.length == 0 && this.gameState == app.GAME_STATES.DEFAULT) {
            this.gameState = app.GAME_STATES.ROUND_OVER;
            this.textTimer = 300;
			if( !this.gameOver ) {
				this.totalScore += 100;
			}
		}
		//if player dies, enter game over state		
		if(this.player.health <= 0) {
			this.gameState = app.GAME_STATES.GAME_OVER
		}
		//loop through bullets and make them move, and delete them if necessary
		for( var i = 0; i < this.player.bullets.length; i++ )
		{
			this.player.bullets[i].update(dt);
			if(!this.player.bullets[i].active){
				this.player.bullets.splice(i,1);
				i--;
			}
		}
		
		//enemy movement
		for( var i = 0; i < this.enemies.length; i++ )
		{
			if( this.player.pos.x < this.enemies[i].pos.x )
			{
				this.enemies[i].moveLeft();
			}
			else
			{
				this.enemies[i].moveRight();
			}
		}
		
		this.checkForCollisions();
    }

    // Draw
    this.drawBackground();
	this.drawGUI();
    this.player.draw(this.ctx);
	for( var i = 0; i < this.enemies.length; i++ ){
			this.enemies[i].draw(this.ctx);
	} 
    for( var i = 0; i < this.player.bullets.length; i++ ){
			this.player.bullets[i].draw(this.ctx);
	}
    this.ctx.save();
    this.ctx.globalAlpha = this.startFade;
    this.ctx.drawImage(this.start,0,0);
    this.ctx.restore();
    
    if(this.gameState == app.GAME_STATES.BEGIN){
        this.ctx.save();
        this.ctx.globalAlpha = this.controlFade;
        this.ctx.drawImage(this.controls,0,0);
        this.ctx.restore();
        this.controlFade += 0.002;
    }
      
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
    this.ctx.font = '700 '+size+'px Kalam';
    this.ctx.fillStyle = color;
    this.ctx.fillText(string, x, y);
  },
  
  //Draw the background
  drawBackground: function(){
    this.ctx.save();
    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(0,0,app.CANVAS_WIDTH, app.CANVAS_HEIGHT);
    this.ctx.drawImage(this.bg,this.bgX,this.bgY);
    this.ctx.drawImage(this.bg,this.bgX2,this.bgY2);
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
    // draw hp & text
	this.ctx.save();
    this.ctx.fillStyle = "white";
    this.drawText("Health", 20,20,20,"white");
    this.ctx.fillRect(20,25,200,25);
    this.ctx.fillStyle = "#00ff00";
    this.ctx.fillRect(21,26,this.player.health/this.player.maxHealth * 200, 23);
    this.ctx.restore();
  
    if(this.gameState == app.GAME_STATES.BEGIN){
      this.ctx.save();
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.restore();
    }

    
    if(this.gameState == app.GAME_STATES.ROUND_OVER){
      this.blinkTimer++;
      if(this.blinkTimer == 10){
          this.blink = !this.blink;
          this.blinkTimer = 0;
      }
      if(this.blink){
        this.ctx.save();
        this.ctx.fillStyle = "yellow";
        this.ctx.translate(app.CANVAS_WIDTH-200,app.CANVAS_HEIGHT/2-60);
        this.ctx.scale(75,60);
        this.ctx.beginPath();
        this.ctx.moveTo(0,0.5);
        this.ctx.lineTo(1,0.5);
        this.ctx.lineTo(1,0);
        this.ctx.lineTo(2,1);
        this.ctx.lineTo(1,2);
        this.ctx.lineTo(1,1.5);
        this.ctx.lineTo(0,1.5);
        this.ctx.closePath();   
        this.ctx.fill();
  	     this.ctx.restore();
      }
      if(this.textTimer > 0){
        this.textTimer--;  
        this.ctx.save();
        this.ctx.globalAlpha = this.textTimer/300;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.save();
        this.ctx.globalAlpha = this.textTimer/300;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0,0,app.CANVAS_WIDTH, app.CANVAS_HEIGHT);
        this.ctx.restore();
        switch(this.level){
                case 1: 
                this.drawText("Thank You! You're a hero!!", app.CANVAS_WIDTH/2, app.CANVAS_HEIGHT/2 - 40, 50, "white");
                break;
                case 2: 
                this.drawText("Once again,", app.CANVAS_WIDTH/2, app.CANVAS_HEIGHT/2 - 40, 50, "white");
                this.drawText("you've saved the day!", app.CANVAS_WIDTH/2, app.CANVAS_HEIGHT/2 + 10, 50, "white");
                break;
                case 3: 
                this.drawText("But are you really", app.CANVAS_WIDTH/2, app.CANVAS_HEIGHT/2 - 40, 50, "white");
                 this.drawText("trying to help us?!", app.CANVAS_WIDTH/2, app.CANVAS_HEIGHT/2 + 10, 50, "white");
                break;
                case 4: 
                this.drawText("Mind your own business.", app.CANVAS_WIDTH/2, app.CANVAS_HEIGHT/2 - 40, 50, "white");
                break;
                default: 
                this.drawText("We don't want you anymore.", app.CANVAS_WIDTH/2, app.CANVAS_HEIGHT/2 - 40, 50, "white");
                
        }
        this.ctx.restore();
    }
    }

    if(this.gameState == app.GAME_STATES.GAME_OVER){
      this.ctx.save();
	  this.gameOver = true;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.globalAlpha = this.goFade;
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0,0,app.CANVAS_WIDTH, app.CANVAS_HEIGHT); 
      this.ctx.drawImage(this.goText,0,0);
      this.ctx.restore();
      this.goFade+=0.005;    
    }
  },
  
  //Fill the enemies array with enemies
  fillEnemies: function(){
		for(var i = 0; i < this.enemyCount; i++){
			this.enemies.push(new app.Enemy(app.Utilities.getRandom(0, app.CANVAS_WIDTH), app.Utilities.getRandom(-200,0)));
		}
  },
  
    
    nextLevel: function(){
        this.gameState = app.GAME_STATES.DEFAULT;
        this.animationTimer = 400;
        this.level++;
        this.player.ageUp();
        this.fillEnemies();
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
