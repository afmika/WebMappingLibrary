var express = require('express');
var connect = require('./Connect');
var Tools = require('./Tools');
var app = express(); // initialisation de l application
var errorResultatMessage = "Serveur : Erreur, le serveur repond mais la base non"; // juste une convention que j ai faite
// important surtout quand on travaille en local et pour les verbes
// cross origin :: avoir des trucs en ajax par exemple sur des dom diffs
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	// console.log(next);
    next();
});


// le chemin api fait reference a public
app.use('/', express.static('public'));

app.get('/map', function(req, res){
	var con = connect();
	res.setHeader('Content-Type', 'text/json');
	var sql = "SELECT * FROM Terrain ";

	con.query(sql, function (error, results, fields) {
		if(error) {
			console.log(error);
			res.end(errorResultatMessage);
			return;
		}
		res.end(JSON.stringify(results));
		con.end();
	});	
});


app.get('/add_object', (req, res) => {
	var con = connect();
	res.setHeader('Content-Type', 'text/plain');
	var newObject = req.query;
	// idterrain n est pas un varchar
	var insertSQL = Tools.insertQuery('Terrain', newObject, ['idterrain']);
	console.log(insertSQL);
	con.query(insertSQL, function (error) {
		if(error) {
			console.log(error);
			res.end("Serveur : Erreur insertion dans la base.");
			return;
		}
		res.end("Succes enregistrement");
		con.end();
	});
});


app.use(function(req, res, next){
	res.setHeader('Content-Type', 'text/plain');
	res.status(404).send('Oups. erreur 404. Page introuvable !');
});

var port = 4200;

var server = app.listen(port, function(){
	console.log("Demarrage sur localhost: "+port);
}); // le port qu'on bind
