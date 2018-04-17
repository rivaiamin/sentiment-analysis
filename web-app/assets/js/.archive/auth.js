var authCtrl = function($scope, $rootScope, $auth, $state, Notification) {
  $scope.onLoad = false;

  $scope.login = function() {
    $scope.onLoad = true;
    $auth.login($scope.user, {
      url: $scope.env.api + 'login'
    }).then(function(response) {
        // Redirect user here after a successful log in.
        //console.log(response.token)
        //$scope.getAuthUser();
        //$state.go('dashboard');
        $scope.onLoad = false;
        console.log(response);
        if (response.data.code==0) window.location.href = '/';
        else Notification({message: response.data.message}, 'error');
      })
      .catch(function(response) {
        Notification({message: response.data.message}, response.data.status);
        $scope.onLoad = false;
      });
	}
};
