var bannerCtrl = function($scope, $rootScope, $http, $sanitize, $location, Notification, Upload) {
  $scope.onEdit = false;
  $scope.input = {};
  $scope.banners = [];
  $scope.totalBanners = 0;
  $scope.limit = 10;
  $scope.after = 0;
  $scope.scrollBusy = false;
  $scope.scrollLast = false;

  $scope.banner_types = [{'id':1, 'name':'URL'},{'id':2, 'name':'Menu'}];

  $scope.cancelEdit = function() {
    $scope.onEdit = false;
    $scope.edit = [];
  }

  $scope.nextPage = function() {
    $scope.scrollBusy = true;
    $http.get($scope.env.api+'banner', {
      params: {after: $scope.after, limit: $scope.limit}
    }).then(function (response) {
      for (var i = 0; i < response.data.data.banners.length; i++) {
          $scope.banners.push(response.data.data.banners[i]);
      }
      if (response.data.data.banners.length > 0) {
          $scope.after = response.data.data.banners[response.data.data.banners.length - 1].id;
      } else {
          $scope.scrollLast = true;
      }
      $scope.scrollBusy = false;
    })
  }

  $scope.editBanner = function(id) {
    $location.hash('');
    $scope.onEdit = true;
    $http.get($scope.env.api+'banner/'+id)
    .then(function (response) {
      $scope.input = response.data.data.banner;
      if ($scope.input.display == 1) $scope.input.display = true;
      else if ($scope.input.display == 0) $scope.input.display = false;
      $scope.input.type = parseInt($scope.input.type);
      $('#content').trumbowyg('html', $scope.input.content);
      $location.hash('bannerForm');
    });
  };

  $scope.uploadPicture = function(isValid, file) {
    $scope.onProgress1 = true;
    Upload.upload({
        url: $scope.env.api+'banner/picture',
        method: 'POST',
        data: {
            picture: file,
        }
    }).then(function (resp) {
        $scope.onProgress1 = false;
        if (resp.data.code == '0') {
          $scope.input.picture = resp.data.data.picture;
        }
    }, function (resp) {
        Notification({message: resp.data.message}, resp.data.status);
    }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        $scope.progress1 = progressPercentage;
    });
  };

  $scope.saveBanner = function(input) {
    $scope.onSave = true;
    input.content = $sanitize($("#content").trumbowyg('html'));
    if (input.id === undefined) {
      $http.post($scope.env.api+'banner', input)
      .then(function (response) {
        Notification({message: response.data.message}, "success");
        if (response.data.code == '0') {
          $scope.banners.push(response.data.data.banner);
          $scope.input = response.data.data.banner;
          //$scope.input.id = response.data.banner.id;
        }
        $scope.onSave = false;
        $scope.input = {};
      });
    } else {
      $http.put($scope.env.api+'banner/'+input.id, input)
      .then(function (response) {
        var index = $scope.indexSearch($scope.banners, input.id);
        if (response.data.code == '0') $scope.banners[index] = response.data.data.banner;
        Notification({message: response.data.message}, "success");
        $scope.onSave = false;
      });
    }
  };

  $scope.deleteBanner = function(id) {
    var index = $scope.indexSearch($scope.banners, id);
    if (confirm('delete banner?')) {
      $scope.onLoad = true;
      $http.delete($scope.env.api+'banner/'+id)
      .then(function (response) {
        Notification({message: response.data.message}, response.data.status);
        if (response.data.code == '0') {
          //console.log(response.banners);
          $scope.banners.splice(index, 1);
        }
        $scope.onLoad = false;
      })
    }
  }
};
