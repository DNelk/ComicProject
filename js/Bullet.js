/*Bullet.js
 *Tim Cotanch
 *Last Modified: 5/6/15
 *Bullet Module
*/

"use strict";
var app = app || {};

app.Bullet = function(){
	function Bullet(x, y, speed){
		this.pos = {x:x, y:y};
		this.active = true;
		this.vel = {x:speed, y:0};
		this.width = 10;
		this.height = 10;
		this.color = "black";
	};
	
	var p = Bullet.prototype;

	p.update = function(dt){
		this.pos.x += this.vel.x * dt;
		this.pos.y += this.vel.y * dt;
		this.active = checkOutOfBounds(this.pos, this.width, this.height);
		//console.log(this.active);
	};
	
	//Draw the projectile
	p.draw = function(ctx)
	{
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.fillStyle = this.color;
		ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
		ctx.restore();
	};
	
	//Check if bullet leaves screen
	function checkOutOfBounds(pos, width, height)
	{
		if( pos.x <= -width || pos.x >= app.CANVAS_WIDTH + width)
			return false;
		else
			return true;
	};
	
	return Bullet;
}();