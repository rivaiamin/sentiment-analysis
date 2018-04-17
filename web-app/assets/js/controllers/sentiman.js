var sentimanCtrl = function($http, $scope, $rootScope, $timeout) {
  $scope.sentimentLabel = function(code) {
    switch (code){
      case "00":
        return "Neutral";
        break;
      case "10":
        return "Positive";
        break;
      case "01":
        return "Negative";
        break;
      case "11":
        return "Mixed";
        break;
    }
  }

  $scope.sentimentColor = function(code) {
    switch (code){
      case "00":
        return "gray";
        break;
      case "10":
        return "blue";
        break;
      case "01":
        return "red";
        break;
      case "11":
        return "purple";
        break;
    }
  }

  $scope.sentimentIcon = function(code) {
    switch (code){
      case "00":
        return "info circle";
        break;
      case "10":
        return "plus circle";
        break;
      case "01":
        return "minus circle";
        break;
      case "11":
        return "question circle";
        break;
    }
  }
};
