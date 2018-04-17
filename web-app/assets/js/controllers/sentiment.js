var sentimentCtrl = function($http, $scope, $rootScope, $timeout) {
  $scope.rows = 20;
  $scope.start = 0;
  $scope.docs = [];
  $scope.scrollBusy = false;
  $scope.scrollLast = false;

  $scope.init = function() {
    $('.ui.dropdown').dropdown();
  }
  $timeout($scope.init(), 1000);

  $scope.search = function() {
    $scope.start = 0;
    $scope.docs = [];
    $scope.scrollLast = false;

    $scope.load();
  }

  $scope.load = function() {
    $scope.scrollBusy = true;

    params = {
      "indent":"on",
      "wt":"json",
      "rows": $scope.rows,
      "start": $scope.start
    };
    sentiment = $("#sentimentFilter").dropdown('get value');
    keyword = $scope.keyword;

    params.q = 'sentiment:'+sentiment;
    if (keyword != undefined) params.q += ' AND full_text:'+'"%'+keyword+'%"';

    $http.get("http://localhost:8983/solr/sentiment/select", {
      params: params
    }).then(function (response) {
      docs = response.data.response.docs;
      for (i=0;i<docs.length;i++) {
        $scope.docs.push(docs[i]);
      }
      $scope.start += docs.length;

      if (docs.length == 0)$scope.scrollLast = true;

      $timeout($scope.scrollBusy = false, 10000);
      $timeout($("body").getNiceScroll().resize(), 1000);
    })
  }

};
