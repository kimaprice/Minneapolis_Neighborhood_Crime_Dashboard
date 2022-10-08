//Minneapolis Neighborhood GeoJson filepath
//const file_endpoint = "readjsonfile/Minneapolis_Neighborhoods.geojson"; 

//let url = file_endpoint; 

let geoFile = "static/Data/Minneapolis_Neighborhoods.geojson"
console.log("test1");
// Creating the map object
let myMap = L.map("map", {
  center: [44.9778, -93.2650],
  zoom: 11
});


// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Getting our GeoJSON data
d3.json(geoFile).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data).addTo(myMap);
});

// Query the endpoint that returns a JSON ...
d3.json("/getNeighborhoodData").then(function (data) {
  // ... and dump that JSON to the console for inspection
  console.log(data);
  console.log ("test2");
});