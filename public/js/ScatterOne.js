function draw(data){
  "use strict";
  var margin = 75,
  width = 1400 - margin,
  height = 600 - margin;

  var svg = d3.select("body")
    .append("svg")
      .attr("width", width + margin)
      .attr("height", height + margin)
    .append('g')
        .attr('class','chart');

    d3.select("svg")
          .selectAll("circle")
          .data(data)
          .enter()
          .append("circle");

    var byte_extent = d3.extent(data, function(d) {
        return d['Bytes'];
    });

    var packets_extent = d3.extent(data, function(d) {
        return d['Packets'];
    })

    var byte_scale = d3.scale.log()
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


    d3.select("svg")
          .append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + margin + ",0)")
          .call(byte_axis);

    d3.select("svg")
          .append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")").call(packets_axis);

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

            $('svg circle').tipsy({
                gravity: "w",
                html: true,
                title: function() {
                  var d = this.__data__
                  return '<span>'+
                         'SourceIP: '  + d["SourceIP"] + '<br/>' +
                         'DestIP: '    + d["DestIP"]   + '<br/>' +
                         'Packets: '   + d["Packets"]  + '<br/>' +
                         'Bytes: '     + d["Bytes"]    + '<br/>' +
                         'Avg: '       + d["Avg"]      + '<br/>' +
                         '</span>';
                  }
              });

};




d3.json("http://localhost:9000/flow/json", draw);
