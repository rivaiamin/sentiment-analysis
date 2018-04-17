var notificationCtrl = function($scope, $rootScope, $http, $sanitize, $location, Notification) {
  $scope.onEdit = false;
  $scope.input = {};
  $scope.notifications = [];
  $scope.totalNotifications = 0;
  $scope.limit = 10;
  $scope.after = 0;
  $scope.scrollBusy = false;
  $scope.scrollLast = false;

  $scope.cancelEdit = function() {
    $scope.onEdit = false;
    $scope.input = {};
  }

  $scope.nextPage = function() {
    $scope.scrollBusy = true;
    $http.get($scope.env.api+'notification', {
      params: {after: $scope.after, limit: $scope.limit}
    }).then(function (response) {
      for (var i = 0; i < response.data.data.notifications.length; i++) {
          $scope.notifications.push(response.data.data.notifications[i]);
      }
      if (response.data.data.notifications.length > 0) {
          $scope.after = response.data.data.notifications[response.data.data.notifications.length - 1].id;
      } else {
          $scope.scrollLast = true;
      }
      $scope.scrollBusy = false;
    })
  }

  $scope.editNotification = function(id) {
    $location.hash('');
    $scope.onEdit = true;
    $http.get($scope.env.api+'notification/'+id)
    .then(function (response) {
      $scope.input = response.data.data.notification;
      if ($scope.input.display == 1) $scope.input.display = true;
      else if ($scope.input.display == 0) $scope.input.display = false;
      $scope.input.type = parseInt($scope.input.type);
      $('#content').trumbowyg('html', $scope.input.content);
      $location.hash('notificationForm');
    });
  };

  $scope.saveNotification = function(input) {
    $scope.onSave = true;
    if (input.id === undefined) {
      $http.post($scope.env.api+'notification', input)
      .then(function (response) {
        Notification({message: response.data.message}, "success");
        if (response.data.code == '0') {
          $scope.notifications.push(response.data.data.notification);
          $scope.input = response.data.data.notification;
          //$scope.input.id = response.data.notification.id;
        }
        $scope.onSave = false;
        $scope.input = {};
      });
    } else {
      $http.put($scope.env.api+'notification/'+input.id, input)
      .then(function (response) {
        var index = $scope.indexSearch($scope.notifications, input.id);
        if (response.data.code == '0') $scope.notifications[index] = response.data.data.notification;
        Notification({message: response.data.message}, "success");
        $scope.onSave = false;
      });
    }
  };

  $scope.deleteNotification = function(id) {
    var index = $scope.indexSearch($scope.notifications, id);
    if (confirm('delete notification?')) {
      $scope.onLoad = true;
      $http.delete($scope.env.api+'notification/'+id)
      .then(function (response) {
        Notification({message: response.data.message}, response.data.status);
        if (response.data.code == '0') {
          //console.log(response.notifications);
          $scope.notifications.splice(index, 1);
        }
        $scope.onLoad = false;
      })
    }
  }
};
