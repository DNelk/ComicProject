/*Enemy.js
Tim Cotanch
It's the enemies
*/

"use strict";

var app = app || {};

app.Enemy = function(){
	
	
	function Enemy(image, canvasWidth, canvasHeight) 
	{
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.color = 'black';
		this.x;
		this.y;
		this.image = image;
		this.width; // sprite sheet
		this.height; //sprite sheet
	};
	
	function enemyDeath()
	{
		
	};
	
	var p = Enemy.prototype;
	
	p.draw = function(ctx) {
		var halfW = this.width/2;
		var halfH = this.height/2;
		var sourceX = 52;
		var sourceY = 98;
		var sourceWidth = 17;
		var sourceHeight = 20;
		var destWidth = sourceWidth;
		var destHeight = sourceHeight;
		var destX = this.x - this.width / 2;
		var destY = this.y - this.height / 2;
		
		
		if(!this.image){
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x - halfW, this.y - halfH, this.width, this.height);
		}
		
		else{
			ctx.drawImage(this.image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, this.width, this.height);
		}
	};
	
	p.update = function(dt) {
		//move enemy and all that
	};	
	
	return enemy;

}();