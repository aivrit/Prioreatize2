(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('restaurants')
    .directive('ratingStars', ratingStars);

  function ratingStars() {
    var directive = {
      restrict: 'E',
      scope: {
        stars: '@'
      },
      link: drawStars
    };

    return directive;

    function drawStars(scope, element) {
      var stars = scope.stars;
      var fullStars = Math.floor(stars);
      var halfStar = stars % 1 !== 0 ? 1 : 0;
      var emptyStars = 5 - (fullStars + halfStar);

      // Draw full stars
      for (var i = 0; i < fullStars; i++) {
        element.append("<span class='glyphicon glyphicon-star'></span>");
      }
      // draw half star if needed
      if (halfStar === 1) {
        element.append("<span class='glyphicon glyphicon-star half'></span>");
      }
      // Draw empty stars
      for (var j = 0; j < emptyStars; j++) {
        element.append("<span class='glyphicon glyphicon-star-empty'></span>");
      }
    }
  }
}());
