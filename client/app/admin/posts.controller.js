'use strict';

angular.module('researchApp')
  .controller('PostsCtrl', function ($scope, $http, $stateParams, $q) {
    $scope.userId = $stateParams.userId;
    $scope.userName = $stateParams.userName;
    $scope.posts = [];
    _init();

    function _init() {
        $q.all([_getForums(), _getMessages(), _getResearches()])
            .then(function(){
                $scope.posts.sort(function(a, b) {
                    return new Date(b.created).getTime() - new Date(a.created).getTime();
                });

            });
    }

    function _getForums() {
        var defer = $q.defer();
        $http.get(API_URL + 'users/' + $scope.userId + '/forums').success(function(res){
            res.forums.forEach(function(forum) {
                forum.type = 'FORUM';
                forum.title = forum.subject;
                $scope.posts.push(forum);
            });
            defer.resolve();
          }).error(function(){
            defer.reject();
          });
        return defer.promise;
    }

     function _getMessages() {
        var defer = $q.defer();
        $http.get(API_URL + 'users/' + $scope.userId + '/messages').success(function(res){

            res.messages.forEach(function(message) {
                message.created = message.created[0];
                message.title = message.message;
                message.id = message.id[0];
                message.type = 'MESSAGE';
              $scope.posts.push(message);
            });
            defer.resolve();
          }).error(function(){
            defer.reject();
          });
        return defer.promise;
    }

     function _getResearches() {
        var defer = $q.defer();
        $http.get(API_URL + 'users/' + $scope.userId + '/researches').success(function(res){

            res.researches.forEach(function(research) {
                if (research.relationship_type === 'SUPERVISOR') {
                    research.type = 'RESEARCH';
                    $scope.posts.push(research);

                }
            });
            defer.resolve();
          }).error(function(){
            defer.reject();
          });
        return defer.promise;
    }
  });
