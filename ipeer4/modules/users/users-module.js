// Isolate this module's creation by putting it in an anonymous function

(function () {
    'use strict';
    
var module = angular.module('ubc.ctlt.ipeer4.users', ['ngResource', 'ubc.ctlt.ipeer4.toaster']); 
    
/** Providers **/
module.factory('UsersResource', ['$resource', function($resource) {
    var User = $resource('http://localhost:8000/api/users/:id', {id: '@id'});
    return User;
}]);

/** Controllers **/
module.controller('UsersViewAdminController', function($scope, $location, UsersResource, Toaster)
    {
        $scope.users = {};
        
        UsersResource.get().$promise.then(
            function (ret) {
                $scope.users = ret.users;            
            },
            function (ret) {
                Toaster.error('Could not retrieve list of users.');
                $location.path('/');
            }
        );
});
    
module.controller('UsersViewController', function($scope, $location, $routeParams, UsersResource, Toaster)
    {
        var userId = $routeParams['id'];
        $scope.user = {};
        $scope.userProfile = { show: false };
        
        UsersResource.get({"id":userId}).$promise.then(
            function (ret) {
                $scope.userProfile.show =!$scope.userProfile.show;
                $scope.user = ret;
            },
            function (ret) {
                Toaster.error('No user found for that ID.');
                $location.path('/');
            }
        );
});

module.controller('UsersEditController', function($scope, $location, $routeParams, UsersResource, Toaster)
    {
        var userId = $routeParams['id'];
        $scope.user = {};
        $scope.userProfile = { show: false };
        
        UsersResource.get({"id":userId}).$promise.then(
            function (ret) {
                $scope.userProfile.show =!$scope.userProfile.show;
                $scope.user = ret; 
            },
            function (ret) {
                Toaster.error('No user found for that ID.');
                $location.path('/');
            }
        );
    
        $scope.updateUser = function () {
            UsersResource.save({"id":userId}, $scope.user).$promise.then(
                function(ret) {
                    Toaster.success("User profile updated.");
                    $location.path('/users/' + userId);
                },
                function(ret) {
                    Toaster.error('Could not update user.');
                }
            );
        };
    
        $scope.deleteUser = function () {
            UsersResource.delete({"id":userId}, $scope.user).$promise.then(
                function(ret) {
                    Toaster.success("User deleted.");
                    $location.path('/');
                },
                function(ret) {
                    Toaster.error('Could not delete user.');
                }
            );
        };
    
        $scope.cancel = function () {
            $location.path('/');
        };
});
    
module.controller('UsersCreateController', function($scope, $location, UsersResource, Toaster)
    {
        $scope.user = {};
        $scope.newId;
    
        $scope.createUser = function () {
            UsersResource.save($scope.user).$promise.then(
                function(ret) {
                    $scope.newId = ret.$promise.$$state.value.id;
                    Toaster.success("User successfully created (" + $scope.newId + ")");
                    $location.path('/users/' + $scope.newId);
                },
                function(ret) {
                    Toaster.error("Could not create user.");
                }
            );
        };
    
        $scope.cancel = function () {
            $location.path('/');
        };
});
}());