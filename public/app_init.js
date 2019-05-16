// initialisation de toutes les variables
var liste_recherche = [];
var search_keyword = "";
var pseudo = "";

var app = angular.module('mikaApp', ['ngRoute']);
// gestions des routes
app.config(function($routeProvider, $locationProvider) {
    /*$routeProvider
        .when('/', {
            templateUrl: '/pages/accueil.html',
        }).otherwise({
            redirectTo : '/'
        });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });*/
});

app.controller('principalController', function($scope, $route, $routeParams, $location){
    $scope.variable = "VARIABLE DANS LE CONTROLLEUR PRINCIPAL";
    // controlleur global de l accueil
    $scope.url_head = 'pages/head.html';
    if(getCookie() == null) {
        $location.url('connexion');
    }
});