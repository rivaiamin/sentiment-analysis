var preprocessingCtrl = function($http, $scope, $rootScope, $timeout) {
  $scope.onLoad = false;

  $scope.preprocess = function() {
    $scope.onLoad = true;
    params = {
      "_": '1522816500417',
      "analysis.fieldname": "text",
      "analysis.fieldvalue": $scope.text,
      "analysis.showmatch": true,
      "verbose_output":1,
      "wt":"json"
    }

    $http.get("http://localhost:8983/solr/sentiment/analysis/field", {
      params: params
    }).then(function (response) {
      result = response.data.analysis.field_names.text.index;
      $scope.results = [];
      for (i=0; i<result[1].length; i++) {
        $scope.results[i] = {
          tokenize: result[1][i].text,
          lowercase: result[3][i].text,
          stopfilter: '',
          stem: ''
        };

        for (j=0; j<result[5].length; j++) {
          if (i+1 == parseInt(result[5][j].position)) {
            $scope.results[i].stopfilter = result[5][j].text;
            $scope.results[i].stem = result[7][j].text;
          }
        }
      }

      $scope.onLoad = false;
    })
  }

};
