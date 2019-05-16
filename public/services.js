app.service('injectService', function($http){
    // on fait une requete async or angular sait comment faire
    // donc on donne tout a n importe lequel scope qui possede liste_joueur en tant qu argument
    // liste complete
    this.injectData = function($scope) {
        $http({
            method: 'GET',
            url: '/map'
        }).then(function successCallback(response) {
            $scope.liste_terrain = response.data;
            }, function errorCallback(response) {
            $scope.errorMessage = "Le serveur ne repond pas :'(";
        });
    }
});