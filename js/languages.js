function generateChart(data, height, width, margin) {

    //Block 1   
    function chart() {
        const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);
      
        const arrowId = uid("arrow");
        const gradientIds = data.map(() => uid("gradient"));

        
      
        svg.append("defs")
          .append("marker")
            .attr("id", arrowId.id)
            .attr("markerHeight", 10)
            .attr("markerWidth", 10)
            .attr("refX", 5)
            .attr("refY", 2.5)
            .attr("orient", "auto")
          .append("path")
            .attr("fill", endColor)
            .attr("d", "M0,0v5l7,-2.5Z");
      
        svg.append("defs")
          .selectAll("linearGradient")
          .data(data)
          .join("linearGradient")
            .attr("id", (d, i) => gradientIds[i].id)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", d => x(d.begin_count_gln))
            .attr("x2", d => x(d.end_count_gln))
            .attr("y1", d => y(d.country_count_begin))
            .attr("y2", d => y(d.country_count_end))
            .call(g => g.append("stop").attr("stop-color", startColor).attr("stop-opacity", 0.5))
            .call(g => g.append("stop").attr("offset", "100%").attr("stop-color", endColor));
      
        svg.append("g")
            .call(grid);
      
        svg.append("g")
            .call(xAxis);
        

        //  Modifies the x-axis title
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("Logarithmic Growth over Year: 2020-21 → 2022 Total");
      
        svg.append("g")
            .call(yAxis);

        // Modifies the y-axis title
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".50em")
            .attr("transform", "rotate(-90)")
            .text("Logarithmic Growth in Language Amount");
      
        svg.append("g")
            .attr("fill", "none")
          .selectAll("path")
          .data(data)
          .join("path")
            .attr("stroke", (d, i) => gradientIds[i])
            .attr("marker-end", arrowId)
            .attr("d", d => arc(x(d.begin_count_gln), y(d.country_count_begin), x(d.end_count_gln), y(d.country_count_end)));
      
        svg.append("g")
            .attr("fill", "currentColor")
          .selectAll("circle")
          .data(data)
          .join("circle")
            .attr("r", 1.75)
            .attr("cx", d => x(d.begin_count_gln))
            .attr("cy", d => y(d.country_count_begin));
      
        svg.append("g")
            .attr("fill", "currentColor")
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 4)
            .attr("paint-order", "stroke fill")
          .selectAll("text")
          .data(data.filter(d => d.highlight))
          .join("text")
            .attr("dy", d => d.country_count_begin > d.country_count_end ? "1.2em" : "-0.5em")
            .attr("x", d => x(d.end_count_gln))
            .attr("y", d => y(d.country_count_end))
            .text(d => d.google_lang_narrative);
      
        return svg.node();
    }

    // //Block 2
    // data = Object.assign(d3.csvParse(await FileAttachment("metros.csv").text(), d3.autoType), {
    //    {x: "Population →", y: "↑ Inequality"}
    // })

    //Block 3
    x = d3.scaleLog()
        .domain(padLog(d3.extent(data.flatMap(d => [d.begin_count_gln, d.end_count_gln])), 0.1))
        .rangeRound([margin.left, width - margin.right]
    )

    //Block 4
    y = d3.scaleLinear()
        .domain(padLinear(d3.extent(data.flatMap(d => [d.country_count_begin, d.country_count_end])), 0.1))
        .rangeRound([height - margin.bottom, margin.top]
    )

    //Block 5
    function padLinear([x0, x1], k) {
        const dx = (x1 - x0) * k / 2;
        return [x0 - dx, x1 + dx];
    }

    //Block 6
    function padLog(x, k) {
        return padLinear(x.map(Math.log), k).map(Math.exp);
    }
    //Block 7
    endColor = d3.schemeCategory10[3]

    // Block 8
    startColor = d3.schemeCategory10[1]

    // Block 9
    function arc(x1, y1, x2, y2) {
        const r = Math.hypot(x1 - x2, y1 - y2) * 2;
        return `
          M${x1},${y1}
          A${r},${r} 0,0,1 ${x2},${y2}
        `;
    }

    // Block 10
    grid = g => g
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)
        .call(g => g.append("g")
          .selectAll("line")
          .data(x.ticks())
          .join("line")
            .attr("x1", d => 0.5 + x(d))
            .attr("x2", d => 0.5 + x(d))
            .attr("y1", margin.top)
            .attr("y2", height - margin.bottom))
        .call(g => g.append("g")
          .selectAll("line")
          .data(y.ticks())
          .join("line")
            .attr("y1", d => 0.5 + y(d))
            .attr("y2", d => 0.5 + y(d))
            .attr("x1", margin.left)
            .attr("x2", width - margin.right));

            // Block 11
            xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80, ".1s"))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", width)
            .attr("y", margin.bottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(data.x))

            // Block 12
            yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(data.y))

            // Block 13
        
            // d3 = require("d3@6")

    const svgChart = chart();
    return svgChart;

}   

document.addEventListener("DOMContentLoaded", async function() {
    // Load the data
    response = await fetch("./data/languages_data.json");

    // Parse the data
    data = await response.json();

    // Define layout dimensions
    const width = 1200;
    const height = 500
    const margin = ({top: 24, right: 10, bottom: 34, left: 40})
    
    console.log(data);
    // Create SVG chart with the dataset
    const svgChart = generateChart(data, height, width, margin);
    console.log(svgChart);

    // Add the chart to the DOM
    // const chartDiv = document.getElementById('arc-chart'); // Access the element
    const chartDiv = document.getElementById('lanaguages line chart'); // Access the element
    chartDiv.appendChild(svgChart);

});
