// Part 1
d3.json("/data").then(data => {
  console.log(data);
  var disaster = data.disaster_json
  console.log(disaster)
  var annual = data.annual_json;
  console.log(annual);
  var month = data.month_json
  console.log(month);

 
});



  