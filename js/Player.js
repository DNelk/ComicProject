/*Player.js
Tim Cotanch
Player module
*/

"use strict";

var app = app || {};

app.Player = {
	//global properties of the player character
	color: "black",
	x: 320,
	y: 420,
	width: 50,
	height: 50,
	age: 0,
	health: 100,
	age: 0,
	image: undefined,
	drawLib: undefined,
	
	//draw the player sprite
	draw: function(ctx) 
	{
		var halfW = this.width/2;
		var halfH = this.height/2;
		var sourceX; //X from spritesheet
		var sourceY; //Y from spritesheet
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
		}
	},
	
	//movement for the player
	moveLeft: function(dt)
	{
		this.x -= this.age * dt;
	},
	
	moveRight: function(dt)
	{
		this.x += this.age * dt;
	},
	
	moveUp: function(dt)
	{
		this.y -= this.age * dt;
	},
	
	moveDown: function(dt)
	{
		this.y += this.age * dt;
	},
};