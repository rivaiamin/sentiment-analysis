var bankStatementCtrl = function($scope, $rootScope, $http, $sanitize, $location, Notification) {
  $scope.onEdit = false;
  //$scope.input = {};
  $scope.bank_statements = [];
  $scope.total = 0;
  $scope.limit = 10;
  $scope.onLoad = false;

  $scope.banks = ['', 'BCA', 'Mandiri', 'BRI', 'BNI'];

  $scope.nextPage = function() {
		$scope.scrollBusy = true;
		$http.get($scope.env.api+'bank-statement', {
			params: { after: $scope.after, limit: $scope.limit }
		}).then(function (response) {
			for (var i = 0; i < response.data.data.bank_statements.length; i++) {
        var stat = response.data.data.bank_statements[i];
        stat.amount = parseInt(stat.amount).toLocaleString();
				$scope.bank_statements.push(stat);
			}
			if (response.data.data.bank_statements.length > 0) {
				$scope.after = response.data.data.bank_statements[response.data.data.bank_statements.length - 1].id;
			} else {
				$scope.scrollLast = true;
			}
			$scope.scrollBusy = false;
    })
  }

  $scope.refresh = function() {
    $scope.onRefresh = true;
    $http.get($scope.env.api2+'bank/collect').then(function (response) {
      $scope.onRefresh = false;
      $scope.bank_statements = [];
      $scope.after = 0;
      $scope.total = 0;
      $scope.onLoad = false;
      $scope.nextPage();
    });
  }
};
