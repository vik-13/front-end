'use strict';

angular.module('researchApp').config(function($stateProvider) {
  $stateProvider
    .state('homepage', {
      url: "/",
      templateUrl: 'app/main/main.html',
      controller: 'MainCtrl'
    })
});



/*
 Make carousel consume all free space like background:cover does
 */
function carousel_prepare(){

  $('#carousel-wrapper .carousel').css({
    'margin': 0,
    'width': $(this).parent().outerWidth(),
    'height': $(this).parent().outerHeight()
  });

  //$('.carousel-inner').css({'z-index': 0});

//	$('.carousel .carousel-inner').css({
//	    'position': 'relative',
//	    'top': $(this).parent().offset().top,
//	    'width': '100%',
//	    'height': '100%'
//    });

  $('#carousel-wrapper .carousel .item').css({
//	    'top': $(this).parent().offset().top,
    'width': '100%',
    'height': '100%'
  });

  $('#carousel-wrapper .carousel-inner div.item img').each(function() {
    var imgSrc = $(this).attr('src');
    $(this).parent().css({
      'background': 'url('+imgSrc+') center center no-repeat',
      '-webkit-background-size': 'cover',
      '-moz-background-size': 'cover',
      '-o-background-size': 'cover',
      'background-size': 'cover',
    });
    $(this).remove();
  });
}

angular.module('researchApp').directive('ngCarouselWrapper', ['$timeout', function ($timeout) {
  return {
    link: function ($scope, element, attrs) {
      $timeout(function() {
        carousel_prepare();
      });
    }
  };
}]);

