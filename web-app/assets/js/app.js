app = angular.module('sentimanApp', ['ui.router','infinite-scroll', 'chart.js', 'ngFileUpload']);

app
.config(config)
.controller('sentimanCtrl', sentimanCtrl)
.controller('dashboardCtrl', dashboardCtrl)
.controller('updateCtrl', updateCtrl)
.controller('searchCtrl', searchCtrl)
.controller('preprocessingCtrl', preprocessingCtrl)
.controller('checkCtrl', checkCtrl)
