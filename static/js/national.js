d3.json("/data").then(data => {
    // console.log(data)
    var disaster = data.disaster_json
    console.log(disaster)
})

function populateData(gasData) {
    var dropdownSelector = d3.select("#selDataset");
    d3.json("/data").then(data => {
        var yearlyData = data.disaster_json
        yearlyData = yearlyData.filter(dateRow => dateRow.Date.substring(0,4) == gasData)
        console.log(yearlyData)
        Object.values(yearlyData).forEach(([key,value]) => {
            dropdownSelector.append("h6").text( `${value}`);

        });
    })
    console.log(gasData)
}


// Function for select option 
function optionChanged(UID) {
    buildCharts(UID);
    populateDemoInfo(UID);
} 