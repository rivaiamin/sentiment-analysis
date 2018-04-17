var transactionCtrl = function($scope, $rootScope, $http, $sanitize, $location, Notification) {
  $scope.onEdit = false;
  //$scope.input = {};
  $scope.transactions = [];
  $scope.total = 0;
  $scope.onLoad = false;
  $scope.onEditStatus = false;
  $scope.limit = 20;
  $scope.offset = 0;
  $scope.find = [];
  $scope.sort = { field: 'created_at', by: 'DESC' };
  angular.element('#sorter_created_at').addClass('descending');
  $scope.status = [
    { id:1, val: 'PROCESSED', },
    { id:3, val: 'FAILED' },
    { id:4, val: 'SUCCESS' }
  ];
  $scope.status_label = function($id) {
    if ($id == 1) return 'PROCESSED';
    else if ($id == 3) return 'FAILED';
    else if ($id == 4) return 'SUCCESS';
  };

  $scope.status_color = function($id) {
    if ($id == 1) return 'yellow';
    else if ($id == 3) return 'grey';
    else if ($id == 4) return 'blue';
  }

  $scope.enableEditStatus = function() {
    //$scope.onEditStatus = true;
    alert("Belom dibuat");
  }

  $scope.sorter = function(field) {
    if (field == $scope.sort.field) {
      el = angular.element('#sorter_'+field);
      if ($scope.sort.by == 'ASC') {
        $scope.sort.by = 'DESC';
        el.removeClass('ascending');
        el.addClass('descending');
      } else if ($scope.sort.by == 'DESC') {
        $scope.sort.by = 'ASC';
        el.addClass('ascending');
        el.removeClass('descending');
      }
    } else {
      el = angular.element('#sorter_'+$scope.sort.field);
      el.removeClass('ascending');
      el.removeClass('descending');
      $scope.sort.field = field;
      $scope.sort.by = 'DESC';
      angular.element('#sorter_'+$scope.sort.field).addClass('descending');
    }
    $scope.offset = 0;
    $scope.transactions = [];
    $scope.scrollLast = false;
    $scope.nextPage();
  }

  $scope.search = function() {
    $scope.offset = 0;
    $scope.transactions = [];
    $scope.scrollLast = false;

    if ($scope.find.field == 'created_at') $scope.find.keyword = moment($scope.find.keyword).format('YYYY-MM-DD')

    $scope.nextPage();
  }

  $scope.resetSearch = function() {
    $scope.offset = 0;
    $scope.transactions = [];
    $scope.scrollLast = false;
    $scope.find = [];
    $scope.nextPage();
  }

  $scope.nextPage = function() {
		$scope.scrollBusy = true;
		$http.get($scope.env.api+'transaction', {
			params: {
        offset: $scope.offset,
        limit: $scope.limit,
        sort_field: $scope.sort.field,
        sort_by: $scope.sort.by,
        search_field: $scope.find.field,
        search_keyword: $scope.find.keyword
      }
		}).then(function (response) {
			for (var i = 0; i < response.data.data.transactions.length; i++) {
        $scope.transactions.push(response.data.data.transactions[i]);
      }
			if (response.data.data.transactions.length > 0) {
				$scope.offset += response.data.data.transactions.length;
			} else {
				$scope.scrollLast = true;
			}
			$scope.scrollBusy = false;
    })
	}

  $scope.updateTransactionStatus = function(id, input) {
    $http.put($scope.env.api+'transaction/'+id, {status: input})
    .then(function (response) {
      //Notification({message: response.data.message}, response.data.code);
      if (response.data.code == '0') {
        var index = $scope.indexSearch($scope.transactions, id);
        $scope.transactions[index] = response.data.data.transaction;
        return true;
      } else return false;
    });
  }

  $scope.enableEditStatus = function() {
    alert("undone");
  }

  $scope.deleteTransaction = function(id) {
    var index = $scope.indexSearch($scope.transactions, id);
    if (confirm('delete transaction?')) {
      $scope.onLoad = true;
      $http.delete($scope.env.api+'transaction/'+id)
      .then(function (response) {
        Notification({message: response.data.message}, response.data.code);
        if (response.data.code == '0') {
          //console.log(response.transactions);
          $scope.transactions.splice(index, 1);
        }
        $scope.onLoad = false;
      })
    }
  }
};
