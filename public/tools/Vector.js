/*
 * @author afmika
 * Un Vector represente un point, une direction dans le plan
 */
function Vector(x, y) {
	this.setX(x);
	this.setY(y);
}
Vector.prototype = {
	setX : function(x) {
		if(typeof(x) != 'number')
			throw "X MUST BE A NUMBER. ARE YOU DUMB?";
		this.x = x;
	},
	setY : function(y) {
		if(typeof(y) != 'number')
			throw "Y MUST BE A NUMBER. ARE YOU DUMB?";
		this.y = y;
	},
	getDist : function(vector) {
		var $x = vector.x, $y = vector.y;
		var x = this.x, y = this.y;
		return Math.sqrt((x-$x)*(x-$x) + (y-$y)*(y-$y));
	},
	add : function(vector) {
		this.x += vector.x;
		this.y += vector.y;
	},
	scalar : function(vector) {
		var $x = vector.x, $y = vector.y;
		var x = this.x, y = this.y;
		return x * $y - y * $x;
	},
	draw : function(ctx, color) {
		ctx.fillStyle = color || "black";
		ctx.fillRect(this.x, this.y, 4, 4);
	},
	toString: function() {
		return this.x+","+y;
	}
}