var productCtrl = function($scope, $rootScope, $http, $sanitize, $location, $timeout, Notification) {
  $scope.onEdit = false;
  $scope.input = {};
  $scope.products = [];
  $scope.totalProducts = 0;
  $scope.limit = 10;
  $scope.after = 0;
  $scope.scrollBusy = false;
  $scope.scrollLast = false;

  $scope.init = function() {
    $('.ui.checkbox').checkbox();
  }
  $timeout($scope.init(), 1000);

  $scope.breakdown = [
    { id:0, val: "NO" },
    { id:1, val: "YES" },
  ];
  $scope.status = [
    { id:0, val: "OUT" },
    { id:1, val: "IN" },
  ];

  $scope.label1 = ['blue', 'red'];
  $scope.label2 = ['red', 'blue'];

  $scope.cancelEdit = function() {
    $scope.onEdit = false;
    $scope.input = {};
  }

  $scope.changeServer = function(server) {
    $scope.server = server;
    if (server == 'dompul') {
      $scope.product_server = "Dompet Pulsa";
      $scope.dompultab = true;
      $scope.sibaytab = false;
    } else if (server == 'sibay') {
      $scope.product_server = "Siap Bayar";
      $scope.dompultab = false;
      $scope.sibaytab = true;
    }
  }

  $scope.listProduct = function(server) {
    $scope.onLoad = true;

    $scope.changeServer(server);

    $http.get($scope.env.api+'product/'+server).then(function (response) {
      $scope.dompul_products = response.data.data.dompul_products;
      $scope.sibay_products = response.data.data.sibay_products;
      $scope.product_types = response.data.data.product_types;
      $scope.providers = response.data.data.providers;
      $scope.mcommerces = response.data.data.mcommerces;
      $scope.onLoad = false;

      // initiate dropdown
      $scope.dompul = [];
      for (var i=0; i < $scope.dompul_products.length; i++) {
        $scope.dompul[i] = { name: $scope.dompul_products[i].name, value: $scope.dompul_products[i].id };
      }

      $('.ui.dropdown').dropdown({
        values: $scope.dompul,
        onChange: function(value, text, $selectedItem) {
          var index = $scope.indexSearch($scope.dompul_products, value);
          console.log(value);
          $scope.input.product_type_id = $scope.products[index].product_type_id;
          $scope.input.provider_id = $scope.products[index].provider_id;
        }
      });
    })
  }
  $scope.listProduct("dompul");

  $scope.editProduct = function(id) {
    $location.hash('');
    $scope.onEdit = true;
    $http.get($scope.env.api+'product/'+id)
    .then(function (response) {
      $scope.input = response.data.data.product;
      if ($scope.input.display == 1) $scope.input.display = true;
      else if ($scope.input.display == 0) $scope.input.display = false;
      $scope.input.type = parseInt($scope.input.type);
      $location.hash('productTypeForm');
    });
  };

  $scope.saveProduct = function(input) {
    $scope.onSave = true;
    if (input.id === undefined) {
      $http.post($scope.env.api+'product', input)
      .then(function (response) {
        Notification({ message: response.data.message}, "success");
        if (response.data.code == '0') {
          $scope.products.push(response.data.data.product);
          $scope.input = response.data.data.product;
          //$scope.input.id = response.data.product.id;
        }
        $scope.onSave = false;
        $scope.input = {};
      });
    } else {
      $http.put($scope.env.api+'product/'+input.id, input)
      .then(function (response) {
        var index = $scope.indexSearch($scope.products, input.id);
        if (response.data.code == '0') $scope.products[index] = response.data.data.product;
        Notification({ message: response.data.message}, "success");
        $scope.onSave = false;
      });
    }
  };

  $scope.deleteProduct = function(id) {
    var index = $scope.indexSearch($scope.products, id);
    if (confirm('delete product?')) {
      $scope.onLoad = true;
      $http.delete($scope.env.api+'product/'+id)
      .then(function (response) {
        Notification({ message: response.data.message}, response.data.status);
        if (response.data.code == '0') {
          //console.log(response.products);
          $scope.products.splice(index, 1);
        }
        $scope.onLoad = false;
      })
    }
  }

  $scope.updateStatus = function(id, input) {
    $http.put($scope.env.api+'product/'+id+'/status', {status: input})
    .then(function (response) {
      Notification({message: response.data.message}, response.data.code);
      if (response.data.code == '0') return true;
      else return false;
    });
  }

  $scope.updateBreakdown = function(id, input) {
    $http.put($scope.env.api+'product/'+id+'/breakdown', {breakdown: input})
    .then(function (response) {
      Notification({message: response.data.message}, response.data.code);
      if (response.data.code == '0') return true;
      else return false;
    });
  }



};
