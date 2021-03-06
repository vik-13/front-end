'use strict';

angular.module('researchApp')
  .controller('AddUpdateProjectCtrl', function ($scope, $http, Upload, $state, $stateParams,Auth) {
    $scope.projectId = $stateParams.id;
    $scope.newProject = true;
    $scope.project = {
      description: {}
    };

    $scope.statuses = [
      {
        id: 'active',
        name: 'Active'
      },
      {
        id: 'closed',
        name: 'Closed'
      },
      {
        id: 'onhold',
        name: 'On Hold'
      }
    ];
    $scope.titleError = '';
    $scope.shortDescError = '';
    $scope.longDescError = '';
    $scope.tagsError = '';
    $scope.errorMsg = '';
    _init();

    function _init() {
      if($scope.projectId === 'null') {
        return;
      } else {
        $scope.newProject = false;
        $http.get(API_URL + 'researches/' + $stateParams.id).success(function(proj) {
          $scope.project = proj;
        });
      }
    }

    $scope.addProject = function() {
      if(!_projectIsValid()) {
        return;
      }
      $http.post(API_URL + 'researches',
        {
          title: $scope.project.title,
          tags: _.map($scope.project.tags, function(t){return t.text}),
          image_url: $scope.project.image_url,
          area: 'test area',
          description: {
            brief: $scope.project.description.brief,
            detailed: $scope.project.description.detailed
          }
        }).success(function(research){
          /*
              create default forum for research
          */
          $http.post(API_URL + 'researches/' + research.research_id+ '/forums', {
            subject: 'Default forum'
          }).success(function(forum){
            $state.go('project.about', {id: research.research_id});
          });
        }).error(function(error) {
          $scope.errorMsg = 'Project was not created';
        });
      $scope.project = {};
    };

    $scope.updateProject = function() {
      if(!_projectIsValid()) {
        return;
      }
      $http.put(API_URL + 'researches/' + $stateParams.id,
        {
          title: $scope.project.title,
          image_url: $scope.project.image_url,
          status: $scope.project.status,
          description: {
            brief: $scope.project.description.brief,
            detailed: $scope.project.description.detailed
          }
        }).success(function(research){
          $state.go('project.about', {id: $scope.projectId});
        }).error(function(error) {
          $scope.errorMsg = 'Error: Project was not updated';
        });
    };

    $scope.removeResearcher = function(researcher) {
      $http.delete(API_URL + 'researches/' + $scope.projectId + '/researchers/' + researcher.id)
        .success(function(data) {
            for (var i = 0; i < $scope.project.researchers.length; i++) {
              if ($scope.project.researchers[i].id == researcher.id) {
                $scope.project.researchers.splice(i, 1);
              }
            };
        }).error(function(err) {
          $scope.errorMsg = 'Error: Researcher was not deleted';
        });
      };

    $scope.onFileSelect = function(event) {
      var image = event.target.files[0];
      
      if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
          alert('Only PNG and JPEG are accepted.');
          return;
      }

      $scope.upload = Upload.upload({
          url: API_URL + 'upload',
          method: 'POST',
          file: image
      }).success(function(data, status, headers, config) {
          $scope.project.image_url = data.url;
      }).error(function(err) {
        $scope.errorMsg = 'Error: File was not uploaded';
      });
    };

    function _projectIsValid() {
      if (!$scope.project.title || $scope.project.title === '') {
        $scope.titleError = 'Title is required.';
      } else {
        $scope.titleError = '';
      }
      if (!$scope.project.description.brief || $scope.project.description.brief === '') {
        $scope.shortDescError = 'Short Description is required.'
      } else {
        $scope.shortDescError = '';
      }
      if (!$scope.project.description.detailed || $scope.project.description.detailed  === '') {
        $scope.longDescError = 'Detailed Description is required.'
      } else {
        $scope.longDescError = '';
      }
      if (! $scope.project.tags || $scope.project.tags.length === 0) {
        $scope.tagsError = 'Required.';
      } else {
        $scope.tagsError = ''
      }
      if (!$scope.project.title || $scope.project.title === '' || 
        !$scope.project.description.brief || $scope.project.description.brief === '' ||
        !$scope.project.description.detailed || $scope.project.description.detailed === '' || 
        !$scope.project.tags || $scope.project.tags.length === 0) {
        return false;
      } else {
        return true;
      }
    }
  });
