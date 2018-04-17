var userCtrl = function($scope, $rootScope, $http, $sanitize, $location, Notification) {
  $scope.onEdit = false;
  $scope.input = {};
  $scope.users = { admin: [], member: [] };
  $scope.totalUsers = 0;
  $scope.limit = 10;
  $scope.limit = 20;
  $scope.offset = 0;
  $scope.find = [];
  $scope.sort = { field: 'created_at', by: 'DESC' };
  angular.element('#sorter_created_at').addClass('descending');

  $scope.scrollBusy = false;
  $scope.scrollLast = false;
  $scope.roles = [
    { id: 1, name: "Admin" },
    { id: 3, name: "Member" }
  ]

  $scope.sorter = function(field) {
    if (field == $scope.sort.field) {
      el = angular.element('#sorter_'+field);
      if ($scope.sort.by == 'ASC') {
        $scope.sort.by = 'DESC';
        el.removeClass('ascending');
        el.addClass('descending');
      } else if ($scope.sort.by == 'DESC') {
        $scope.sort.by = 'ASC';
        el.addClass('ascending');
        el.removeClass('descending');
      }
    } else {
      el = angular.element('#sorter_'+$scope.sort.field);
      el.removeClass('ascending');
      el.removeClass('descending');
      $scope.sort.field = field;
      $scope.sort.by = 'DESC';
      angular.element('#sorter_'+$scope.sort.field).addClass('descending');
    }
    $scope.offset = 0;
    $scope.users.member = [];
    $scope.scrollLast = false;
    $scope.nextPage();
  }

  $scope.search = function() {
    $scope.offset = 0;
    $scope.users.member = [];
    $scope.scrollLast = false;
    if ($scope.find.field == 'created_at') $scope.find.keyword = moment($scope.find.keyword).format('YYYY-MM-DD')
    $scope.nextPage();
  }

  $scope.resetSearch = function() {
    $scope.offset = 0;
    $scope.users.member = [];
    $scope.scrollLast = false;
    $scope.find = [];
    $scope.nextPage();
  }

  $scope.cancelAdd = function() {
    $scope.onAdd = false;
    $scope.input = [];
  }
  $scope.cancelEdit = function() {
    $scope.onEdit = false;
    $scope.edit = [];
  }

  $scope.listAdmin = function() {
    $scope.onLoad = true;
    $http.get($scope.env.api+'user/admin').then(function (response) {
      $scope.users.admin = response.data.data.admins;
      $scope.onLoad = false;
    })
  }
  $scope.listAdmin();

  $scope.nextPage = function() {
    $scope.scrollBusy = true;
    $http.get($scope.env.api+'user/member', {
      params: {
        offset: $scope.offset,
        limit: $scope.limit,
        sort_field: $scope.sort.field,
        sort_by: $scope.sort.by,
        search_field: $scope.find.field,
        search_keyword: $scope.find.keyword
      }
    }).then(function (response) {
      for (var i = 0; i < response.data.data.members.length; i++) {
          var user = response.data.data.members[i];
          user.balance = user.balance.toLocaleString();
          $scope.users.member.push(user);
      }
      if (response.data.data.members.length > 0) {
          $scope.offset += response.data.data.members.length;
      } else {
          $scope.scrollLast = true;
      }
      $scope.scrollBusy = false;
    })
  }

  $scope.editUser = function(id) {
    $location.hash('');
    $scope.onEdit = true;
    $http.get($scope.env.api+'user/'+id)
    .then(function (response) {
      $scope.edit = response.data.data.user;
      if ($scope.edit.display == 1) $scope.edit.display = true;
      else if ($scope.edit.display == 0) $scope.edit.display = false;
      $scope.edit.role = parseInt($scope.edit.role);
      $location.hash('userForm');
    });
  };

  $scope.saveUser = function(input) {
    $scope.onSave = true;
    $http.post($scope.env.api+'user', input)
    .then(function (response) {
      Notification({message: response.data.message}, "success");
      if (response.data.code == '0') {
        if (input.role == 1) $scope.users.admin.push(response.data.data.user);
        else if (input.role == 3) $scope.users.member.push(response.data.data.user);
        $scope.input = response.data.data.user;
        //$scope.input.id = response.data.user.id;
      }
      $scope.onSave = false;
      $scope.input = {};
    });
  };

  $scope.updateUser = function(input) {
    var params = {
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: input.role
    };
    $http.put($scope.env.api+'user/'+input.id, params)
    .then(function (response) {
      if (input.role == 1) var index = $scope.indexSearch($scope.users.admin, input.id);
      else if (input.role == 3) var index = $scope.indexSearch($scope.users.member, input.id);

      if (response.data.code == '0') {
        if (input.role == 1) $scope.users.admin[index] = response.data.data.user;
        else if (input.role == 3) $scope.users.member[index] = response.data.data.user;
      }
      Notification({message: response.data.message}, "success");
      $scope.onSave = false;
    });
  }

  $scope.changePassword = function(id, password) {
    params = {
      password: password
    }
    $http.put($scope.env.api+'user/'+id+'/password', params)
    .then(function (response) {
      Notification({message: response.data.message}, "success");
      $scope.onSave = false;
    });
  }

  $scope.changePin = function(id, pin) {

    if (pin.toString().length == 6) {
      params = {
        pin: pin
      }

      $http.put($scope.env.api+'user/'+id+'/pin', params)
      .then(function (response) {
        if (response.data.code == '0')  Notification({message: response.data.message}, "success");
        else {
          if (response.data.message.pin!=undefined) Notification({message: response.data.message.pin[0]}, "error");
          else Notification({message: response.data.message}, "error");
        }
        $scope.onSave = false;
      });
    } else Notification({message: "PIN must be 6 character length"}, "error");
  }

  $scope.changeBalance = function(id, balance) {
    if (confirm("change balance for User ID: #"+id+"?")) {
      params = {
        balance: balance
      }
      $http.put($scope.env.api+'user/'+id+'/balance', params)
      .then(function (response) {
        Notification({message: response.data.message}, "success");
        var index = $scope.indexSearch($scope.users.member, id);
        $scope.users.member[index].balance = response.data.data.profile.balance;
        $scope.onSave = false;
      });
    }
  }

  $scope.deleteUser = function(id, role) {
    if (role == 1) var index = $scope.indexSearch($scope.users.admin, id);
    else if (role == 3) var index = $scope.indexSearch($scope.users.member, id);

    if (confirm('delete user?')) {
      $scope.onLoad = true;
      $http.delete($scope.env.api+'user/'+id)
      .then(function (response) {
        Notification({message: response.data.message}, response.data.status);
        if (response.data.code == '0') {
          //console.log(response.users);
          if (role == 1) $scope.users.admin.splice(index, 1);
          else if (role == 3) $scope.users.member.splice(index, 1);
        }
        $scope.onLoad = false;
      })
    }
  }
};
