//Minneapolis Neighborhood GeoJson filepath
// set the endpoint URL
const NeighborhoodData = "/getNeighborhoods";
const CrimeData = "/getCrimeData/";
const DemographicData = "/getDemographicData/";

initPage();

// ------------- Initialization Function --------------------//
function initPage() {
  console.log("test1")
  d3.json(NeighborhoodData).then(function(data) {
    console.log(data);
    let names = data;
    let dropDown = d3.select("#selDataset")

    //Populate dropdown
    names.forEach((n) => {
      let opt = dropDown.append("option")
      opt.text(n.neighborhood);
      opt.property("value", n.neighborhoodID);
    });

  //Get selected value
  let dropDownId = dropDown.property("value");
  let dropDownText = dropDown.property("text");

  console.log(dropDownText);
  //d3.select("#Neighborhood").text(dropDownText);
  console.log(dropDownId);
  //Call chart functions
  createEducationBar(dropDownId, 'Education');
  createAgeBar(dropDownId, 'Age');
  createIncomeBar(dropDownId, 'Income');
  createCrimeChart();
  console.log("3");
  });
}


// ------ Map Functionality ----- //
let geoFile = "static/Data/Minneapolis_Neighborhoods.geojson"


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



// -------Neighborhood Crime Chart Functionality ----- //


// ------ Neighborhood Demographic Charts functionality ----- //
//Function to create the Income chart
function createIncomeBar(neighID){
  //Get the data by adding the neighID to endpoint
  let endpoint = DemographicData + neighID;
  d3.json(endpoint).then(function(data) {
    console.log(data);
    let incomeData = data.filter(m => m.demographic == 'income');
    let educationData = data.filter(i=> i.demographic == 'education');
    let ageData = data.filter(i=> i.demographic == 'age');

    let incomePercent = [];
    let incomeCategory = [];
    incomeData.forEach((n) => {
      incomePercent.push(n.percent);
      incomeCategory.push(n.category);
    });

    console.log(incomeCategory);

    var trace1 = {
      x: incomePercent,
      y: incomeCategory,
      type: 'bar',
      text: incomePercent,
      orientation: 'h'
    };
    var data = [trace1];
    var layout = {
      showlegend: false,
      title: 'Income Demographics'
    };

    //plot the bar graph
    Plotly.newPlot('Income', data, layout);
  });
}

//Function to create the Age chart
function createAgeBar(neighID){
  //Get the data by adding the neighID to endpoint
  let endpoint = DemographicData + neighID;
  d3.json(endpoint).then(function(data) {
    console.log(data);
    let ageData = data.filter(i=> i.demographic == 'age');

    let agePercent = [];
    let ageCategory = [];
    ageData.forEach((n) => {
      agePercent.push(n.percent);
      ageCategory.push(n.category);
    });

    console.log(ageCategory);

    var trace1 = {
      x: agePercent,
      y: ageCategory,
      type: 'bar',
      text: agePercent,
      orientation: 'h'
    };
    var data = [trace1];
    var layout = {
      showlegend: false,
      title: 'Age Demographics'
    };

    //plot the bar graph
    Plotly.newPlot('Age', data, layout);
  });
}
//Funciton to create the Education chart
function createEducationBar(neighID){
  //Get the data by adding the neighID to endpoint
  let endpoint = DemographicData + neighID;
  d3.json(endpoint).then(function(data) {
    console.log(data);
    let educationData = data.filter(i=> i.demographic == 'education');
    let educationPercent = [];
    let educationCategory = [];
    educationData.forEach((n) => {
      educationPercent.push(n.percent);
      educationCategory.push(n.category);
    });

    console.log(educationCategory);

    var trace1 = {
      x: educationPercent,
      y: educationCategory,
      type: 'bar',
      text: educationPercent,
      orientation: 'h'
    };
    var data = [trace1];
    var layout = {
      showlegend: false,
      title: 'Education Demographics'
    };

    //plot the bar graph
    Plotly.newPlot('Education', data, layout);
  });
}


//-------------  On DropDown Change function ---------------//
function optionChanged(neighID){
  createIncomeBar(neighID);
  createAgeBar(neighID);
  createEducationBar(neighID);

}