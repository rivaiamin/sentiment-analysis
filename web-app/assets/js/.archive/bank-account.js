var bankAccountCtrl = function($scope, $rootScope, $http, $sanitize, $location, Notification) {
  $scope.onEdit = false;
  //$scope.input = {};
  $scope.bank_accounts = [];
  $scope.total = 0;
  $scope.onLoad = false;

  $scope.listBankAccount = function() {
      $scope.onLoad = true;
      $http.get($scope.env.api+'bank-account').then(function (response) {
        $scope.bank_accounts = response.data.data.bank_accounts;
        $scope.onLoad = false;
      })
  }
  $scope.listBankAccount();

};
