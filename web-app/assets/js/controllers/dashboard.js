var dashboardCtrl = function($http, $scope, $rootScope, $timeout) {
  //Sparkline chart settings
  var sparker = function () {
    $("#sparkline1").sparkline([5, 2, 4, 9, 3, 4, 7, 2, 6, 4], { type: 'bar', barColor: 'rgba(255,255,255,0.5)', height: '58px', width: '100%', barWidth: 3, barSpacing: 4, spotRadius: 4, chartRangeMin: 1 });
    $("#sparkline2").sparkline([2, 5, 4, 9, 6, 3, 7, 1, 5, 1], { type: 'bar', barColor: 'rgba(255,255,255,0.5)', height: '58px', width: '100%', barWidth: 3, barSpacing: 4, spotRadius: 4, chartRangeMin: 1 });
    $("#sparkline3").sparkline([1, 3, 2, 9, 1, 6, 5, 2, 6, 9], { type: 'bar', barColor: 'rgba(255,255,255,0.5)', height: '58px', width: '100%', barWidth: 3, barSpacing: 4, spotRadius: 4, chartRangeMin: 1 });
    $("#sparkline4").sparkline([5, 3, 1, 4, 3, 4, 7, 8, 2, 3], { type: 'bar', barColor: 'rgba(255,255,255,0.5)', height: '58px', width: '100%', barWidth: 3, barSpacing: 4, spotRadius: 4, chartRangeMin: 1 });
  }
  var sparkResize;

  $(window).resize(function (e) {
    clearTimeout(sparkResize);
    sparkResize = setTimeout(sparker, 500);
  });
  sparker();
  //Sparkline chart settings

  // angular chart.js
  $scope.labels = ['Mixed', 'Positive', 'Negative', 'Neutral'];

  $scope.data = [
    [335, 1030, 821, 1636],
  ];

  //dashboard page calendar trigger
  /* $('#calendar').datepicker({
    forceParse: false,
    calendarWeeks: true,
    todayHighlight: true
  }); */
  //dashboard page calendar trigger

  //dashboard page loading segment trigger
  $(".refresh").on("click", function () {
    $(".dimmer").addClass("active").delay(1500).queue(function () {
        $(".dimmer").removeClass("active").dequeue();
    });
  });
  //dashboard page loading segment trigger


};
