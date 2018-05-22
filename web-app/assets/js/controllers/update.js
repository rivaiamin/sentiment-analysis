var updateCtrl = function($http, $scope, $rootScope, $timeout, Upload) {
  /* $scope.uploadFile = function(isValid, file) {
    if (isValid) {
      $scope.onProgress1 = true;
      Upload.upload({
        url: "http://localhost:8983/solr/sentiment/update/json/docs?commit=true",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: {file}
      }).then(function (resp) {
        $scope.onProgress1 = false;
        $scope.file.cover = resp.data.data.cover;
      }, function (resp) {
        Notification({'message':resp.data.message}, resp.data.status);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        $scope.progress1 = progressPercentage;
      });
    }
  }; */

  $scope.update = function() {
    /* var json = '{"id":995447965819985920,"text":"@opickabu542 @IndosatCare @YLKI_ID @kemkominfo Gantio kartu ae bodone","user_id":721001052980416512,"user_name":"yrc93","created_at":"Sat May 12 23:37:44 +0000 2018","source":"<a href=\"http:\/\/twitter.com\/download\/android\" rel=\"nofollow\">Twitter for Android<\/a>"}';
    $http.post("http://localhost:8983/solr/sentiment/update/json/docs", json)
    .then(function (response) {
      docs = response.data.response.docs;
      for (i=0;i<docs.length;i++) {
        $scope.docs.push(docs[i]);
      }
      $scope.start += docs.length;

      if (docs.length == 0)$scope.scrollLast = true;

      $timeout($scope.scrollBusy = false, 10000);
      $timeout($("body").getNiceScroll().resize(), 1000);
    }) */

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:8983/solr/sentiment/update/json/docs",
      "method": "POST",
      "headers": {
        "Cache-Control": "no-cache",
        "Postman-Token": "94317d77-2ac6-a102-adb1-94603b7c9a8f"
      },
      "data": '{"id":995447965819985920,"text":"@opickabu542 @IndosatCare @YLKI_ID @kemkominfo Gantio kartu ae bodone","user_id":721001052980416512,"user_name":"yrc93","created_at":"Sat May 12 23:37:44 +0000 2018","source":"<a href=\"http:\/\/twitter.com\/download\/android\" rel=\"nofollow\">Twitter for Android<\/a>"}',
    }

    $.ajax(settings).done(function (response) {
      console.log(response);
    });
  }

}
