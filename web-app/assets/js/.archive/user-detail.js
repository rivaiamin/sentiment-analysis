var userDetailCtrl = function($http, $scope, $rootScope, $stateParams, Notification) {
  $scope.onLoad = false;

  $scope.status = [
    { id:0, val: 'UNCONFIRMED'},
    { id:1, val: 'PROCESSED', },
    { id:2, val: 'PROCESSED' },
    { id:3, val: 'FAILED' },
    { id:4, val: 'SUCCESS' }
  ];

  $scope.status_color = ['red', 'yellow', 'yellow', 'grey', 'blue'];

  $scope.typeColor = function(type) {
    if (type == 'Deposit') return 'blue';
    else return 'green';
  }

  $scope.gender = function(id) {
    if (id == '2') return 'woman';
    else if (id == '1') return 'man';
  }

  // TODO: create pagination

  $scope.userDetail = function() {
    $scope.onLoad = true
    $http.get($scope.env.api+'user/'+$stateParams.id)
    .then(function (response) {
      $scope.user = response.data.data.user;
      $scope.histories = response.data.data.user.histories;
      $scope.user.profile.balance = $scope.user.profile.balance.toLocaleString();
      $scope.user.profile.born_date = moment($scope.user.profile.born_date*1000).format("MMM Do YY");

      var location = $scope.user.profile.location;
      if (location != null && location != '0.0,0.0') {
        $scope.user.location = location.split(',');
        $scope.user.location.lat = parseFloat($scope.user.location[0]);
        $scope.user.location.long = parseFloat($scope.user.location[1]);
        console.log($scope.user.location);
      } else $scope.user.location = null;

      $scope.onLoad = false;
    });
  }

  $scope.userDetail();

}
