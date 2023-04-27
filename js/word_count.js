function WordCloud(rolledData, {
  size = group => group.length, // Given a grouping of words, returns the size factor for that word
  word = d => d, // Given an item of the data array, returns the word
  marginTop = 0, // top margin, in pixels
  marginRight = 0, // right margin, in pixels
  marginBottom = 0, // bottom margin, in pixels
  marginLeft = 0, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  maxWords = 250, // maximum number of words to extract from the text
  fontFamily = "sans-serif", // font family
  fontScale = 15, // base font size
  padding = 0, // amount of padding between the words (in pixels)
  rotate = 0, // a constant or function to rotate the words
  invalidation // when this promise resolves, stop the simulation
} = {}) {
//  const words = typeof text === "string" ? text.split(/\W+/g) : Array.from(text);
//  console.log(words);
//  const data = d3.rollups(words, size, w => w)
//    .sort(([, a], [, b]) => d3.descending(a, b))
//    .slice(0, maxWords)
//    .map(([key, size]) => ({text: word(key), size}));
//  const rolledData = d3.rollups(words, size, w => w)
//  console.log(rolledData);
  const sortedData = rolledData.sort(([, a], [, b]) => d3.descending(a, b))
//  console.log(sortedData);
    console.log(sortedData.length);
  const slicedData = sortedData.slice(0, maxWords)
//  console.log(slicedData)
  const data = slicedData.map(([key, size]) => ({text: word(key), size}));
//  console.log(data);
//  console.log(data);
//  console.log("TEST")

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("font-family", fontFamily)
      .attr("text-anchor", "middle")
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const g = svg.append("g").attr("transform", `translate(${marginLeft},${marginTop})`);

  const cloud = d3.layout.cloud()
      .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
      .words(data)
      .padding(padding)
      .rotate(rotate)
      .font(fontFamily)
      .fontSize(d => Math.sqrt(d.size) * fontScale)
      .on("word", ({size, x, y, rotate, text}) => {
        g.append("text")
            .attr("font-size", size)
            .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
            .text(text);
      });

  cloud.start();
  invalidation && invalidation.then(() => cloud.stop());
//  console.log("GENERATED");
  return svg.node();
}

document.addEventListener("DOMContentLoaded", async function() {
    // Load the data
    response = await fetch("data/normalized_word_list.json");

    // Parse the data
    data = await response.json();

    const wordData = [["text", 3000], ["new text", 2], ["another text", 1]]

    // Create the chart
    chart = WordCloud(data, {
      width: 1200,
      height: 800,
      maxWords: 1000,
      invalidation: false // a promise to stop the simulation when the cell is re-run
    });

    // chart is an SVG element

    // Add the chart to the DOM
    const chartDiv = document.getElementById('word-chart'); // Access the element
    chartDiv.appendChild(chart);

    const time = window.performance.now();
//    console.log("Chart completed", time)
});