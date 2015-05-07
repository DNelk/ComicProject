/*Enemy.js
 *Tim Cotanch
 *Last Modified: 5/6/15
 *Enemy Module
*/


'use strict'

var app = app || {};

app.Enemy = function(){
	function Enemy(x, y){
	    this.pos = {x:x, y:y}; //Position
        this.accel = {x:0.0, y:0.0}; //Acceleration
        this.vel = {x:0.0, y:0.0}; //Acceleration
	    this.width = 50;
	    this.height = 50;
        this.speed = 100;
        this.jumpHeight = 20;
        this.jumping = true;
	    this.health = 10;
	    this.r = 1.0;
        this.g = 0.0;
        this.b = 0.0;
        this.a = 1.0;
    };

    var p = Enemy.prototype;
    
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
    //draw the enemy sprite
	p.draw = function(ctx) {
		
        var halfW = this.width/2;
		var halfH = this.height/2;
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.fillStyle = 'rgba('+this.r*255+","+this.g*255+","+this.b*255+","+this.a+")";
        ctx.fillRect(-halfW, -halfW, this.width, this.height);
        ctx.restore();
	};
	
	//movement for the enemy
	p.moveLeft = function(){
		this.accel.x -= this.speed;
	};
	
	p.moveRight = function(){
		this.accel.x += this.speed;
	};
	
	p.jump = function(dt){
		if(!this.jumping){
            this.accel.y -= this.jumpHeight;
            this.jumping = true;
        }
	};

    return Enemy;
}();