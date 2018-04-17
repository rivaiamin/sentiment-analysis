var checkCtrl = function($http, $scope, $rootScope, $timeout) {
  $scope.onLoad = false;
  $scope.sentiment = {};

  $scope.check = function() {
    $scope.onLoad = true;
    params = {
      full_text: $scope.full_text
    }

    $http.post("http://api.sentiman.dev/check/", params)
    .then(function (response) {
      $scope.sentiment = {
        code: response.data.data.sentiment,
        label: response.data.data.sentiment_label,
      }
      $scope.onLoad = false;
    })
  }

};
