// Part 1
d3.json("/data").then(data => {
  console.log(data)
  var disaster = data.disaster_json
  console.log(disaster)
  var annual = data.annual_json
  console.log(annual)
  var month = data.month_json
  console.log(month)
  
var trace1 = {
    x: ["9/11", "Hurricane Katrina", "BP Oil Spill", "Midwest Floods",
      "Hurricane Harvey", "COVID"],
    y: [1.07, 2.29, 2.61, 2.82, 2.39, 2.31],
    type: "bar"
  };
  
  var data = [trace1];
  
  var layout = {
    title: "Gas Price vs. Event"
  };
  
  Plotly.newPlot("plot", data, layout);

})