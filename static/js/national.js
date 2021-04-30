d3.json("/data").then(data => {
    var disaster = data.disaster_json

    var dropdownMenu = d3.select("#selDataset1");

    var yearList = [];
    disaster.forEach(item => {
        if (!(yearList.includes(item.Date.substring(0, 4)))) {
            yearList.push(item.Date.substring(0, 4))
            var optionTag = dropdownMenu.append("option");
            optionTag.text(item.Date.substring(0, 4));
            optionTag.attr("id", `Disaster_{item.Date}`);
        }
    })

    dropdownMenu.append("option")
        .text("All")
        .attr("id", "All_Date")

    init()

})



d3.selectAll("#selDataset1").on("change", getData);


// Set the initial plot to show
function init() {
    var dropdownMenu = d3.select("#selDataset1");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");

    getData(dataset)
}



function getData(dataset) {
    var dropdownMenu = d3.select("#selDataset1");
    var dataset = dropdownMenu.property("value");

    d3.json("/data").then(data => {

        var disaster = data.disaster_json
        var annual = data.annual_json
        var month = data.month_json

        if (dataset == "All") {
            var selectedDisasterData = disaster;
        } else {
            var selectedDisasterData = disaster.filter(data => { return data.Date.substring(0, 4) == dataset });
        }


        var disasterInfo = d3.select("tbody")

        disasterInfo.html("")

        selectedDisasterData.forEach((data) => {
            var row = disasterInfo.append("tr");
            Object.entries(data).forEach(([key, value]) => {
                var cell = row.append("td");
                cell.text(value);
            })
        })

        function addPrices(runningTotal, GasPrice) {
            return runningTotal + GasPrice;
        }

        // Extract gas prices into an array of numbers
        var price = selectedDisasterData.map(item => item.GasPrice);
        var date = selectedDisasterData.map(item => item.Date);


        // Add up all gas price total
        var gasTotal = price.reduce(addPrices, 0);

        // Calculate average and display
        var avgGas = gasTotal / price.length;

        // Find the max and min price and the dates of them
        var maxGas = price.reduce(function(a, b) {
            return Math.max(a, b);
        })
        var maxDate = selectedDisasterData.filter(data => { return data.GasPrice == maxGas })[0].Date


        var minGas = price.reduce(function(a, b) {
            return Math.min(a, b);
        })
        var minDate = selectedDisasterData.filter(data => { return data.GasPrice == minGas })[0].Date



        // Plot the line graph
        var trace1 = {
            x: date,
            y: price,
            name: "Gas Prices",
            type: "line",
            line: {
                color: '#2C3860',
                width: 3
            }
        };

        var layout1 = {
            title: "Gas Prices of the Year",
            xaxis: { title: "Date" },
            yaxis: { title: "Gas Prices ($)" },
            titlefont: {
                "size": 24
            },
            showlegend: true,
            legend: {
                x: 1,
                xanchor: 'right',
                yanchor: 'bottom',
                y: 1
            },
            annotations: [{
                    x: maxDate,
                    y: maxGas + .05,
                    xref: 'xaxis',
                    yref: 'yaxis',
                    text: 'Highest Price',
                    showarrow: true,
                    arrowhead: 4,
                    ax: 0,
                    ay: -20
                },
                {
                    x: minDate,
                    y: minGas - .05,
                    xref: 'xaxis',
                    yref: 'yaxis',
                    text: 'Lowest Price',
                    showarrow: true,
                    arrowhead: 4,
                    ax: 0,
                    ay: 20
                }
            ],
            shapes: [{
                type: 'line',
                xref: 'paper',
                x0: 0,
                y0: avgGas,
                x1: 1,
                y1: avgGas,
                line: {
                    color: '#F49E92',
                    width: 2,
                    dash: 'dash'
                }
            }]
        };

        data1 = [trace1]
        Plotly.newPlot("LinePlot_PriceDate", data1, layout1);

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
                    width: 1.5
                }
            }
        };

        var layout2 = {
            title: "Gas Prices by Event",
            titlefont: {
                "size": 24
            },
            xaxis: { title: "", tickangle: 0 },
            yaxis: { title: "Gas Prices ($)" }
        };

        var data2 = [trace2];
        Plotly.newPlot("BarPlot_PriceDisaster", data2, layout2);
    });
};