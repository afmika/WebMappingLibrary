/*
 * @author afmika
 */

function stringifyShapes(shape_array) {
	var verticlesStr = "";
	var tmp = [];
	shape_array.forEach( p => {
		tmp.push({x : p.x, y : p.y});
	});
	return JSON.stringify(tmp);
}
function distance(a, b) {
	var sq2 = (a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y);
	return Math.sqrt(sq2);
}
function draw_labels(layer, color) {
	layer.context.fillStyle = color || "white";
	layer.shapes.forEach(shape =>{
		var c = shape.getCenter();
		var pivotDy = 10; //px
		// on parcourt les labels
			//console.log(layer.context)
		layer.context.beginPath();
		layer.labels_to_show.forEach(label => {
			layer.context.fillStyle = "white";
			layer.context.fillRect( c.x, c.y - 10, 100, 12);
			layer.context.fillStyle = "black";
			var val = shape.getData(label);
			if(val == undefined) {
				val = "(aucune)";
			}
			layer.context.fillText( label+" : " + val, c.x, c.y);
			c.y += pivotDy;
		});
		layer.context.closePath();
	});
}
function drawShape(shape, ctx) {
	var index = 0;
	var p = shape.points[index];
	// dessine le centre du carre minimal
	drawCenterSquare(shape, ctx);
	
	// dessine les lignes
	ctx.beginPath();
	ctx.fillStyle = shape.fillColor;
	ctx.strokeStyle = shape.strokeColor;

	ctx.moveTo(p.x, p.y);
	for(index = 1; index < shape.points.length; index++) {
		p = shape.points[index];
		ctx.lineTo(p.x, p.y);
	}
	
	// ctx.lineWidth = 1; // deja definie dans LayerManager
	if(shape.isPolygon()) {
		// tour complet
		p = shape.points[0];
		ctx.lineTo(p.x, p.y);		
	} else {
		// on ne remplit pas
		ctx.fillStyle = shape.default_fillColor;
		console.log(shape.isLine())
	}
	ctx.fill();
	ctx.stroke();
	
	ctx.closePath();
}
function generateID() {
	// on genere un id de facon a avoir une proba de collision
	// minime
	var id = "";
	var length = 10;
	// proba de collision 1 / 26^length
	for(var i = 0; i < length; i++) {
		var tmp = Math.floor(Math.random() * 10e6);
		id += String.fromCharCode(65 + (tmp % 26));
	}
	return "ID_" + id;
}
function drawCenterSquare(shape, ctx) {
	var v = shape.getCenterOfSquareMin(); // le centre du carre min
	if(shape.isLine()) {
		v = shape.getCenterDirection(); // le vecteur milieu approx
	}
	var dim = 10;
	ctx.beginPath();
	
	ctx.fillStyle = "violet";
	ctx.fillStyle = "red";
	ctx.fillRect(v.x, v.y, dim, dim);
	ctx.strokeRect(v.x - 2, v.y - 2, dim + 2, dim + 2);
	
	ctx.closePath();
}
function drawSquareMin(shape, ctx) {
	var v = shape.getSquareMin();
	var vectorMin = v.vectorMin,
		vectorMax = v.vectorMax;
	var diffX =  vectorMax.x - vectorMin.x;
	var diffY =  vectorMax.y - vectorMin.y;
	ctx.strokeRect(vectorMin.x, vectorMin.y, diffX, diffY);
}
 // Fait la zoom
function zoom_scale(ctx, zoomVec) {
	// ctx.restore();
	ctx.scale(zoomVec.x, zoomVec.y);
}
function draw_Layer(layer, debug, debugColor) {
	// dessine tous les shapes du layer
	layer.shapes.forEach(
		shape => {
			if(debug) {
				console.log("Debugging... shape_id : ", shape.id);
				drawSquareMin(shape, layer.context, debugColor || "black");
			}
			drawShape(shape, layer.context);
		}
	);
}
function getCoeffEquation(A, B) {
	var a = (A.y-B.y) / (A.x - B.x);
	var b = A.y - a * A.x;
	return {a : a, b : b};
}
function intersectSegment(A,B,I,P) {
	var D = {x : B.x - A.x, y : B.y - A.y},
		E = {x : P.x - I.x, y : P.y - I.y};
	var denom = D.x*E.y - D.y*E.x;
	if (denom == 0) {
		//le point d intersect ne peut exister (parallele ou trop loin)
		return -1; 
	}
	t = -(A.x*E.y-I.x*E.y-E.x*A.y+E.x*I.y) / denom;
	u = -(-D.x*A.y+D.x*I.y+D.y*A.x-D.y*I.x) / denom;
	// intersection au niveau des segments 
	// 0 <= t < 1 et 0 <= u < 1
	if (t < 0 || t >= 1) {
		return 0;
	}
	if (u < 0 || u >= 1) {
		return 0;
	}
	return 1; // tout est ok
} 
function seCoupe(point) {
	var indexFin = point.length-1;
	var I = point[indexFin-1]; //avant dernier
	var P = point[indexFin]; //dernier
	for(var i=0; i < indexFin-2; i++) {
		var val = intersectSegment(point[i], point[i+1], I, P);
		if(val == 1) {
			return true;
		}
	}
	return false;
}
function relier(ctx, a, b) {
	ctx.beginPath();
	ctx.strokeStyle = couleurPrincipale;
	ctx.lineWidth = 1;
	ctx.moveTo(a.x, a.y);
	ctx.lineTo(b.x, b.y);
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
}
function chargerImage(ctx, source, func) {
	if(source == null) {
		func();
		return;
	}
	var image = new Image();
	image.src = source;
	
	image.onload = function(e) {
		ctx.drawImage(image, 0, 0);
		func(e);
		//alert("Chargement fini");
	}
}