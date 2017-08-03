// Reviews service used to communicate Reviews REST endpoints
(function () {
  'use strict';

  angular
    .module('reviews')
    .service('ReviewsService', ReviewsService);

  ReviewsService.$inject = ['$resource'];

  function ReviewsService($resource) {
    var urlBase = '/api/reviews/';

    this.getReviews = function() {
      return $resource(urlBase + ':reviewId', {
        reviewId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    };

    this.getReviewsGroupByStars = function () {
      return $resource(urlBase + 'groupByStars', {
        update: {
          method: 'PUT'
        }
      });
    };


  }
}());
