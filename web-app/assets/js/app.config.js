var config = function($stateProvider, $qProvider,  $urlRouterProvider, $locationProvider) {
	$stateProvider.state('main', {
		url:'/',
		templateUrl: '/views/dashboard.html',
		controller: 'dashboardCtrl',
	}).state('sentiment', {
		url:'/sentiment',
		templateUrl: '/views/sentiment.html',
		controller: 'sentimentCtrl',
	}).state('preprocessing', {
		url:'/preprocessing',
		templateUrl: '/views/preprocessing.html',
		controller: 'preprocessingCtrl',
	}).state('check', {
		url:'/check',
		templateUrl: '/views/check.html',
		controller: 'checkCtrl',
	});

	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
  $qProvider.errorOnUnhandledRejections(false);

}
