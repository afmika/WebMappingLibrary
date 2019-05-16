/*
 * @author afmika
 * Une Shape represente un polygone (un ensemble de point)
 */
function Shape(points) {
	this.points = [];
	this.strokeColor = "black";
	this.fillColor = "rgb(0, 0, 0, 0)"; // par def. y a rien
	this.default_fillColor = "rgb(0, 0, 0, 0)"; // par def. y a rien
	this.default_strokeColor = "black"; // par def. y a rien
	this.setPoints(points);
	this.layerContainerName = null;
	this.id = generateID();
	this.type = "polygon";
	this.data = {}; // utile pour stocker n importe quoi
	console.log(this.getSurface());
}
Shape.prototype = {
	getType : function() {
		return this.type;
	},
	setType : function(type) {
		this.type = type;
	},
	isPolygon : function() {
		return this.type == "polygon";
	},
	isLine : function() {
		return this.type == "line";
	},
	setData : function(key, value) {
		this.data[key] = value;
	},
	getData : function(key) {
		return this.data[key];
	},
	setLayerContainerName: function(name) {
		this.layerContainerName = name;
	},
	getLayerContainerName: function() {
		return this.layerContainerName;
	},
	setName : function(name) {
		this.name = name;
	},
	getName : function() {
		return this.name;
	},
	setId :  function(id) {
		this.id = id || Math.floor(Math.random() * 10e6);
	},
	getId : function() {
		return this.id;
	},
	setPoints : function(points) {
		if(typeof(points) != "object")
			throw "LIST MUST BE AN ARRAY Object. ARE YOU DUMB?";
		this.points = points;
	},
	addPoint : function(point) {
		this.points.push(point);
	},
	setFill : function(color) {
		this.fillColor = color;
	},
	setStroke : function(color) {
		this.strokeColor = color;
	},
	/*isConvex : function() {
		// faut trouver une idee de genie ici!!!
		return seCoupe(this.points);
	},*/
	contains : function(vector, ctx) {
		  // un point I tres eloignes de l univers
		  var yMax = -10000;
		  var v = this.points;
		  this.points.forEach(e => {
			  yMax = Math.max(e.y, yMax);
		  });
		  // un vecteur source Arbitraire exterieur au polygone
		  var sR = new Vector(
			vector.x, // 0,
			yMax + 10 // 0
    	  );
		  // sR.draw(ctx, 'blue');
		  var nb_points = this.points.length;
		  var inter_count = 0;
		  for(var i = 0; i < nb_points ; i++) {
			 // on verifie si pour chaque cote il existe un pt d intersect
			 // entre la source sR et le point de coord vector
			var A = v[i];
			var B = v[(i+1) % nb_points];			
			var iseg = intersectSegment(A, B, sR, vector); // retourne 1 si oui
			if(iseg == 1) {
				inter_count++;
			}
		  }
		  //console.log("Intersection "+this.id, inter_count);
		  return inter_count % 2 == 1; // le nombre d intersection impair => inside
	},
	getSquareMin : function() {
		// obtient le carre min
		var minX = 100000, maxX = -minX,
			minY = 100000, maxY = -minY;
		this.points.forEach(p => {
			minX = Math.min(minX, p.x);
			minY = Math.min(minY, p.y);
			maxX = Math.max(maxX, p.x);
			maxY = Math.max(maxY, p.y);
		});
		return {
			vectorMin : new Vector(minX, minY),
			vectorMax : new Vector(maxX, maxY)
		};
	},
	getCenter: function() {
		var xC = 0, yC = 0;
		this.points.forEach(p => {
			xC += p.x;
			yC += p.y;
		});
		var n = this.points.length;
		return new Vector(xC / n, yC / n);
	},
	getCenterOfSquareMin : function() {
		var v = this.getSquareMin();
		var vMin = v.vectorMin,
			vMax = v.vectorMax;
		var xG = 0.5 * (vMin.x + vMax.x);
		var yG = 0.5 * (vMin.y + vMax.y);
		return new Vector(xG, yG);
	},
	getCirconference : function() {
		// prend le perimetre
		var dx = 0;
		for(var i = 0; i < this.points.length; i++) {
			if(i + 1 < this.points.length) {
				dx += distance(this.points[i], this.points[i+1]);				
			}
		}
		if(this.isPolygon()) {
			dx += distance(this.points[this.points.length - 1], this.points[0]);
		}
		return dx;
	},
	getCenterDirection : function() {
		// prend le centre en suivant le parcourt
		var centerApprox = null;
		var circ = this.getCirconference();
		var dx = 0;
		for(var i = 0; i < this.points.length; i++) {
			if(i + 1 < this.points.length) {
				dx += distance(this.points[i], this.points[i+1]);				
				if(dx >= (circ / 2 )) {
					break;
				}
				centerApprox = this.points[i+1];
			}
		}	
		return centerApprox;
	},
	getSurface : function() {
		// A FAIRE
		// on peut entourer le polygone avec un carre minimal
		// boucler les pixels et incrementer un nombre si ce pixel est interieur au polygone
		// on a alors SurfPoly / SurfCarre = nbpointinterieur / pointsTotaux
		// donc SurfPoly = nbpointinterieur * SurfCarre / pointsTotaux
		// comme SurfCarre = nbPixel A parcourir = pointsTotaux
		// ainsi SurfPoly = nbpointinterieur car un point = un pixel de dim 1 x 1
		var ds = 0;
		var v = this.points;
		var j = this.points.length - 1; 
		for (var i = 0; i < this.points.length; i++) { 
			ds += (v[j].x + v[i].x) * (v[j].y - v[i].y); 
			j = i;  // j is previous vertex to i 
		}
		return Math.abs(ds) * 0.5;
	},
	getDistance : function(shape) {
		// distance entre le centre
		var centerThis = this.getCenterOfSquareMin();
		var centerShape = shape.getCenterOfSquareMin();
		return distance(centerThis, centerShape);
	},
	isNeighbourOf : function(shape, radius) {
		return this.getDistance(shape) <= radius;
	},
	toString : function() {
		return JSON.stringify(this.points);
	}
}