var inboxCtrl = function($scope, $rootScope, $http, $sanitize, $location, Notification) {
  $scope.onEdit = false;
  $scope.input = {};
  $scope.inboxes = [];
  $scope.total = 0;
  $scope.limit = 10;
  $scope.after = 0;
  $scope.scrollBusy = false;
  $scope.scrollLast = false;

  $scope.nextPage = function() {
    $scope.scrollBusy = true;
    $http.get($scope.env.api+'inbox', {
      params: {after: $scope.after, limit: $scope.limit}
    }).then(function (response) {
      for (var i = 0; i < response.data.data.inboxes.length; i++) {
          $scope.inboxes.push(response.data.data.inboxes[i]);
      }
      if (response.data.data.inboxes.length > 0) {
          $scope.after = response.data.data.inboxes[response.data.data.inboxes.length - 1].id;
      } else {
          $scope.scrollLast = true;
      }
      $scope.scrollBusy = false;
    })
  }
};
