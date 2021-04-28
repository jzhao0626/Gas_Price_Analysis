// function populateData(year) {
//     var databox = d3.select("#education");
//     databox.html("")
//     d3.json("/data").then(data => {
//         var yearlyData = data.disaster_json
//         yearlyData = yearlyData.filter(dateRow => dateRow.Date == year)[0]
//         console.log(yearlyData)
//         Object.entries(yearlyData).forEach(([key, value]) => {
//             databox.append("h6").text(`${key}:${value}`);
//         });
//     })
//     console.log(year)
// }

d3.json("/data").then(data => {
    var disaster = data.disaster_json

    var dropdownMenu = d3.select("#selDataset1");

    var yearList = [];
    disaster.forEach(item => {
        if (!(yearList.includes(item.Date.substring(0, 4)))) {
            yearList.push(item.Date.substring(0, 4))
            console.log(item.Date)
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
    console.log(dataset)

    d3.json("/data").then(data => {

        var disaster = data.disaster_json
        console.log(disaster)
        var annual = data.annual_json
        console.log(annual)
        var month = data.month_json
        console.log(month)

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

        console.log("Gas Prices:", price);
        console.log("Dates:", date);
        console.log("Average Gas Price", avgGas);
        console.log("Max Gas Price:", maxGas, "On Date", maxDate);
        console.log("Min Gas Price:", minGas, "On Date", minDate);

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

        var layout = {
            title: "Gas Prices of the Year",
            xaxis: { title: "Date" },
            yaxis: { title: "Gas Prices ($)" },
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
                    ay: -50
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
                    ay: 30
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
        Plotly.newPlot("plot1", data1, layout);

        // console.log(selectedDisasterData)
        // Object.entries(selectedDisasterData[0]).forEach(function([key, value]) {
        //     disasterInfo.append("p").text(`${key}: ${value}`);
        // });

        // // Top 10 OTUs 
        // var selectedSample = disaster.filter(data => { return data.id == dataset })

        // var sortedOTU = selectedSample.sort((a, b) => a.sample_values - b.sample_values);
        // OTUID = sortedOTU[0].otu_ids
        // namedOTUID = sortedOTU[0].otu_ids.map(item => `OTU ${item}`);
        // OTUValue = sortedOTU[0].sample_values
        // OTULabel = sortedOTU[0].otu_labels;
        // console.log(OTUID)
        // console.log(namedOTUID)
        // console.log(OTUValue)
        // console.log(OTULabel)


        // // Plot
        // var trace1 = {
        //     y: namedOTUID.slice(0, 10).reverse(),
        //     x: OTUValue.slice(0, 10).reverse(),
        //     text: OTULabel.slice(0, 10).reverse(),
        //     type: "bar",
        //     orientation: "h"
        // };

        // var trace2 = {
        //     x: OTUID,
        //     y: OTUValue,
        //     mode: 'markers',
        //     text: OTULabel,
        //     marker: {
        //         size: OTUValue,
        //         color: OTUID
        //     }
        // };

        // var trace3 = {
        //     value: selectedMetaData[0].wfreq,
        //     title: { text: "Belly Button Washing Frequency" },
        //     type: "indicator",
        //     mode: "gauge+number",
        //     gauge: {
        //         axis: {
        //             range: [null, 9]
        //         },
        //         steps: [
        //             { range: [0, 1], color: "rgb(248, 243, 236)" },
        //             { range: [1, 2], color: "rgb(240, 234, 220)" },
        //             { range: [2, 3], color: "rgb(230, 225, 205)" },
        //             { range: [3, 4], color: "rgb(218, 217, 190)" },
        //             { range: [4, 5], color: "rgb(204, 209, 176)" },
        //             { range: [5, 6], color: "rgb(189, 202, 164)" },
        //             { range: [6, 7], color: "rgb(172, 195, 153)" },
        //             { range: [7, 8], color: "rgb(153, 188, 144)" },
        //             { range: [8, 9], color: "rgb(132, 181, 137)" }
        //         ]
        //     }
        // }

        // var layout2 = {
        //     xaxis: { title: "OTU ID" }
        // }

        // data1 = [trace1]
        // Plotly.newPlot("bar", data1);

        // data2 = [trace2]
        // Plotly.newPlot("bubble", data2, layout2);

        // data3 = [trace3]
        // Plotly.newPlot("gauge", data3);

    })
};