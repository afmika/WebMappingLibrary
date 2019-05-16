/*
 * @author afmika
 * Un Layer est une couche contenant plusieurs polygones
 */
 
 function Layer(shapes, ctx) {
	this.shapes = shapes || [];
	this.default_line_width = 1;
	this.context = ctx || null;
	this.name = "";
	this.labels_to_show = [];
 }
 
 Layer.prototype = {
	showLabels : function(labels_array) {
		this.labels_to_show = labels_array || [];
	},
	getLabelsToShow : function() {
		return this.labels_to_show;
	},
	setName : function(name) {
		this.name = name;
	},
	configShapes: function() {
		this.shapes.forEach(e => {
			e.setLayerContainerName(this.name);
		});
	},
	addShape : function(shape) {
		if(typeof(shape) != 'object')
			throw "SHAPE MUST BE AN OBJECT. ARE YOU DUMB?";
		shape.setLayerContainerName(this.getName());
		this.shape.push(shape);
	},
	selectByCond : function(condition) {
		// condition est une fonction ici
		/*
		Exemple: ce bout de code permet d obtenir les shapes aux ids pairs
			couche.selectByCond(s => s.id % 2 == 0, "red");
		*/
		var res = [];
		this.shapes.forEach(
			shape => {
				if(condition(shape)) {
    				 res.push(shape);
				}
			}
		)
				
		return res;
	}
 }