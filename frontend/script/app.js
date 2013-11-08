'use strict';


// Declare app level module which depends on filters, and services
angular.module('Taggylicious', [
  'ngRoute',
  'd3'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'view/home.html', controller: 'HomeCtrl'});
  $routeProvider.otherwise({redirectTo: '/'});
}]).controller("HomeCtrl", function($scope, $http) 
{
	$scope.words = [];
	$scope.tmp = $http.get("data/cat-in-the-hat.txt").success(
			function (data) {
				$scope.words = data.split(" "); 
			}
	);
	//$scope.words = [ "Jean", "Simon", "Benjamin", "Nicolas", "Olivier", "Karim" ];

	$scope.add = function() {
		$scope.words.push($scope.name);
	};

	$scope.$watch('name', function(name) {
		if (name.length > 3)
		{
			console.log(name);
		}
		else
		{
			console.log('Benj aime les poneys');
		}

	});

}
).filter("toUpperCase", function() 
{
	return function (input)
	{
		if (input) return input.toUpperCase();
	}
}
).directive("colorMe", function() {
	return function(scope, elem)
	{
		elem.bind('mouseenter', function()
		{ 
			elem.css("background","aqua");
		});
		elem.bind('mouseleave', function()
		{ 
			elem.css("background","none");
		});
	}
})
;
