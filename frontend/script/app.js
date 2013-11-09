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

	$scope.tmp = $http.get("data/memos").success(
		function (data) {
			var i = 0;
			$scope.words = data.map(function(d) {
				return {
					text: d.name,
					extra: { category: d.category, id: i++ }
				};
			});
		}
	);

	/*$scope.tmp = $http.get("data/cat-in-the-hat.txt").success(
		function (data) {
			$scope.words = data.split(" ");
		}
	);*/

	$scope.wordClick = function(element) {
		$scope.$apply(function() {
			$scope.word = element;
		});
	};

	$scope.add = function() {
		$scope.words.push($scope.name);
	};

	$scope.$watch('name', function(name) {
		if (name && name.length > 3)
		{
			console.log(name);
		}
		else
		{
			console.log('Type longer name!');
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
