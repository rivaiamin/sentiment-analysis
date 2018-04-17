var productTypeCtrl = function($scope, $rootScope, $http, $sanitize, $location, Notification) {
  $scope.onEdit = false;
  $scope.input = {};
  $scope.product_types = [];
  $scope.totalProductTypes = 0;
  $scope.limit = 10;
  $scope.after = 0;
  $scope.scrollBusy = false;
  $scope.scrollLast = false;

  $scope.cancelEdit = function() {
    $scope.onEdit = false;
    $scope.input = {};
  }

  $scope.listProductType = function() {
    $scope.onLoad = true;
    $http.get($scope.env.api+'product-type').then(function (response) {
      $scope.product_types = response.data.data.product_types;
      $scope.onLoad = false;
    })
  }
  $scope.listProductType();

  $scope.editProductType = function(id) {
    $location.hash('');
    $scope.onEdit = true;
    $http.get($scope.env.api+'product-type/'+id)
    .then(function (response) {
      $scope.input = response.data.data.product_type;
      if ($scope.input.display == 1) $scope.input.display = true;
      else if ($scope.input.display == 0) $scope.input.display = false;
      $scope.input.type = parseInt($scope.input.type);
      $('#content').trumbowyg('html', $scope.input.content);
      $location.hash('productTypeForm');
    });
  };

  $scope.saveProductType = function(input) {
    $scope.onSave = true;
    if (input.id === undefined) {
      $http.post($scope.env.api+'product-type', input)
      .then(function (response) {
        Notification({ message: response.data.message}, "success");
        if (response.data.code == '0') {
          $scope.product_types.push(response.data.data.product_type);
          $scope.input = response.data.data.product_type;
          //$scope.input.id = response.data.product_type.id;
        }
        $scope.onSave = false;
        $scope.input = {};
      });
    } else {
      $http.put($scope.env.api+'product-type/'+input.id, input)
      .then(function (response) {
        var index = $scope.indexSearch($scope.product_types, input.id);
        if (response.data.code == '0') $scope.product_types[index] = response.data.data.product_type;
        Notification({ message: response.data.message}, "success");
        $scope.onSave = false;
      });
    }
  };

  $scope.deleteProductType = function(id) {
    var index = $scope.indexSearch($scope.product_types, id);
    if (confirm('delete product_type?')) {
      $scope.onLoad = true;
      $http.delete($scope.env.api+'product-type/'+id)
      .then(function (response) {
        Notification({ message: response.data.message}, response.data.status);
        if (response.data.code == '0') {
          //console.log(response.product_types);
          $scope.product_types.splice(index, 1);
        }
        $scope.onLoad = false;
      })
    }
  }
};
