var gameMenuControllers = angular.module('gameMenuControllers',[]);

gameMenuControllers.controller('mainMenuController', ['$scope']
	function($scope){

	}
	);

gameMenuControllers.controller('selectLevelController', ['$scope', '$http',
	function($scope,$http){
		/*
			$http.get('phones/phones.json').success(function(data) {
		      $scope.phones = data;
		    });

		*/
	}

	]);

