(function () {
	'use strict';

	// Custom module for back animations
	// Puts the class "back" on the ui-view with the class "grid-content"
	// for animations with css.
	var viewApp = angular.module('viewController', ['ngAnimate']);

	viewApp.controller('viewCtrl', function ($scope) {

		var lastScreen = '/';

		// $scope.$on('$stateChangeSuccess', function (event, toState) {
		//
		// 	$scope.back = toState.name === 'state1';
		// });

		$scope.$on('$stateChangeStart', function (evt, to, _, from) {
			// Testing purpose
			//console.log(from, to);

			$scope.back = to.url === lastScreen;
			lastScreen = from.url;
		});


	});

	var app = angular.module('logic', ['ngAnimate']);

	app.controller('logicCtrl', function ($scope, $state) {

		$scope.location = 'Zürich HB';
		$scope.frequent = ['Bern', 'Basel SBB', 'St. Gallen', 'Genf'];


		$scope.language = 0; // 0 = german; 1 = english; 2 = french; 3 = italian

		$scope.mainFrom = '';
		$scope.mainTo = '';
		$scope.mainTime = '';
		$scope.mainRoute = '';
		$scope.mainType = '';
		$scope.mainClass = false; // false = 2. Klasse; true = 1. Klasse
		$scope.mainAmount = {
			'full': 0,
			'half': 0,
			'dog': 0,
			'bike': 0
		};

		$scope.keyboardOutput = '';

		$scope.onKeyboardSubmit = function () {
			console.log('$scope.mainTo', $scope.mainTo);
			console.log(arguments);
			$state.go('home');
		};


	});

	var keyboard = angular.module('keyboard', ['ngAnimate', 'viewController']);

	keyboard.directive('keyboard', function () {

		return {
			restrict: 'E',
			templateUrl: 'templates/parts/keyboard.html',
			scope: {
				// onEnter: '=',
				outputTarget: '=',
				onSubmit: '='
			},
			controller: function ($scope) {

				$scope.outputTarget = $scope.outputTarget || '';



				$scope.enterPressed = function () {
					if (typeof $scope.onSubmit === 'function') {
						$scope.onSubmit($scope.outputTarget);
					}
				};

				$scope.type = function (key) {
					if (key.length) {
						$scope.outputTarget += key;
					}
				};

				$scope.backspace = function () {
					if ($scope.outputTarget) {
						$scope.outputTarget = $scope.outputTarget.slice(0, -1);
					}
				};

			},
			controllerAs: 'keyboard'
		};


	});


	// Foundation Framework default
	angular.module('application', [
		'ui.router',
		'ngAnimate',

		//foundation
		'foundation',
		'foundation.dynamicRouting',
		'foundation.dynamicRouting.animations',

		//custom js
		'viewController',
		'logic',
		'keyboard'
		])
	.config(config)
	.run(run)
	;

	config.$inject = ['$urlRouterProvider', '$locationProvider'];

	function config($urlProvider, $locationProvider) {
		$urlProvider.otherwise('/');

		$locationProvider.html5Mode({
			enabled: false,
			requireBase: false
		});

		$locationProvider.hashPrefix('!');
	}

	function run() {
		FastClick.attach(document.body);
	}


})();
