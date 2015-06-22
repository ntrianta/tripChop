function draw(data){
  "use strict";
  var margin = 75,
  width = 1400 - margin,
  height = 600 - margin;

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
     return '<span>'+
             'SourceIP: '  + d["SourceIP"] + '<br/>' +
             'DestIP: '    + d["DestIP"]   + '<br/>' +
             'Packets: '   + d["Packets"]  + '<br/>' +
             'Bytes: '     + d["Bytes"]    + ' KB <br/>' +
             'Avg: '       + d["Avg"]      + ' B <br/>' +
             '</span>';
      });

  var svg = d3.select("#main")
    .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
    .append('g')
        .attr('class','chart');

    d3.select("svg")
          .selectAll("circle")
          .data(data)
          .enter()
          .append("circle");

    svg.call(tip);

    var byte_extent = d3.extent(data, function(d) {
        return d['Bytes'];
    });

    var packets_extent = d3.extent(data, function(d) {
        return d['Packets'];
    });

    var byte_scale = d3.scale.linear()
        .range([height, margin])
        .domain(byte_extent);

    var packets_scale = d3.scale.linear()
        .range([margin, width])
        .domain(packets_extent);

    var byte_axis = d3.svg.axis()
        .scale(byte_scale)
        .orient("left");

    var packets_axis = d3.svg.axis()
        .scale(packets_scale)
        .orient("bottom");

    d3.selectAll("circle")
            .attr("cx", function(d) {
                return 20+(packets_scale(d["Packets"]));
            })
            .attr("cy", function(d) {
                return byte_scale(d["Bytes"]);
            })
            .attr("r", function(d) {return (d["Avg"]/40);})
            .attr("fill", "#3A539B")
            .attr("opacity", "0.4")
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)


}


d3.json("http://localhost:9000/flow/json", draw);
