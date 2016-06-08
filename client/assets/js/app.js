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

			// var buffer = false;

			$scope.back = to.url === lastScreen;

			// if (to.url === lastScreen) {
			// 	if(!buffer) {
			// 		$scope.back = to.url === lastScreen;
			// 		buffer = true;
			// 	} else {
			// 		buffer = false;
			// 	}
			// } else {
			// 	$scope.back = to.url === lastScreen;
			// 	buffer = false;
			// }

			// $scope.back = false;

			lastScreen = from.url;
		});


	});

	// All Variables and logic inside the app
	var app = angular.module('logic', ['ngAnimate', 'ngLocale']);

	app.controller('logicCtrl', function ($scope, $state, $http, $interval, $filter) {

		$scope.uiRouterState = $state;

		this.location = 'Zürich HB';
		this.frequent = ['Bern', 'Basel SBB', 'St. Gallen', 'Genf'];

		this.time = new Date().getTime();

		this.language = 0; // 0 = german; 1 = english; 2 = french; 3 = italian

		this.mainFrom = 'Zürich HB';
		this.mainTo = '';
		this.mainTime = '';
		this.mainVia = '';
		this.mainType = '';
		this.mainClass = '';
		this.mainAmount = {
			'full': 0,
			'half': 0,
			'dog': 0,
			'bike': 0
		};

		this.popup = false;
		this.popupState = '';


		this.connections = '';

		this.suggestions = '';

		// Bind the parent element for use in the following functions. Damn scope...
		var logic = this;

		$scope.setNewTime = function (newTimeToSet) {
			logic.mainTime = newTimeToSet;
			logic.popup = false;
			logic.getConnections();
		};

		this.popupToggle = function (newPopupState) {
			// logic.popup = true;
			logic.popupState = newPopupState;
			logic.popup = !logic.popup;
		};

		this.popupHide = function () {
			logic.popup = false;
		};

		$scope.popupHide = function () {
			logic.popup = false;
		};

		this.mainStateHandler = function (next) {

			var statusRoute = logic.mainFrom != '' && logic.mainTo != '' && logic.mainFrom != logic.location;

			if (statusRoute) {
				if (next === 'home') {
					logic.connections = '';
					logic.getConnections();
					next = 'schedule';
				} else {
					var statusMainVia = logic.mainVia != '';
					var statusMainType = logic.mainType != '';
					var statusMainClass = logic.mainClass != '';
					var statusMainAmount = logic.mainAmount.full != 0
						|| logic.mainAmount.half != 0
						|| logic.mainAmount.dog != 0
						|| logic.mainAmount.bike != 0;

					if (statusMainVia
						&& statusMainType
						&& statusMainClass
						&& statusMainAmount) {
						next = 'pay';
					} else if (statusMainVia
						&& statusMainType
						&& statusMainClass) {
						next = 'ticket-amount';
					} else if (statusMainVia
						&& statusMainType) {
						next = 'ticket-class';
					} else if (statusMainVia) {
						next = 'ticket-type';
					} else {
						next = 'schedule';
					}
				}
			}
			$state.go(next);
		};

		$scope.keyboardOutput = '';

		$scope.onKeyboardSubmit = function () {
			logic.mainStateHandler('home');
		};

		$scope.locationShortcut = function (location, direction) {
			if (direction === 'to') {
				logic.mainTo = location;
			} else {
				logic.mainFrom = location;
			}
			logic.mainStateHandler('home');
		};

		this.updateTime = function () {
			logic.time = new Date().getTime();
		};

		$interval(logic.updateTime, 1000);

		this.showSchedule = function () {
			if (logic.mainTo && logic.mainFrom) {
				logic.mainTime = logic.time;
				logic.connections = '';
				logic.getConnections();
				$state.go('schedule');
			}
		};

		$scope.onKeypressRefresh = function (destination) {
			logic.getSuggestions(destination === 'to' ? logic.mainTo : logic.mainFrom);
		};

		this.getSuggestions = function (partial) {
			$http({
				method: 'GET',
				url: 'http://transport.opendata.ch/v1/locations?query=' + partial + '&type=station'
			}).then(function successCallback(response) {
				logic.suggestions = response.data.stations.slice(0, 4);
			}, function errorCallback(response) {
				//results = null;
			});
		};

		this.emptySuggestions = function () {
			logic.suggestions = '';
		};

		this.getConnections = function () {
			$http({
				method: 'GET',
				url: 'http://transport.opendata.ch/v1/connections?from=' + logic.mainFrom + '&to=' + logic.mainTo + '&date=' + $filter('date')(logic.mainTime, 'yyyy-MM-dd') + '&time=' + $filter('date')(logic.mainTime, 'HH:mm')
			}).then(function successCallback(response) {
				for (var i = 0; i < response.data.connections.length; i++) {
					response.data.connections[i].duration = response.data.connections[i].duration.slice(3, 8);
					response.data.connections[i].sections = response.data.connections[i].sections.slice(1);
					response.data.connections[i].viaString = response.data.connections[i].sections.map(function (section) {
						return section.departure.station.name;
					}).join(' - ');
				}
				logic.connections = response.data.connections.slice(0, 3);
			}, function errorCallback(response) {
				//results = null;
			});
		};

		// Ticket options
		this.chooseTicketType = function (ticketType) {
			logic.mainType = ticketType;
			logic.mainStateHandler('ticket-class')
		};

		this.chooseTicketClass = function (ticketClass) {
			logic.mainClass = ticketClass;
			logic.mainStateHandler('ticket-amount');
		};

		this.chooseVia = function (ticketVia) {
			logic.mainVia = ticketVia;
			logic.mainStateHandler('ticket-type');
		};

		this.chooseAmount = function () {
			if (logic.mainAmount.full != 0
				|| logic.mainAmount.half != 0
				|| logic.mainAmount.dog != 0
				|| logic.mainAmount.bike != 0) {
				$state.go('pay');
			}
		};

		this.amountIncrease = function (target) {
			logic.mainAmount[target] = logic.mainAmount[target] < 6 ? logic.mainAmount[target] + 1 : logic.mainAmount[target];
		};

		this.amountDecrease = function (target) {
			logic.mainAmount[target] = Math.max(logic.mainAmount[target] - 1, 0)
		};

		this.emptyMainVar = function () {
			setTimeout(function () {
				logic.mainFrom = 'Zürich HB';
				logic.mainTo = '';
				logic.mainTime = '';
				logic.mainVia = '';
				logic.mainType = '';
				logic.mainClass = false; // false = 2. Klasse; true = 1. Klasse
				logic.mainAmount = {
					'full': 0,
					'half': 0,
					'dog': 0,
					'bike': 0
				};

				logic.connections = '';

				logic.suggestions = '';

			}, 500);
		};

		this.abort = function () {
			logic.emptyMainVar();
			$state.go('home');
		};

		this.back = function () {
			window.history.back();
		};



	});

	var keyboard = angular.module('keyboard', ['ngAnimate', 'viewController']);

	keyboard.directive('keyboard', function () {

		return {
			restrict: 'E',
			templateUrl: 'templates/parts/keyboard.html',
			scope: {
				outputTarget: '=',
				onSubmit: '=',
				onRefresh: '=',
				destination: '@'
			},
			controller: function ($scope, $state) {

				var previousInput = $scope.outputTarget;
				$scope.outputTarget = '';

				// $scope.outputTarget = $scope.outputTarget || '';

				$scope.enterPressed = function () {
					if (typeof $scope.onSubmit === 'function') {
						$scope.onSubmit($scope.outputTarget);
					}
				};

				$scope.backPressed = function () {
					$scope.outputTarget = previousInput;
					window.history.back();
				};

				$scope.type = function (key) {
					if (key.length) {
						$scope.outputTarget += key;
						$scope.onRefresh($scope.destination);
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

	var popup = angular.module('popup', ['ngAnimate', 'viewController', 'logic']);

	popup.directive('popup', function () {

		return {
			restrict: 'E',
			templateUrl: 'templates/parts/popup.html',
			scope: {
				popupState: '=',
				setNewTime: '='
				// onSubmit: '=',
				// onRefresh: '=',
				// destination: '@'
			},
			controller: function ($scope, $state) {

				$scope.chooseDate = function (newDayToSet) {

					var currentDate = new Date();
					
					var newTimeToSet = moment([2016, 5, newDayToSet, currentDate.getHours(), currentDate.getMinutes(), 0, 0]).unix() * 1000;
					// var newTimeToSet = moment([2016, 5, newDayToSet, 19, 0, 0, 0]).unix() * 1000;
					$scope.setNewTime(newTimeToSet);
				};
			},
			controllerAs: 'popup'
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
		'keyboard',
		'ngLocale',
		'popup'
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
