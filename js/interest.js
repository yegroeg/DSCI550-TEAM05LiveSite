// Use this function to turn number into string with thousand separater
function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

// const start_time = window.performance.now();

// document.addEventListener("DOMContentLoaded", async function() {
//     // Load the data
//     response = await fetch("./data/adl_word_count.json");

//     // Parse the data
//     hateData = await response.json();

//     // Create the chart,
//     chart = BarChart(hateData, {
//        x: d => d.count,
//        y: d => d.word,
//        yDomain: d3.groupSort(hateData, ([d]) => -d.count, d => d.word), // sort by descending frequency
//        xFormat: "#",
//        xLabel: "Count →",
//        width: 1000,
//        color: "stealblue"
// })


// set the dimensions and margins of the graph
var width = 450
var height = 460

// append the svg object to the body of the page
var svg = d3.select("#circle_packing_chart")
  .append("svg")
    .attr("width", width)
    .attr("height", height)

// Read data
d3.json("./data/interest_count.json", function(data) {

  // Filter a bit the data -> more than 500 times being mentioned

  // test 1
  // I was able to filter a certain range of count value baased on the following code
  // data = data.filter(function(d){ return d.count>300 && d.value<1000 }) 

  // test  2
  // I can only filter by the year now
  // data = data.filter(function(d){ return d.count>300 && d.year == 2022 })

  // test 3
  // Now it's time to test the aggregate value
  data = data.filter(function(d){return d.count>300})
  console.log(typeof(data))
  console.log(data)
  // console.log(d3.group)
  // data = d3.group(data, d => d.interest)
// Color palette for Main Category on interest --> I use 5 for my example sets
/*
  sports
  entertainment
  health
  politics
  education
*/
// console.log(data)
// rollup_data = d3.rollup(data, v => d3.sum(v, d=>d.count), d => d.interest)
// console.log(rollup_data)


// var nest = d3.nest()
// .key(function(d){
//   return d.interest;
// })
// .sortKeys(d3.ascending)
// .rollup(function(leaves){
//    return d3.sum(leaves, function(d) {return (d.count)});
// })
// .entries(data)
// console.log(nest)


// arraydata = Array.from(rollup_data)
// console.log(arraydata)

  var color = d3.scaleOrdinal()
    .domain(["sports", "entertainment", "health", "society", "education","food","environment","other"])
    .range(d3.schemeSet1);

  // Size scale for interest counts
  var size = d3.scaleLinear()
    .domain([0, 25000])
    .range([7,55])  // circle will be between 7 and 55 px wide

  // create a tooltip
  var Tooltip = d3.select("#circle_packing_chart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip
      .html('<u>' + d.interest + '</u>' + "<br>" +"being mentioned "+ numberWithCommas(d.count) + " times in Pixstory interest.")
      .style("left", (d3.mouse(this)[0]+20) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
  }

  // Initialize the circle: all located at the center of the svg area
  var node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "node")
      .attr("r", function(d){ return size(d.count)})
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", function(d){ return color(d.maininterest)})
      .style("fill-opacity", 0.8)
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", mouseover) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .call(d3.drag() // call specific function when circle is dragged
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));

  // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.count)+3) }).iterations(1)) // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation
      .nodes(data)
      .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
      });

  // What happens when a circle is dragged?
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }

})