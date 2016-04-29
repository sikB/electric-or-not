var angularAttempt = angular.module('angularAttempt', []);
angularAttempt.controller('angularController', function($scope, $http){
	var apiUrl = 'http://localhost:3000/carlist';
	$http.get(apiUrl).then(function successCallback(response){
		$scope.carsLoaded = response.data;
	})
	function errorCallback(response){
		$scope.result = "Error";
	}
})