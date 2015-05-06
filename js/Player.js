/*Player.js
 *Tim Cotanch
 *Last Modified: 5/6/15
 *Player Module
*/


'use strict'

var app = app || {};

app.Player = function(){
	function Player(x, y){
	    this.x = x;
	    this.y = y;
	    this.width = 50;
	    this.height = 50;
	    this.age = 1.0;
        this.speed = 500;
	    this.health = 100;
	    //this.image: undefined,
	   //this.drawLib: undefined,
	    this.r = 1.0;
        this.g = 0.0;
        this.b = 0.0;
        this.a = 1.0;
    };

    var p = Player.prototype;
    
    p.update = function(dt){
        
    };
    //draw the player sprite
	p.draw = function(ctx) {
		
        var halfW = this.width/2;
		var halfH = this.height/2;
		var sourceX; //X from spritesheet
		/*var sourceY; //Y from spritesheet
		var sourceWidth; //Width from spritesheet
		var sourceHeight; //Height from spritesheet
		var destWidth = sourceWidth;
		var destHeight = sourceHeight;
		var desX = this.x - halfW;
		var desY = this.y - halfH;
		
		if(!this.image)
		{
			this.drawLib.rect(ctx, this.x - halfW, this.y - halfH, this.width, this.height, this.color);
		}
		else
		{
			ctx.drawImage(this.image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, this.width, this.height);
		}*/
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = 'rgba('+this.r*255+","+this.g*255+","+this.b*255+","+this.a+")";
        ctx.fillRect(-halfW, -halfW, this.width, this.height);
        ctx.restore();
	};
	
	//movement for the player
	p.moveLeft = function(dt){
		this.x -= this.speed * this.age * dt;
        console.log(dt);
	};
	
	p.moveRight = function(dt){
		this.x += this.speed * this.age * dt;
	};
	
	p.moveUp = function(dt){
		this.y -= this.speed * this.age * dt;
	};
	
	p.moveDown = function(dt){
		this.y += this.speed * this.age * dt;
	};
    
    p.fire = function(){
    }
    return Player;
}();