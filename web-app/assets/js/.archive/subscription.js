var subscriptionCtrl = function($scope, $rootScope, $http, $sanitize, $location, Notification) {
  $scope.onEdit = false;
  //$scope.input = {};
  $scope.subscriptions = [];
  $scope.total = 0;
  $scope.onLoad = false;

  $scope.nextPage = function() {
		$scope.scrollBusy = true;
		$http.get($scope.env.api+'subscription', {
			params: { after: $scope.after, limit: $scope.limit }
		}).then(function (response) {
			for (var i = 0; i < response.data.data.subscriptions.length; i++) {
				$scope.subscriptions.push(response.data.data.subscriptions[i]);
			}
			if (response.data.data.subscriptions.length > 0) {
				$scope.after = response.data.data.subscriptions[response.data.data.subscriptions.length - 1].id;
			} else {
				$scope.scrollLast = true;
			}
			$scope.scrollBusy = false;
    })
	}
};
