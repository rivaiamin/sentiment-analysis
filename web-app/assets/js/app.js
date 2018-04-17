app = angular.module('sentimanApp', ['ui.router','infinite-scroll', 'chart.js']);

app
.config(config)
.controller('sentimanCtrl', sentimanCtrl)
.controller('dashboardCtrl', dashboardCtrl)
.controller('sentimentCtrl', sentimentCtrl)
.controller('preprocessingCtrl', preprocessingCtrl)
.controller('checkCtrl', checkCtrl)
