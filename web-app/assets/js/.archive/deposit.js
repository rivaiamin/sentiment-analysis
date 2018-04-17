var depositCtrl = function($scope, $rootScope, $http, $sanitize, $location, Notification) {
  // init
  $scope.onEdit = false;
  $scope.deposits = [];
  $scope.total = 0;
  $scope.onLoad = false;
  $scope.onEditStatus = false;
  $scope.limit = 20;
  $scope.offset = 0;
  $scope.find = [];
  $scope.sort = { field: 'created_at', by: 'DESC' };
  $scope.status = [
    { id:0, val: 'UNCONFIRMED'},
    { id:1, val: 'CONFIRMED', },
    { id:2, val: 'NOT_FOUND' },
    { id:3, val: 'EXPIRED' },
    { id:4, val: 'SUCCESS' }
  ];
  $scope.status_color = ['red', 'green', 'yellow', 'grey', 'blue'];

  angular.element('#sorter_created_at').addClass('descending');

  //function
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
    $scope.deposits = [];
    $scope.scrollLast = false;
    $scope.nextPage();
  }

  $scope.search = function() {
    $scope.offset = 0;
    $scope.deposits = [];
    $scope.scrollLast = false;

    if ($scope.find.field == 'created_at') $scope.find.keyword = moment($scope.find.keyword).format('YYYY-MM-DD')

    $scope.nextPage();
  }

  $scope.resetSearch = function() {
    $scope.offset = 0;
    $scope.deposits = [];
    $scope.scrollLast = false;
    $scope.find = [];
    $scope.nextPage();
  }

  $scope.nextPage = function() {
    $scope.scrollBusy = true;
		$http.get($scope.env.api+'deposit', {
			params: {
        offset: $scope.offset,
        limit: $scope.limit,
        sort_field: $scope.sort.field,
        sort_by: $scope.sort.by,
        search_field: $scope.find.field,
        search_keyword: $scope.find.keyword
      }
		}).then(function (response) {
			for (var i = 0; i < response.data.data.deposits.length; i++) {
        var deposit = response.data.data.deposits[i];

        if (deposit.check_mutation != 0) deposit.check_mutation = moment(parseInt(deposit.check_mutation)*1000).format("DD/MM h:mm:ss");
        else deposit.check_mutation = "";
        amount = parseInt(deposit.real_amount) + parseInt(deposit.unique_amount);
        deposit.amount = amount.toLocaleString();

        $scope.deposits.push(deposit);
      }
			if (response.data.data.deposits.length > 0) {
				$scope.offset += response.data.data.deposits.length;
			} else {
				$scope.scrollLast = true;
      }

      //fixing order
      //if ($scope.sort.by == 'ASC') $scope.reverse = true;
      //else $scope.reverse = false;
      //$scope.deposits = orderByFilter($scope.deposits, $scope.sort.field);

      $scope.scrollBusy = false;
    })
	}

  $scope.updateDepositStatus = function(id, input) {
    $http.put($scope.env.api+'deposit/'+id, {status: input})
    .then(function (response) {
      //Notification({message: response.data.message}, response.data.code);
      if (response.data.code == '0') return true;
      else return false;
    });
  }

  $scope.deleteDeposit = function(id) {
    var index = $scope.indexSearch($scope.deposits, id);
    if (confirm('delete deposit?')) {
      $scope.onLoad = true;
      $http.delete($scope.env.api+'deposit/'+id)
      .then(function (response) {
        Notification({message: response.data.message}, response.data.code);
        if (response.data.code == '0') {
          $scope.deposits.splice(index, 1);
        }
        $scope.onLoad = false;
      })
    }
  }

  $scope.refresh = function() {
    $scope.onRefresh = true;
    $http.get($scope.env.api2+'topup-check').then(function (response) {
      $scope.onRefresh = false;
      $scope.deposits = [];
      $scope.offset = 0;
      $scope.total = 0;
      $scope.onLoad = false;
      $scope.nextPage();
    });
  }
};
