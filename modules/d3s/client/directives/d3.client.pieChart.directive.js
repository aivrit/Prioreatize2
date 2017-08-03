angular.module('restaurants')
  .directive('d3Donut', ['D3sService', function(D3sService) {
    return {
      restrict: 'EA',
      scope: {
        data: '='
      },
      link: function (scope, element, attrs) {
        D3sService.d3().then(function (d3) {
          var margin = parseInt(attrs.margin) || 20;
          var svg = d3.select(element[0])
            .append("svg")
            .append("g");

          // Browser onresize event
          window.onresize = function() {
            scope.$apply();
          };

          // Watch for resize event
          scope.$watch(function() {
            return angular.element(window)[0].innerWidth;
          }, function() {
            scope.render(scope.data);
          });

          // watch for data changes and re-render
          scope.$watch('data', function(newVals, oldVals) {
            return scope.render(newVals);
          }, true);

          scope.render = function(data) {
            // remove all previous items before render
            svg.selectAll('*').remove();

            // If we don't pass any data, return out of the element
            if (!data) return;

            svg.append("g")
              .attr("class", "slices");
            svg.append("g")
              .attr("class", "labels");
            svg.append("g")
              .attr("class", "lines");

            var width = 940,
              height = 300,
              radius = Math.min(width, height) / 2;

            var pie = d3.layout.pie()
              .sort(null)
              .value(function(d) {
                return d.value;
              });

            var arc = d3.svg.arc()
              .outerRadius(radius * 0.8)
              .innerRadius(radius * 0.4);

            var outerArc = d3.svg.arc()
              .innerRadius(radius * 0.9)
              .outerRadius(radius * 0.9);

            svg.attr("transform", "translate(" + (width / 2 + 100) + "," + (height / 2 - 10) + ")");

            var key = function(d) { return d.data.label; };

            var color = d3.scale.category20();

            /* ------- PIE SLICES -------*/
            var slice = svg.select(".slices").selectAll("path.slice")
              .data(pie(data), key);

            slice.enter()
              .insert("path")
              .style("fill", function(d) { return color(d.data.label); })
              .attr("class", "slice");

            slice
              .transition().duration(1000)
              .attrTween("d", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                  return arc(interpolate(t));
                };
              })

            slice.exit()
              .remove();

            /* ------- TEXT LABELS -------*/

            var text = svg.select(".labels").selectAll("text")
              .data(pie(data), key);

            text.enter()
              .append("text")
              .attr("dy", ".35em")
              .text(function(d) {
                return d.data.label;
              });

            function midAngle(d) {
              return d.startAngle + (d.endAngle - d.startAngle) / 2;
            }

            text.transition().duration(1000)
              .attrTween("transform", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                  var d2 = interpolate(t);
                  var pos = outerArc.centroid(d2);
                  pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                  return "translate(" + pos + ")";
                };
              })
              .styleTween("text-anchor", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                  var d2 = interpolate(t);
                  return midAngle(d2) < Math.PI ? "start":"end";
                };
              });

            text.exit()
              .remove();

          //   /* ------- SLICE TO TEXT POLYLINES -------*/

            var polyline = svg.select(".lines").selectAll("polyline")
              .data(pie(data), key);

            polyline.enter()
              .append("polyline");

            polyline.transition().duration(1000)
              .attrTween("points", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                  var d2 = interpolate(t);
                  var pos = outerArc.centroid(d2);
                  pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                  return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };
              });

            polyline.exit()
              .remove();
          };
        });
      }
    };
  }]);
