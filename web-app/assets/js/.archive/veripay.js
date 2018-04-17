var veripayCtrl = function($scope, $rootScope, $http, $auth, $state, envConfig) {
	$rootScope.env = envConfig;

  $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIFGDE2LSLLNn1IChc0C4WxB0A3FKFYO8";

	$scope.isAuthenticated = function() {
	  //return true;
		return $auth.isAuthenticated();
    };

	$scope.logout = function() {
		$auth.logout();
		$state.go('login');
	}
	$scope.indexSearch = function(array, id) {
		return array.map(function(el) {
		  return el.id;
		}).indexOf(id);
    }

	/* $scope.getProvince = function() {
        $http.get($scope.env.api+'provinces').then(function (response) {
            $scope.provinces = response.data.provinces;
        })
    }

	$scope.getRegency = function(province_id) {
        $http.get($scope.env.api+'provinces/'+province_id+'/regencies').then(function (response) {
            $scope.regencies = response.data.regencies;
        })
    }
	$scope.getDistrict = function(regency_id) {
        $http.get($scope.env.api+'regencies/'+regency_id+'/districts').then(function (response) {
            $scope.districts = response.data.districts;
        })
    }
	$scope.getVillage = function(district_id) {
        $http.get($scope.env.api+'districts/'+district_id+'/villages').then(function (response) {
            $scope.villages = response.data.villages;
        })
    }

	$scope.getSynod = function() {
        $http.get($scope.env.api+'synods').then(function (response) {
            $scope.synods = response.data.synod;
        })
    }

	$scope.getKlasis = function() {
        $http.get($scope.env.api+'klasis').then(function (response) {
            $scope.klasis = response.data.klasis;
        })
    }

	$scope.getChurch = function() {
        $http.get($scope.env.api+'churches').then(function (response) {
            $scope.churches = response.data.churches;
        })
    }

	$scope.getJob = function() {
        $http.get($scope.env.api+'jobs').then(function (response) {
            $scope.jobs = response.data.jobs;
        })
    }

    $scope.getServiceType = function() {
        $http.get($scope.env.api+'servicetypes').then(function (response) {
            $scope.serviceTypes = response.data.serviceTypes;
        })
    }

	$scope.getHobby = function() {
        $http.get($scope.env.api+'hobbies').then(function (response) {
            $scope.hobbies = response.data.hobbies;
        })
    } */
};
