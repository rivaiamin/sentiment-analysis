var mutationCtrl = function($scope, $rootScope, $http, $sanitize, $location, Notification) {
  $scope.onEdit = false;
  //$scope.input = {};
  $scope.mutations = [];
  $scope.total = 0;
  $scope.onLoad = false;
  $scope.onEditStatus = false;
  $scope.limit = 20;
  $scope.after = 0;

  $scope.enableEditStatus = function() {
    //$scope.onEditStatus = true;
    alert("Belom dibuat");
  }

  $scope.nextPage = function() {
		$scope.scrollBusy = true;
		$http.get($scope.env.api+'mutation', {
			params: { after: $scope.after, limit: $scope.limit }
		}).then(function (response) {
			for (var i = 0; i < response.data.data.mutations.length; i++) {
        $scope.mutations.push(response.data.data.mutations[i]);
      }
			if (response.data.data.mutations.length > 0) {
				$scope.after = response.data.data.mutations[response.data.data.mutations.length - 1].id;
			} else {
				$scope.scrollLast = true;
			}
			$scope.scrollBusy = false;
    })
	}

  $scope.updateMutationStatus = function(id, input) {
    $http.put($scope.env.api+'mutation/'+id, {status: input})
    .then(function (response) {
      //Notification({message: response.data.message}, response.data.code);
      if (response.data.code == '0') return true;
      else return false;
    });
  }

  $scope.deleteMutation = function(id) {
    var index = $scope.indexSearch($scope.mutations, id);
    if (confirm('delete mutation?')) {
      $scope.onLoad = true;
      $http.delete($scope.env.api+'mutation/'+id)
      .then(function (response) {
        Notification({message: response.data.message}, response.data.code);
        if (response.data.code == '0') {
          //console.log(response.mutations);
          $scope.mutations.splice(index, 1);
        }
        $scope.onLoad = false;
      })
    }
  }
};
