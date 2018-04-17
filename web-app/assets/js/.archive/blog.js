var blogCtrl = function($scope, $rootScope, $http, $sanitize, $location, Notification, Upload) {
  $scope.onEdit = false;
  $scope.input = {};
  $scope.blogs = [];
  $scope.totalBlogs = 0;
  $scope.limit = 10;
  $scope.after = 0;
  $scope.scrollBusy = false;
  $scope.scrollLast = false;

  //editor
  $.trumbowyg.svgPath = '/assets/img/icons.svg';
  $('.trumbowyg').trumbowyg({lang: 'id'});
  $('#content').trumbowyg('html', 'content');

  $scope.genSlug = function (str) {
    str = str.replace(/[^a-zA-Z0-9\s]/g, "");
    str = str.toLowerCase();
    str = str.replace(/\s/g, '-');
    return str;
  };

  $scope.cancelEdit = function() {
    $scope.onEdit = false;
    $scope.edit = [];
  }

  $scope.nextPage = function() {
    $scope.scrollBusy = true;
    $http.get($scope.env.api+'blog', {
      params: {after: $scope.after, limit: $scope.limit}
    }).then(function (response) {
      for (var i = 0; i < response.data.data.blogs.length; i++) {
          $scope.blogs.push(response.data.data.blogs[i]);
      }
      if (response.data.data.blogs.length > 0) {
          $scope.after = response.data.data.blogs[response.data.data.blogs.length - 1].id;
      } else {
          $scope.scrollLast = true;
      }
      $scope.scrollBusy = false;
    })
  }

  $scope.editBlog = function(id) {
    $location.hash('');
    $scope.onEdit = true;
    $http.get($scope.env.api+'blog/'+id)
    .then(function (response) {
      $scope.input = response.data.data.blog;
      $('#content').trumbowyg('html', $scope.input.content);
      $location.hash('blogForm');
    });
  };

  $scope.uploadPicture = function(isValid, file) {
    $scope.onProgress1 = true;
    Upload.upload({
        url: $scope.env.api+'blog/picture',
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

  $scope.saveBlog = function(input) {
    $scope.onSave = true;
    input.content = $sanitize($("#content").trumbowyg('html'));
    if (input.id === undefined) {
      $http.post($scope.env.api+'blog', input)
      .then(function (response) {
        Notification({message: response.data.message}, response.data.status);
        if (response.data.code == '0') {
          $scope.blogs.push(response.data.data.blog);
          $scope.input = response.data.data.blog;
          //$scope.input.id = response.data.blog.id;
        }
        $scope.onSave = false;
        $scope.input = {};
      });
    } else {
      $http.put($scope.env.api+'blog/'+input.id, input)
      .then(function (response) {
        var index = $scope.indexSearch($scope.blogs, input.id);
        if (response.data.code == '0') $scope.blogs[index] = response.data.data.blog;
        Notification({message: response.data.message}, response.data.status);
        $scope.onSave = false;
      });
    }
  };

  $scope.deleteBlog = function(id) {
    var index = $scope.indexSearch($scope.blogs, id);
    if (confirm('delete blog?')) {
      $scope.onLoad = true;
      $http.delete($scope.env.api+'blog/'+id)
      .then(function (response) {
        Notification({message: response.data.message}, response.data.status);
        if (response.data.code == '0') {
          //console.log(response.blogs);
          $scope.blogs.splice(index, 1);
        }
        $scope.onLoad = false;
      })
    }
  }
};
