/*Utilities.js
 *Dylan Nelkin
 *Last Modified: 4/18/15
 *Functions and math for making the game
*/

'use strict'

var app = app || {};

app.Utilities = {

	//Creates a mouse object out of the event object passed in
	getMouse: function(e){
		var mouse = {};
		mouse.x = e.pageX - e.target.offsetLeft;
		mouse.y = e.pageY - e.target.offsetTop;
		return mouse;
	},

	//Returns a random number between a minimum and a maximum
	getRandom: function(min, max) {
		return Math.random() * (max - min) + min;
	},

	// returns a random color of alpha 1.0
	// http://paulirish.com/2009/random-hex-color-code-snippets/
	getRandomColor: function(){
		var red = Math.round(Math.random()*200+55);
		var green = Math.round(Math.random()*200+55);
		var blue=Math.round(Math.random()*200+55);
		var color='rgb('+red+','+green+','+blue+')';
		// OR	if you want to change alpha
		// var color='rgba('+red+','+green+','+blue+',0.50)'; // 0.50
		return color;
	},
	
	//Creates a 2D array
	createGrid: function(col, row){
		var arr = [];

		for(var i = 0; i < col; i++){
			var temp = [];
			for(var j = 0; j < row; j++){
				temp.push(0);
			}
			arr.push(temp);
		}

		return arr;
	},
	
	//Is a number odd
	isOdd: function(num){
		return (num % 2) == 1;
	},
	
	//Clamp a value between a minimum and a maximum
	clamp: function(val, min, max){
		return Math.max(min, Math.min(max, val));
	}
}
