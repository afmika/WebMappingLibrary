var canvas = document.getElementById("canvas");
var ctx =  canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var selectionColor = "rgba(160, 0, 0, 0.5)";
var carteImage = "map/carte.png";
var manager = new LayerManager(ctx, canvas.width, canvas.height);
var drawing_mode_bool = false;
var drawing_type = "line";
var zoom = new Vector(1, 1);
var zoomFactor = 0.1;
var points_drawing = [];
var debug_mode = false;


// charge la Base
function initSurfaces(data) {
	// data est la donnee de la base
	manager.deleteAllData();
	var surfaces = [];
	data.forEach(s => {
		var shape = new Shape(JSON.parse(s.forme));
		shape.setData("nom", s.nom);
		shape.setData("idterrain", s.idterrain);
		shape.setData("proprio", s.proprio);
		shape.setData("perim", Math.round(shape.getCirconference()))
		shape.setData("prix", s.prix)
		if(s.type != 'line') {
			// on recalcule vite fait la surface pour rigoler
			shape.setData("Aire", shape.getSurface());			
		}
		shape.setType(s.type);
		surfaces.push(shape);
	});
	var couche = new Layer(surfaces);
	couche.setName("myLayer");
	couche.configShapes(); // attribue des configs sup aux shapes comme l ajout du nom
	couche.showLabels(["nom", "proprio", "Aire", "perim", "prix"]);
	
	manager.addLayer(couche);
	manager.debug(debug_mode); // rectangles minimaux
	
	estimerPrixAucunProprio(); // on calcule le prix des sans proprio
	manager.draw_all(carteImage, function(){
		console.log("Ploting Layers from database... success or not :p !?");
	});
}

function estimerPrixAucunProprio() {
	var rayon = 10000;
	var query = e => e.getData('proprio') == 'aucun';
	var tmp = manager.mergeSelection("name", ["myLayer"], query, false);
	tmp.forEach(focus => {
		var moyenne = 0;
		var periphQuery = s => focus.isNeighbourOf(s, rayon) && focus != s;
		var voisin = manager.mergeSelection("name", ["myLayer"], periphQuery, false);
		voisin.forEach(v => {
			moyenne += v.getData('prix');
			console.log("prix", v.getData('prix'))
		});
		if(voisin.length != 0) {
			focus.setData("prix", Math.round(moyenne / voisin.length));			
		}
	});
}

// remet les shapes, couleurs, selections et layers a zero
function reinitSelectionAndRedraw() {
	manager.reinitSelection();
	manager.draw_all(carteImage, function(){
		console.log("reploting Layers... success!");
	});
}

function select(query) {
	// detruit l ancienne selection et renvoie la nouvelle
	var tmp = manager.mergeSelection("name", ["myLayer"], query, false);
	tmp.forEach(
		shape => {
			// on definie la couleur de la selection
			if(shape.isLine()){
				shape.setStroke(selectionColor);
			} else {
				shape.setFill(selectionColor);				
			}
		}
	);
	manager.draw_all(carteImage, function(){
		console.log("reploting Layers... success!");
	});	
}

// selection
canvas.addEventListener("click", function(e) {
	var x = e.clientX-canvas.offsetLeft;
	var y = e.clientY-canvas.offsetTop;
	if(drawing_mode_bool == false) {
		var saveSelected = true;
		var query = shape => shape.contains(new Vector(x / zoom.x, y / zoom.y));
		var tmp = manager.mergeSelection("name", ["myLayer"], query, saveSelected);

		tmp.forEach(
			shape => {
				// on definie la couleur de la selection
				if(shape.isLine()){
					shape.setStroke(selectionColor);
				} else {
					shape.setFill(selectionColor);				
				}
			}
		);
		//if(tmp.length != 0) {
			manager.draw_all(carteImage, function(){
				console.log("reploting Layers... success!");
			});
		//}
	}
});

// dessin par clique
canvas.addEventListener("click", function(e) {
	var x = e.clientX-canvas.offsetLeft;
	var y = e.clientY-canvas.offsetTop;
	if(drawing_mode_bool) {
		manager.draw_all(carteImage, function(){
			console.log("reploting Layers... success!");			
			points_drawing.push(new Vector(Math.round(x / zoom.x), Math.round(y / zoom.y)));
			var shape = new Shape(points_drawing);
			shape.setType(drawing_type);
			drawShape(shape, ctx);
		});
	}
});