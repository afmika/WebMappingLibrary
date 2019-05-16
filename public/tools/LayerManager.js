function LayerManager(ctx, width, height) {
	this.context = ctx;
	this.width = width;
	this.height = height;
	this.layers = []; // suit l ordre;
	this.debugMode = false;
	this.debugColor = "red";
	this.setLineWidth(1);
	this.selectedShape = [];
}
LayerManager.prototype = {
	setLineWidth : function(lineWidth) {
		this.lineWidth = lineWidth;
		this.context.lineWidth = this.lineWidth;
	},
	reinitAllColor : function() {
		this.layers.forEach(layer => {
			layer.shapes.forEach(shape => {
				shape.fillColor = shape.default_fillColor;
				shape.strokeColor = shape.default_strokeColor;
			});
		})
	},
	reinitSelection : function () {
		this.selectedShape = [];
		this.reinitAllColor();
	},
	addSelection : function (shape) {
		// rajoute ou supprime shape dans la table
		// de selection
		var after = this.selectedShape.filter(s => s != shape);
		if(this.selectedShape.length != after.length) {
			this.selectedShape = after;
			shape.setFill(shape.default_fillColor);
			return false;
		} else {
			this.selectedShape.push(shape);
			return true;
		}
	},
	debug: function(bool) {
		console.log(bool ? "Debogage de la carte activee" : "Debogage de la carte desactivee");
		this.debugMode = bool || false;
		return this.debugMode;
	},
	addLayer: function(layer) {
		layer.context = this.context;
		layer.manager = this;
		this.layers.push(layer);
	},
	getLayerBy : function(attrib, value) {
		for(var i = 0; i < this.layers.length; i++) {
			if(this.layers[i][attrib] == value) {
				return this.layers[i];
			}
		}
		return null;
	},
	removeLayer : function(layer) {
		this.layers = this.layers.filter(e => e != layer);
	},
	draw_all : function(source_back, func) {
		ctx.clearRect(0, 0, this.width, this.height );
		var i = 0;
		var that = this;
		chargerImage(this.context, source_back, function(e) {
			that.layers.forEach(layer => {
				draw_Layer(layer, that.debugMode, that.debugColor); // dessine le layer	
				draw_labels(layer); // dessine tous les labels du layer
			});
			func();
		});	
	},
	mergeSelection : function(attrib, valuesArray, selector, save_selected){
		var selections = [];
		var layers = [];
		valuesArray.forEach(value => {
			// on determine les layers concernees
			var tmp = this.getLayerBy(attrib, value);
			// on les ajoute a la tab
			if(tmp != null) {
				layers.push(tmp);
			}
		});
		layers.forEach(
			layer => {
				// layer definie la couleur de ses shapes repondant
				// a la requete
				layer.selectByCond(selector).forEach( result => {
					if(save_selected) {
						// add selection enleve les "deja selectionnees"
						// et ajoute les "nouveaux selectionnees"
						if(this.addSelection(result)) {
							// aucune operation donc result n est pas encore
							// dans la selection -> il faut l ajouter
							selections.push(result);
						}
					} else {
						this.reinitSelection(); // reinit
						selections.push(result)
					}
				});
			}
		);
		//console.log(selections);
		return selections;
	},
	deleteAllData : function() {
		this.layers = [];
		this.debugMode = false;
		this.debugColor = "red";
		this.setLineWidth(1);
		this.selectedShape = [];	
	}
}