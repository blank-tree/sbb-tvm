(function () {
	'use strict';

	// Custom module for back animations
	// Puts the class "back" on the ui-view with the class "grid-content"
	// for animations with css.
	var app = angular.module('custom', ['ngAnimate']);

	app.controller('viewCtrl', function ($scope) {

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

	// Foundation Framework default
	angular.module('application', [
		'ui.router',
		'ngAnimate',

		//foundation
		'foundation',
		'foundation.dynamicRouting',
		'foundation.dynamicRouting.animations',

		//custom js
		'custom'
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
