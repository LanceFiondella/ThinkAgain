var gameMenu = angular.module('gameMenu',['ngRoute','gameMenuControllers'])

gameMenu.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.
		when('/mainMenu',{
			templateUrl: 'angular/partials/main_menu.html',
			controller: 'mainMenuController'
		}).
		when('/selectLevel',{
			templateUrl: 'angular/partials/select_level.html',
			controller: 'selectLevelController'
		}).
		otherwise({
			redirectTo: '/mainMenu'
		});

	}
	]);