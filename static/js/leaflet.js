// Initialize the Base map
var myMap = L.map("mapid", {
    center: [37.0902, -95.7129],
    zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createID() {
    // get the states data and store it in a variable
    states_data = data;

    //retrieve each year for dropdown and append options for each year
    var years = states_data.map(dict => dict.Year)
    years.forEach(id => d3.select('#selDataset').append('option').text(id).property("value", id))
}

function optionChanged() {

    // select the current year and store it in variable to filter data
    var currentID = d3.selectAll("#selDataset").node().value;
    console.log(currentID)

    // set state data to a variable to filter 
    states_data = data;

    // filter the state data for the year selected
    filteredData = data.filter(year => year.Year == currentID)

    // create a list variable for the gas prices of each state to add to popup
    gas_prices = []

    // Loop though the filtered data and push each price to the list variable created 
    Object.entries(filteredData[0]).forEach(([key, value]) => {
        gas_prices.push(parseFloat(value).toFixed(2))
    })

    // set a counter to index the correct gas price for your geoJson Layer
    count = 1

    //create geoJSON file path 
    var link = "static/data/states.geojson";
    updateGeoLayer(link, gas_prices)
    stateStats(currentID)

}

function initGeoLayer() {
    states_data = data;

    // filter the state data for the year selected
    filteredData = data.filter(year => year.Year == "2010")

    // create a list variable for the gas prices of each state to add to popup
    gas_prices = []

    // Loop though the filtered data and push each price to the list variable created 
    Object.entries(filteredData[0]).forEach(([key, value]) => {
        gas_prices.push(parseFloat(value).toFixed(2))
    })

    // set a counter to index the correct gas price for your geoJson Layer
    count = 1

    // Create geoJSON file path 
    var link = "static/data/states.geojson";

    // perform a get request for the geoJson
    d3.json(link).then(function(data) {
        // Creating a geoJSON layer with the retrieved data
        var layer = L.geoJson(data, {

            // Style each feature 
            style: function() {
                return {
                    color: "black",
                    fillColor: getRandomColor(),
                    fillOpacity: 0.4,
                    weight: 2.0
                };
            },

            // Called on each feature
            onEachFeature: function(feature, layer) {
                // Set mouse events to change map styling
                layer.on({
                    // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                    mouseover: function(event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 1.5
                        });
                    },
                    // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                    mouseout: function(event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.5
                        });
                    },
                });

                // Giving each feature a pop-up with information pertinent to it
                if (feature.properties.name != "Puerto Rico") {
                    layer.bindPopup("<h3>" + feature.properties.name + "</h3> <hr> <h3>" + '$' + gas_prices[count] + "</h3>");
                } else {
                    layer.bindPopup("<img class = pr src = https://carvedigital.net/wp-content/uploads/2018/11/out-of-office-carve-digital.jpg>")
                }
                // Add 1 to the counter so that the correct information is outputed. 
                count += 1
            }
        });
        layer.addTo(myMap)
    });
    stateStats("2010")
}


function updateGeoLayer(link, gas_prices) {
    // perform a get request for the geoJson
    d3.json(link).then(function(data) {

        // Creating a geoJSON layer with the retrieved data
        var geoLayer = L.geoJson(data, {

            // Style each feature 
            style: function() {
                return {
                    color: "black",
                    fillColor: 'blue',
                    fillOpacity: 0.0,
                    weight: 1.5
                };
            },

            // Called on each feature
            onEachFeature: function(feature, layer) {
                // Set mouse events to change map styling
                layer.on({
                    // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                    mouseover: function(event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.5
                        });
                    },
                    // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                    mouseout: function(event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.0
                        });
                    },
                });

                // Giving each feature a pop-up with information pertinent to it
                if (feature.properties.name != "Puerto Rico") {
                    layer.bindPopup("<h3>" + feature.properties.name + "</h3> <hr> <h3>" + '$' + gas_prices[count] + "</h3>");
                } else {
                    layer.bindPopup("<img class = pr src = https://carvedigital.net/wp-content/uploads/2018/11/out-of-office-carve-digital.jpg>")
                }
                // Add 1 to the counter so that the correct information is outputed. 
                count += 1
            }
        });
        geoLayer.addTo(myMap)
            // myMap.removeLayer(layer)

    });
}

function init() {
    createID()
    initGeoLayer()
}

function stateStats(year) {
    states_data = data;

    // filter the state data for the year selected
    filteredData = data.filter(years => years.Year == year)
        // console.log(Object.entries(filteredData[0]))

    // Extract gas prices into an array of numbers
    gas_prices = []

    // Loop though the filtered data and push each price to the list variable created 
    Object.entries(filteredData[0]).forEach(([key, value]) => {
        gas_prices.push(parseFloat(value))
    });

    // remove the first element in array as that is the year and irrelevant
    gas_prices.shift();

    avgGas = _.mean(gas_prices)

    // Find the max price
    maxGas = gas_prices.reduce(function(a, b) {
        return Math.max(a, b);
    });

    // Find the min
    minGas = gas_prices.reduce(function(a, b) {
        return Math.min(a, b);
    })
    maxState = ""
    minState = ""
        //find the max state state and value append to list
    Object.entries(filteredData[0]).forEach(([key, value]) => {
        if (value == maxGas) {
            maxState = key
        } else if (value == minGas) {
            minState = key
        }
    });

    // Select the Panel Bodys using d3
    panelBody1 = d3.select("#sample-metadata1")
    panelBody2 = d3.select("#sample-metadata2")
    panelBody3 = d3.select("#sample-metadata3")

    // Reset the panel bodys for fresh new data
    panelBody1.html("")
    panelBody2.html("")
    panelBody3.html("")

    // Append the Panel Bodys
    panelBody1.append('h4').attr('style', 'id = panel font-weight: bold').text(`$${avgGas.toFixed(2)}`)
    panelBody2.append('h4').attr('style', 'id = panel font-weight: bold').text(`${maxState} : $${maxGas.toFixed(2)}`)
    panelBody3.append('h4').attr('style', 'id = panel font-weight: bold').text(`${minState} : $${minGas.toFixed(2)}`)
}

init()