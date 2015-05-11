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
	    this.width = 30;
	    this.height = 30;
        this.speed = 100;
        this.jumpHeight = 20;
        this.jumping = true;
	    this.health = 10;
		this.dead = false;
	    this.r = 0.25;
        this.g = 0.25;
        this.b = 0.25;
        this.a = 1.0;
        this.hit = false;
        this.hitTimer = 0;
    };

    var p = Enemy.prototype;
    
    p.update = function(dt){
        if(this.hitTimer > 0 && this.hit){
            this.hitTimer -= 10 * dt;
            //console.log(this.hitTimer)
        }
        else{
            this.hitTimer = 0;
            this.hit = false;
        }
		if(this.health <= 0){
			this.dead = true;
			return;
		}
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
        ctx.fillStyle = 'rgba('+Math.floor(this.r*255)+","+Math.floor(this.g*255)+","+Math.floor(this.b*255)+","+this.a+")";
        if(this.hit){
            ctx.fillStyle = "yellow";
        }
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

    p.takeDamage = function(damage){
        if(!this.hit){
            this.health -= damage;
            this.hit = true;
            this.hitTimer = 1;
        }
    };
    return Enemy;
}();