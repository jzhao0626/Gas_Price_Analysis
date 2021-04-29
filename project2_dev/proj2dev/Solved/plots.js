// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("data/Disaster_gas.json").then((importedData) => {
  
  var disaster_data = importedData;

  console.log(disaster_data);
  
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

  var year2000 =  disaster_data.filter(function(date) {
    return date.Date.split("-")[0] === "2000";
});

var year2001 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2001";
});

var year2002 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2002";
});

var year2003 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2003";
});

var year2004 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2004";
});

var year2005 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2005";
});

var year2006 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2006";
});

var year2007 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2007";
});

var year2008 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2008";
});

// var minGas = disaster.filter(function(date){
//   return date.GasPrice ==="min";
// })

var year2009 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2009";
});

var year2010 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2010";
});

var year2011 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2011";
});

var year2012 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2012";
});

var year2013 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2013";
});

var year2014 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2014";
});

var year2015 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2015";
});

var year2016 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2016";
});

var year2017 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2017";
});

var year2018 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2018";
});

var year2019 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2019";
});

var year2020 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2020";
});

var year2021 =  disaster_data.filter(function(date) {
  return date.Date.split("-")[0] === "2021";
});



console.log("Year 2008:", year2008);


  
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



  //bar chart for events

  //dates to pull out
  
  //Aug 31 2005 --> Hurricane Katrina 2005-09-12

  //July 7 2008 --> Recession 2008-07-14

  //May 9 2011 --> Arab Spring 2011-05-09

  //Aug 2012 --> Hurricane Isaac 2012-08-27

  //2014-April 2015 --> shale fracking increases US production "2015-10-05"

  //Aug 2017 --> Hurricane Harvey "2017-08-28"

  //May 2018 --> US Pulls out of Iran Nuclear Agreement  2018-06-11

  //April 2020 --> COVID-19 Pandemic "2020-03-30"
  
  var important_dates = ["Hurricane Katrina", "Great Recession", "Arab Spring", "Hurricane Isaac", "Increased Fracking", "Hurricane Harvey", "US/Iran Nuclear", "Global Pandemic"];

  var important_prices = [2.955, 4.113, 3.965, 3.776, 2.318, 2.399, 2.911, 2.005]

  var direct_labels = ["2005", "2008", "2011", "2012", "2015", "2017", "2018", "2020"]




  var trace2 = {
    x: important_dates,
    y: important_prices,
    type: "bar",
    text: direct_labels.map(String),
    textposition: 'auto',
    hoverinfo: 'none',
    opacity: 0.5,
     marker: {
    color: 'rgb(158,202,225)',
    line: {
      color: 'rgb(8,48,107)',
      width: 1.5}
    }

  };

    var chart = [trace2];

    var layout2 = {
      title: "Gas Prices by Event",
      xaxis: { title: "" , tickangle: 0},
      yaxis: { title: "Gas Prices ($)"}

  };

  Plotly.newPlot("bar-plot", chart, layout2);
});
