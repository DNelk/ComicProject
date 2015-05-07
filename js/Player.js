/*Player.js
 *Tim Cotanch
 *Last Modified: 5/6/15
 *Player Module
*/


'use strict'

var app = app || {};

app.Player = function(){
	function Player(x, y){
	    this.pos = {x:x, y:y}; //Position
        this.accel = {x:0.0, y:0.0}; //Acceleration
        this.vel = {x:0.0, y:0.0}; //Acceleration
	    this.width = 50;
	    this.height = 50;
	    this.age = 1.0;
        this.speed = 1000;
        this.jumpHeight = 200;
        this.jumping = true;
	    this.health = 100;
	    this.r = 1.0;
        this.g = 0.0;
        this.b = 0.0;
        this.a = 1.0;
		this.bullets = [];
    };

    var p = Player.prototype;
    
    p.update = function(dt){
        //Move
        this.vel.x = 0;
        this.vel.x += this.accel.x;
        this.vel.y += this.accel.y;
        
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;
        
        this.accel.x *= 0.9;
        this.accel.y *= 0.9;
        if(this.jumping)this.accel.y += 9.8;
        
        this.pos.x = app.Utilities.clamp(this.pos.x, this.width/2, app.CANVAS_WIDTH - this.width/2);
        this.pos.y = app.Utilities.clamp(this.pos.y, this.height/2, app.CANVAS_HEIGHT - this.height/2);
        if(this.pos.x == this.width/2 || this.pos.x == app.CANVAS_WIDTH - this.width/2){
            this.accel.x = 0;
            this.vel.x = 0;
        }
        if(this.pos.y == app.CANVAS_HEIGHT - this.height/2){
            this.jumping = false;
            this.accel.y = 0;
            this.vel.y = 0;
        }
    };
    //draw the player sprite
	p.draw = function(ctx) {
		
        var halfW = this.width/2;
		var halfH = this.height/2;
		/*if(!this.image)
		{
			this.drawLib.rect(ctx, this.x - halfW, this.y - halfH, this.width, this.height, this.color);
		}
		else
		{
			ctx.drawImage(this.image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, this.width, this.height);
		}*/
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.fillStyle = 'rgba('+this.r*255+","+this.g*255+","+this.b*255+","+this.a+")";
        ctx.fillRect(-halfW, -halfW, this.width, this.height);
        ctx.restore();
	};
	
	//movement for the player
	p.moveLeft = function(){
		this.accel.x -= this.speed * this.age;
	};
	
	p.moveRight = function(){
		this.accel.x += this.speed * this.age;
	};
	
	p.jump = function(dt){
		if(!this.jumping){
            this.accel.y -= this.jumpHeight * this.age;
            this.jumping = true;
        }
	};

    //Fire projectile
    p.fire = function(){
		this.bullets.push(new app.Bullet(this.pos.x, this.pos.y, 100));
    };
    
    //Age the player
    p.age = function(){
    };
    return Player;
}();