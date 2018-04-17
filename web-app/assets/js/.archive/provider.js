var providerCtrl = function($scope, $rootScope, $http, $sanitize, $location, Notification) {
  $scope.onEdit = false;
  $scope.input = {};
  $scope.providers = [];
  $scope.totalProviders = 0;
  $scope.limit = 10;
  $scope.after = 0;
  $scope.scrollBusy = false;
  $scope.scrollLast = false;

  $scope.cancelEdit = function() {
    $scope.onEdit = false;
    $scope.input = {};
  }

  $scope.listProvider = function() {
    $scope.onLoad = true;
    $http.get($scope.env.api+'provider').then(function (response) {
      $scope.providers = response.data.data.providers;
      $scope.onLoad = false;
    })
  }
  $scope.listProvider();

  $scope.editProvider = function(id) {
    $location.hash('');
    $scope.onEdit = true;
    $http.get($scope.env.api+'provider/'+id)
    .then(function (response) {
      $scope.input = response.data.data.provider;
      if ($scope.input.display == 1) $scope.input.display = true;
      else if ($scope.input.display == 0) $scope.input.display = false;
      $scope.input.type = parseInt($scope.input.type);
      $('#content').trumbowyg('html', $scope.input.content);
      $location.hash('productTypeForm');
    });
  };

  $scope.saveProvider = function(input) {
    $scope.onSave = true;
    if (input.id === undefined) {
      $http.post($scope.env.api+'provider', input)
      .then(function (response) {
        Notification({ message: response.data.message}, "success");
        if (response.data.code == '0') {
          $scope.providers.push(response.data.data.provider);
          $scope.input = response.data.data.provider;
          //$scope.input.id = response.data.provider.id;
        }
        $scope.onSave = false;
        $scope.input = {};
      });
    } else {
      $http.put($scope.env.api+'provider/'+input.id, input)
      .then(function (response) {
        var index = $scope.indexSearch($scope.providers, input.id);
        if (response.data.code == '0') $scope.providers[index] = response.data.data.provider;
        Notification({ message: response.data.message}, "success");
        $scope.onSave = false;
      });
    }
  };

  $scope.deleteProvider = function(id) {
    var index = $scope.indexSearch($scope.providers, id);
    if (confirm('delete provider?')) {
      $scope.onLoad = true;
      $http.delete($scope.env.api+'provider/'+id)
      .then(function (response) {
        Notification({ message: response.data.message}, response.data.status);
        if (response.data.code == '0') {
          //console.log(response.providers);
          $scope.providers.splice(index, 1);
        }
        $scope.onLoad = false;
      })
    }
  }
};
