app.controller('headController', function($scope, $location){
});
app.controller('accueilController', function($scope, injectService){
	injectService.injectData($scope);
	$scope.message = "NON ACTIF";
	$scope.messageForm = "NON ACTIF";
	$scope.mode_dessin = false;
	$scope.fome_chosie = "";
	$scope.lastSens = 0;
	$scope.montrer = false;
	$scope.showForms = false;

	$scope.zoom = function(sens) {
		var bef = new Vector(zoom.x, zoom.y);

		zoom.x += sens * zoomFactor;
		zoom.y += sens * zoomFactor;
		if(zoom.x < 1 || zoom.y < 1) {
			zoom = bef;
		}
		// on change rien on fait que zoomer
		zoom_scale(ctx, zoom);
		manager.draw_all(carteImage, function(){
			console.log("Ploting Layers from database... success or not :p !?");
		});
	}
	$scope.charger = function() {
		injectService.injectData($scope);
		var terrain = $scope.liste_terrain;
		initSurfaces(terrain);
		$scope.montrer = true;
	}
	$scope.reinitMap = function() {
		// faut donc desactive toute les selections
		// et supprime les selections sauvegardees
		reinitSelectionAndRedraw();
	}
	$scope.afficherForm = function() {
		$scope.showForms = !$scope.showForms;
		$scope.messageForm = $scope.showForms ? "ACTIF" : "NON ACTIF";
	}
	
	$scope.enableDrawingMode = function() {
		drawing_mode_bool = ! drawing_mode_bool;
		if(drawing_mode_bool) {
			drawing_type = confirm("Polygone (oui) ou ligne (non) ?") ? "polygon" : "line";
			$scope.fome_chosie = " de '"+drawing_type+"'";
			alert("NOTE : Le mode dessin desactive la selection.");			
		} else {
			points_drawing = [];
		}
		$scope.mode_dessin = drawing_mode_bool;
		$scope.message = drawing_mode_bool ? "ACTIF" : "NON ACTIF";
	}
	
});

app.controller('formController', function($scope, $http, injectService){
	$scope.text= "";

	$scope.selectByAttribValeur = function() {
		reinitSelectionAndRedraw();
		
		var att = $scope.attribut;
		var val = $scope.valeur;
		var part = val.split(":");
			console.log(part);
		if( part.length > 1 && part[0].toLowerCase() == 'not') {
			query = s => s.getData(att) != part[1];
		} else {
			query = s => s.getData(att) == part[0];
		}
		select(query);
	}
	$scope.selectVoisinage = function() {
		reinitSelectionAndRedraw();
		var att = $scope.attribut;
		var val = $scope.valeur;
		var part = val.split(":");
			console.log(part);
		if( part.length > 1 && part[0].toLowerCase() == 'not') {
			query = s => s.getData(att) != part[1];
		} else {
			query = s => s.getData(att) == part[0];
		}
		// on determine le centre d etude
		var tmp = manager.mergeSelection("name", ["myLayer"], query);
		
		if(tmp.length > 0) {
			var rayon = prompt("Entrer le rayon en m2", 100);
			var shape_focus = tmp[0];
			query = s => shape_focus.isNeighbourOf(s, rayon) && shape_focus != s;
			select(query);
		} else {
			alert("Cette region n'existe pas!");
		}
	}

	$scope.selectSurface = function() {
		reinitSelectionAndRedraw();
		
		var comp = $scope.comparateur;
		var valeur = $scope.valeur_surf;
		var query = null; 
		if(comp == "inf") {
			query = s => s.getSurface() < valeur;
		} else {
			query = s => s.getSurface() >= valeur;			
		}
		select(query);			
	}
	$scope.selectPrix = function() {
		reinitSelectionAndRedraw();
		
		var comp = $scope.comparateur_prix;
		var valeur = $scope.valeur_prix;
		var query = null; 
		if(comp == "inf_prix") {
			query = s => s.getData("prix") < valeur;
		} else {
			query = s => s.getData("prix") >= valeur;			
		}
		select(query);			
	}	
	$scope.insertVerticles = function() {
		// insertion d une forme
		var nom = $scope.nom_insert;
		var proprio = $scope.proprio_insert;
		var prix = $scope.prix_insert;
		if(proprio == '' || proprio == 'undefined') {
			proprio = 'aucun';
		}
		if(nom == '') {
			alert("Veuillez mettre un nom!");
			return;
		}
		if(prix == '' || prix == 'undefined') {
			prix = 0;
		}
		// shape_array se trouve dans engine.js
		var verticles = stringifyShapes(points_drawing);
		//console.log(verticles);
		var dataToSend = {
			idterrain : null,
			nom : nom,
			proprio : proprio,
			prix : prix,
			type : drawing_type,
			forme : verticles
		};
		$http({
            method: 'GET',
            url: configLink('add_object', dataToSend)
        }).then(function successCallback(response) {
            alert("Succes envoi.")
        }, function errorCallback(response) {
            alert("Une erreur est survenue au serveur de l insertion.");            
        });
	}
});
