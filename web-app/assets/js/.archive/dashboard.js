var dashboardCtrl = function($http, $scope, $rootScope, $timeout) {
  $scope.onLoad = false;
  $scope.init = function() {
    $('.menu .item').tab();
  }
  $timeout($scope.init(), 1000);

  $scope.arrayDate = function(month, year) {
    var ar = [];
    var start = moment().subtract(1, 'months');
    for(var end = moment(); start.isBefore(end); start.add(1,'day')){
        ar.push(start.format('D/M'));
    }
    return ar;
  }

  $scope.transactionChart = function(data) {
    var date = $scope.arrayDate();
    var total = [];

    for (i=0;i<date.length;i++) total[i] = 0;
    for (i=0;i<data.length; i++) {
      index = date.indexOf(data[i].day + '/' + data[i].month);
      total[index] = data[i].total;
    }

    $scope.transaction = {
      labels: date,
      data: [total]
    }
  }

  $scope.depositChart = function(data) {
    var date = $scope.arrayDate();
    var total = [];

    for (i=0;i<date.length;i++) total[i] = 0;
    for (i=0;i<data.length; i++) {
      index = date.indexOf(data[i].day + '/' + data[i].month);
      total[index] = data[i].total;
    }

    $scope.deposit = {
      labels: date,
      data: [total]
    }
  }

  $scope.profitChart = function(data) {
    var date = $scope.arrayDate();
    var total = [];

    for (i=0;i<date.length;i++) total[i] = 0;
    for (i=0;i<data.length; i++) {
      index = date.indexOf(data[i].day + '/' + data[i].month);
      total[index] = data[i].total;
    }

    $scope.profit = {
      labels: date,
      data: [total]
    }
  }

  $scope.memberChart = function(data) {
    var date = $scope.arrayDate();
    var total = [];

    for (i=0;i<date.length;i++) total[i] = 0;
    for (i=0;i<data.length; i++) {
      index = date.indexOf(data[i].day + '/' + data[i].month);
      total[index] = data[i].total;
    }

    $scope.member = {
      labels: date,
      data: [total]
    }
  }

  $scope.productChart = function(data) {
    labels = data.map(a => a.product_code);
    total = data.map(a => a.total);

    $scope.product = {
      labels: labels,
      data: total
    }
  }

  $scope.topDepositChart = function(data) {
    labels = data.map(a => a.user_id);
    total = data.map(a => a.total);

    $scope.top_deposit = {
      labels: labels,
      data: total
    }
  }

  $scope.dashboard = function() {
    $scope.onLoad = true;
    $http.get($scope.env.api+'dashboard').then(function (response) {
      if (response.data.code == "0") {
        var stats = response.data.data;
        $scope.stats = {
          credit: parseInt(stats.total.credit).toLocaleString(),
          debit: parseInt(stats.total.debit).toLocaleString(),
          member: stats.total.member,
          profit: (parseInt(stats.total.debit) - parseInt(stats.total.cost)).toLocaleString(),
          user_balance: parseInt(stats.total.user_balance).toLocaleString()
        };

        /* $scope.lineChart(stats.member.growth, "Registered Member", "#memberChart");
        $scope.pieChart(stats.product, "#productChart") */
        $scope.memberChart(stats.linegraph.member);
        $scope.depositChart(stats.linegraph.deposit);
        $scope.transactionChart(stats.linegraph.transaction);
        $scope.profitChart(stats.linegraph.profit);
        $scope.productChart(stats.top.product);
        $scope.topDepositChart(stats.top.deposit);

        // generate map data
        total_location = stats.map.user.length;
        total_lat = 0;
        total_long = 0;
        for (i=0; i<total_location; i++) {
          var location = stats.map.user[i].location = stats.map.user[i].location.split(',');
          stats.map.user[i].location[0] = parseFloat(location[0]);
          stats.map.user[i].location[1] = parseFloat(location[1]);
          total_lat += stats.map.user[i].location[0];
          total_long += stats.map.user[i].location[1]
        }
        $scope.avg_lat = total_lat / total_location;
        $scope.avg_long = total_long / total_location;
        $scope.marker = stats.map.user;
        // end generate map data

        $scope.onLoad = false;
      }
    })
  }

  $scope.getBalance = function(server) {
    $scope.onLoad = true;
    $http.get($scope.env.api+'dashboard/balance/'+server).then(function (response) {
      if (response.data.code == "0") {
        if (server == 'dompul') $scope.balance = { dompul: response.data.data.balance.dompul.toLocaleString() };
        else if (server == 'sibay') $scope.balance = { sibay: response.data.data.balance.sibay.toLocaleString() };
      }
      $scope.onLoad = false;
    });
  }

  if ($scope.env.site == '//backend.veripay.id/') $scope.dashboard();
  //$scope.dashboard();

};
