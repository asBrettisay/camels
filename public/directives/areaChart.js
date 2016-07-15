angular.module('app')
.directive('areaChart', function() {

  var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
  };

  var height = 500 - margin.top - margin.bottom;
  var width = 960 - margin.left - margin.right;

  var Tip = function(div, x, y) {
    function show(d) {
      div.html(
        '<strong>Price:</strong>' + d.price + '<br>' +
        '<strong>Date:</strong>'+ d.date
      )
      .style('background', 'rgba(0, 0, 0, 0.3)')
      .style('opacity', '1')
      .style('left', x(d.date)+ margin.left + 'px')
      .style('top', y(d.price)+ margin.top - 50 + 'px' )

      console.log(d);
      console.log(x(d.date));
    }

    function hide() {
      div.style('background', 'rgba(0, 0, 0, 0)')
          .style('opacity', '0');
    }

    return {
      show: show,
      hide: hide
    }
  }

  return {
    restrict: 'E',
    template: '<svg height='+500+' width='+960+'></div>',
    scope: {
      data: '='
    },
    controller: function($scope) {
    },
    link: function(scope, elem, attr) {

      scope.data = scope.data.map(function(d) {
        d.date = new Date(d.date).getTime();
        return d;
      })

      var parseDate = d3.timeFormat("%d-%b-%y").parse;

      var x = d3.scaleLinear()
          .range([0, width])
          .domain(d3.extent(scope.data, function(d) { return d.date }))

      var y = d3.scaleLinear()
          .range([height, 0])
          .domain([0, d3.max(scope.data, function(d) { return d.price; })])

      var xAxis = d3.axisBottom()
          .scale(
            d3.scaleTime().range([0, width]).domain(
            d3.extent(scope.data, function(d) { return new Date(d.date)})
            )
          )

      var yAxis = d3.axisLeft()
          .scale(y)

      var line = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.price)})



      var svg = d3.select(elem.find('svg')[0])
        .append('g')
          .attr('transform', 'translate('+ margin.left+','+margin.right+')')

      var tip = Tip(
        d3.select(elem.find('svg')[0].parentElement).append('div')
          .attr('class', 'd3-tooltip'),
          x,y
        )

      svg.append('path')
          .datum(scope.data)
          .attr('class', 'line')
          .attr('d', line);

      svg.selectAll('circle')
          .data(scope.data)
          .enter().append('circle')
          .attr('class', 'circle')
          .attr('cx', function(d) { return x(d.date)})
          .attr('cy', function(d) { return y(d.price)})
          .attr('r', 3)
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)


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
