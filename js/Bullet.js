/*Bullet.js
 *Tim Cotanch
 *Last Modified: 5/6/15
 *Bullet Module
*/

"use strict";
var app = app || {};

app.Bullet = function(){
	function Bullet(x, y, speed){
		this.x = x;
		this.y = y;
		this.active = true;
		this.xVelocity = -speed;
		this.yVelocity = 0;
		this.width = 3;
		this.height = 3;
		this.color = "black";
	}
	
	var p = Bullet.prototype;
	
	p.update = function(dt)
	{
		this.x += this.xVelocity * dt;
		this.y += this.yVelocity * dt;
		this.active = this.active && checkOutOfBounds(this.x);
	};
	
	//Draw the projectile
	p.draw = function(ctx)
	{
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};
	
	//Check if bullet leaves screen
	function checkOutOfBounds(x)
	{
		return x >= -10 || x <= 810;
	};
	
	return Bullet;
}();