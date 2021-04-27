// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("data/Disaster_gas.json").then((importedData) => {
  
  var disaster_data = importedData;

  // console.log(disaster_data);
  
   // helper functions

   function getPrice(item) {
    return item.GasPrice;

  }

  function getDate(item){
    return item.Date;
  }

  function addPrices (runningTotal, GasPrice) {
    return runningTotal + GasPrice;
  }

  //extract gas prices into an array of numbers
  var gasprices = disaster_data.map(getPrice);

  var dates = disaster_data.map(getDate);

  //add up all gas price total

  var gasTotal = gasprices.reduce(addPrices, 0);

  //calculate average and display
  var avgGas = gasTotal / gasprices.length;
  
  var maxGas = gasprices.reduce(function(a,b) {
    return Math.max(a,b);
  })

  var minGas = gasprices.reduce(function(a,b) {
    return Math.min(a,b);
  })


  console.log("gasprices:", gasprices);
  console.log("dates:", dates);
  console.log("avg combined gas", avgGas);
  console.log("Max Gas Price:", maxGas);
  console.log("Min Gas Price:", minGas);

  //to filter by year

  var yearone =  disaster_data.filter(function(date) {
    return date.Date.slice(0,5) == "2000"
});

console.log(yearone);

  
  var trace1 = {
    x: dates,
    y: gasprices,
    name: "Gas Prices and Dates",
    type: "line",
    line: {
      color: '#2C3860',
      width: 3
    }
  };

  // data
  var chartData = [trace1];

  var layout = {
    title: "Gas Prices",
    xaxis: { title: "Year" },
    yaxis: { title: "Gas Prices ($)"},
    showlegend: true,
      legend: {
      x: 1,
      xanchor: 'right',
      y: 1},
      annotations: [
        {
          x: "2008-07-11",
          y: maxGas + .2,
          xref: 'xaxis',
          yref: 'yaxis',
          text: 'Highest Price',
          showarrow: true,
          arrowhead: 4,
          ax: 0,
          ay: -30
        }],
    shapes: [
      {
          type: 'line',
          xref: 'paper',
          x0: 0,
          y0: avgGas,
          x1: 1,
          y1: avgGas,
          line:{
              color: '#F49E92',
              width: 2,
              dash:'dash'
          }
      }
      ]
  };


  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("plot", chartData, layout);
});
