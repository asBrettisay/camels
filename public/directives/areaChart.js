angular.module('app')
.directive(function() {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    link: function(elem, attr, scope) {
      var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
      };

      var height = 500 - margin.top - margin.bottom;
      var width = 960 - margin.left - margin.right;

      var parseDate = d3.timeFormat("%d-%b-%y").parse;

      var x = d3.scaleLinear()
          .range([0, width])
          .domain([
            0,
            scope.data.reduce(function(d, next) {
              if (next.date > d) return next.date;
            }, 0))
          ])

      var y = d3.scaleLinear()
          .range([height, 0])
          .domain([
            scope.data.reduce(function(d, next) {
              if (next.price > d) return next.price
            }, 0),
            0
          ])

      var xAxis = d3.axisBottom()
          .scale(x)

      var yAxis = d3.axisLeft()
          .scale(y)

      var area = d3.area()
          .x(function(d) { return x(d.date); })
          .y0(height)
          .y1(function(d) { return y(d.price); })

      var svg = d3.select(elem).append('svg')
          .attr('height', height + margin.top + margin.bottom)
          .attr('width', width + margin.left + margin.right)
        .append('g')
          .attr('transform', 'translate('+ margin.left+','+margin.right+')')

      svg.append('path')
          .datum(scope.data)
          .attr('class', 'area')
          .attr('d', area);

      svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,'+height+')')
          .call(xAxis)

      svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
    }
  }
})
