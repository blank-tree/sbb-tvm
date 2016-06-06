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

	app.controller('logicCtrl', function ($scope) {

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

		$scope.onKeyboardEnter = function (target) {

			$scope.keyboardOutput = target;
			
			var $targetInput = target === 'to' ? $('div.to.input-field span.input-to') : $('div.from.input-field span.input-from');
			var $keys = $('keyboard div a.sbb-button-grey-small:not(.keyboard-space)');
			
			// console.log('hello', arguments);

			$keys.unbind('click.keyPress').bind('click.keyPress', function () {
				$targetInput.append($(this).text());
			});

			$('keyboard div a.keyboard-space').unbind('click.keyPress').bind('click.keyPress', function () {
				$targetInput.append(' ');
			});

			// $('keyboard div a.keyboard-space').click(function() {
			// 	angular.$apply(function () {
			// 		$targetInput.append(' ');
			// 	});
			// });

			$('keyboard div a.keyboard-delete').unbind('click.keyPress').bind('click.keyPress', function () {
				$targetInput.text($targetInput.text().slice(0, -1));
			});

			$scope.fill = function() {
				console.log($scope.mainTo);
				console.log($scope.keyboardOutput);
				if ($scope.keyboardOutput === 'to') {
					$scope.mainTo = $('div.to.input-field span.input-to').text();
				} else {
					$scope.mainFrom = $('div.from.input-field span.input-from').text();
				}
			}
		};



	});

	var keyboard = angular.module('keyboard', ['ngAnimate', 'viewController']);

	keyboard.directive('keyboard', function () {

		return {
			restrict: 'E',
			templateUrl: 'templates/parts/keyboard.html',
			scope: {
				onEnter: '=',
				outputTarget: '=',
				onSubmit: '='
			},
			controller: function ($scope) {

				$scope.enterPressed = function () {
					$scope.onSubmit($scope.keyboardInput);	
				};

				// $scope.onEnter = function () {
				// 	$scope.doEnter($scope.)
				// };

				// $scope.text = "";
				//
				// $scope.doEnter = function () {
				// 	$scope.onEnter($scope.text);
				// };
				//
				// console.log($scope);
				//
				// var keyboardOutput = $scope['current'];
				// var $keys = $('keyboard div a.sbb-button-grey-small:not(.keyboard-space)');
				// var $targetInput = keyboardOutput == 'search-to' ? $('div.to.input-field span.input-to') : $('div.from.input-field span.input-from');
				//
				// $keys.click(function () {
				// 	$targetInput.append($(this).text());
				// });
				//
				// $('keyboard div a.keyboard-space').click(function () {
				// 	$targetInput.append(' ');
				// });
				//
				// // $('keyboard div a.keyboard-space').click(function() {
				// // 	angular.$apply(function () {
				// // 		$targetInput.append(' ');
				// // 	});
				// // });
				//
				// $('keyboard div a.keyboard-delete').click(function () {
				// 	$targetInput.text($targetInput.text().slice(0, -1));
				// });
				//
				// this.fillInput = function () {
				//
				// 	if ($scope['current'] == 'search-to') {
				// 		logic.mainTo = $targetInput.text();
				// 		// console.log(logic.MainTo);
				// 	} else {
				// 		logic.mainFrom = $targetInput.text();
				// 		// console.log(logic.MainFrom);
				// 	}
				//
				// };

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
