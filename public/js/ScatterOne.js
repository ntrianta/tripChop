function draw(data) {
    "use strict";
    var margin = 75,
        width = 1400-margin,
        height = 600-margin;

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .direction('e')
        .offset([0, 5])
        .html(function (d) {
        return '<span>' +
            'SourceIP: ' + d["SourceIP"] + '<br/>' +
            'DestIP: ' + d["DestIP"] + '<br/>' +
            'Packets: ' + d["Packets"] + '<br/>' +
            'Bytes: ' + d["Bytes"] + ' KB <br/>' +
            'Avg: ' + d["Avg"] + ' B <br/>' +
            '</span>';
    });

    var head = d3.select("body")
        .append("h1")
        .attr("width", "100%")
        .attr("height", "10%")
        .style("text-align", "center")
        .html("IP Flows 09:00-21:00");

    var svg = d3.select("body")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "75%")
        .append('g')
        .attr('class', 'chart');

    d3.select("svg")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle");

    svg.call(tip);

    var byte_extent = d3.extent(data, function (d) {
        return d.Bytes;
    });
    var packets_extent = d3.extent(data, function (d) {
        return d.Packets;
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

    var cir = d3.selectAll("circle")
        .attr("cx", function (d) {
        return packets_scale(d.Packets);
    })
        .attr("cy", function (d) {
        return 10+byte_scale(d.Bytes);
    })
        .attr("r", function (d) {
        return (d["Avg"]/32);
    })
        .attr("fill", "#1F3A93")
        .attr("opacity", "0.54")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on('click', function(){
          window.location = "http://localhost:9000/flow/details"
        });


}

d3.json("http://localhost:9000/flow/json?startDay=12&endDay=12&startHour=9&endHour=21", draw);
