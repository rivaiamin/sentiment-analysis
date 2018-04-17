var paymentMethodCtrl = function($scope, $rootScope, $http, $sanitize, $location, Notification) {
  $scope.onEdit = false;
  $scope.input = {};
  $scope.payment_methods = [];
  $scope.totalPayments = 0;
  $scope.limit = 10;
  $scope.after = 0;

  $scope.cancelEdit = function() {
    $scope.onEdit = false;
    $scope.edit = [];
  }

  $scope.listPaymentMethod = function() {
    $scope.onLoad = true;
    $http.get($scope.env.api+'payment-method').then(function (response) {
      $scope.payment_methods = response.data.data.payment_methods;
      $scope.onLoad = false;
    })
  }
  $scope.listPaymentMethod();

  $scope.editPayment = function(id) {
    $location.hash('');
    $scope.onEdit = true;
    $http.get($scope.env.api+'payment-method/'+id)
    .then(function (response) {
      $scope.input = response.data.data.payment_method;
      if ($scope.input.display == 1) $scope.input.display = true;
      else if ($scope.input.display == 0) $scope.input.display = false;
      $scope.input.type = parseInt($scope.input.type);
      $('#content').trumbowyg('html', $scope.input.content);
      $location.hash('payment_methodForm');
    });
  };

  $scope.savePayment = function(input) {
    $scope.onSave = true;
    if (input.id === undefined) {
      $http.post($scope.env.api+'payment-method', input)
      .then(function (response) {
        Notification({message: response.data.message}, "success");
        if (response.data.code == '0') {
          $scope.payment_methods.push(response.data.data.payment_method);
          $scope.input = response.data.data.payment_method;
          //$scope.input.id = response.data.payment_method.id;
        }
        $scope.onSave = false;
        $scope.input = {};
      });
    } else {
      $http.put($scope.env.api+'payment-method/'+input.id, input)
      .then(function (response) {
        var index = $scope.indexSearch($scope.payment_methods, input.id);
        if (response.data.code == '0') $scope.payment_methods[index] = response.data.data.payment_method;
        Notification({message: response.data.message}, "success");
        $scope.onSave = false;
      });
    }
  };

  $scope.deletePayment = function(id) {
    var index = $scope.indexSearch($scope.payment_methods, id);
    if (confirm('delete payment method?')) {
      $scope.onLoad = true;
      $http.delete($scope.env.api+'payment-method/'+id)
      .then(function (response) {
        Notification({message: response.data.message}, response.data.status);
        if (response.data.code == '0') {
          //console.log(response.payment_methods);
          $scope.payment_methods.splice(index, 1);
        }
        $scope.onLoad = false;
      })
    }
  }
};
