//Minneapolis Neighborhood GeoJson filepath
// set the endpoint URL
const NeighborhoodData = "/getNeighborhoods";
const CrimeData = "/getCrimeData";
const CrimeBreakdown = "/getCrimeBreakdown/";
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
  //d3.select('#Neighborhood option:checked').text();
  //d3.select("#Neighborhood").text(dropDownText);
  console.log(dropDownId);
  //Call chart functions
  createEducationBar(dropDownId, 'Education');
  createAgeBar(dropDownId, 'Age');
  createIncomeBar(dropDownId, 'Income');
  createCrimeChart(dropDownId);
  createCrimeBreakdown(dropDownId);
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


function createCrimeChart(neighID){
  let endpoint = CrimeData;
  d3.json(endpoint).then(function(data) {
    console.log(data);


    let trace1 = {
      x: [1, 2, 3, 4],
      y: [0, 2, 3, 5],
      fill: 'tozeroy',
      name: 'All Crime',
      marker:{color:'#637899'},
      type: 'scatter'
    };
    
    let trace2 = {
      x: [1, 2, 3, 4],
      y: [3, 5, 1, 7],
      fill: 'tonexty',
      name: 'Minneapolis (all neighborhoods)',
      marker:{color:'#15305c'},
      type: 'scatter'
    };
    
    var data = [trace1, trace2];
    var layout = {
      title: "Crime Rate"
    };
    
    Plotly.newPlot('Crime', data, layout);
  });
}

function createCrimeBreakdown(neighID){
  let endpoint = CrimeBreakdown;

    let plotDiv = document.getElementById('plot');
    let traces = [
      {x: [1,2,3], y: [2,1,4], stackgroup: 'one', marker:{color:'#3f7551'}},
      {x: [1,2,3], y: [1,1,2], stackgroup: 'one', marker:{color:'#15305c'}},
      {x: [1,2,3], y: [3,0,2], stackgroup: 'one', marker:{color:'#637899'}}
    ];

    let layout = {
      title: 'Neighborhood Crime Breakdown'
    }
    
    Plotly.newPlot('CrimeBreakdown', traces, layout);
}


// ------ Neighborhood Demographic Charts functionality ----- //
//Function to create the Income chart
function createIncomeBar(neighID){
  //Get the data by adding the neighID to endpoint
  let endpoint = DemographicData + neighID;
  d3.json(endpoint).then(function(data) {
    console.log(data);
    let incomeData = data.filter(m => m.demographic == 'income');
    let incomePercent = [];
    let incomeCategory = [];
    let incomeNeigh = [];
    let minnePercent = [];
    let minneCategory = [];
    let minneNeigh = [];

    incomeData.forEach((n) => {
      if (n.neighborhoodID==100) {
        minnePercent.push(n.percent);
        minneCategory.push(n.category);
        minneNeigh.push(n.category);

      } else {
        incomePercent.push(n.percent);
        incomeCategory.push(n.category);
        incomeNeigh.push(n.category);
      }
    });

    var trace1 = {
      x: incomePercent,
      y: incomeCategory,
      type: 'bar',
      text: incomePercent,
      name: 'neighborhood',
      marker:{color:'#637899'},
      orientation: 'h'
    };

    var trace2 = {
      x: minnePercent,
      y: minneCategory,
      type: 'bar',
      text: minnePercent,
      name: 'Minneapolis (all neighborhoods)',
      marker:{color:'#15305c'},
      orientation: 'h'
    };

    var data = [trace1, trace2]
    var layout = {
      barmode: 'group'
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
    let ageNeigh = [];
    let minnePercent = [];
    let minneCategory = [];
    let minneNeigh = [];

    ageData.forEach((n) => {
      if (n.neighborhoodID==100) {
        minnePercent.push(n.percent);
        minneCategory.push(n.category);
        minneNeigh.push(n.category);

      } else {
        agePercent.push(n.percent);
        ageCategory.push(n.category);
        ageNeigh.push(n.category);
      }
    });

    var trace1 = {
      x: agePercent,
      y: ageCategory,
      type: 'bar',
      text: agePercent,
      name: 'neighborhood',
      marker:{color:'#637899'},
      orientation: 'h'
    };

    var trace2 = {
      x: minnePercent,
      y: minneCategory,
      type: 'bar',
      text: minnePercent,
      name: 'Minneapolis (all neighborhoods)',
      marker:{color:'#15305c'},
      orientation: 'h'
    };

    var data = [trace1, trace2]
    var layout = {
      barmode: 'group'
    };
    //plot the bar graph
    Plotly.newPlot('Age', data, layout);
  });
}
//Funciton to create the Education chart
function createEducationBar(neighID){
  //Get the selected neighborhood data by adding the neighID to endpoint
  let endpoint = DemographicData + neighID;
  d3.json(endpoint).then(function(data) {
    console.log(data);
    let educationData = data.filter(i=> i.demographic == 'education');

    let educationPercent = [];
    let educationCategory = [];
    let educationNeigh = [];
    let minnePercent = [];
    let minneCategory = [];
    let minneNeigh = [];

    educationData.forEach((n) => {
      if (n.neighborhoodID==100) {
        minnePercent.push(n.percent);
        minneCategory.push(n.category);
        minneNeigh.push(n.category);

      } else {
        educationPercent.push(n.percent);
        educationCategory.push(n.category);
        educationNeigh.push(n.category);
      }
    });

    var trace1 = {
      x: educationPercent,
      y: educationCategory,
      type: 'bar',
      text: educationPercent,
      name: 'neighborhood',
      marker:{color:'#637899'},
      orientation: 'h'
    };

    var trace2 = {
      x: minnePercent,
      y: minneCategory,
      type: 'bar',
      text: minnePercent,
      name: 'Minneapolis (all neighborhoods)',
      marker:{color:'#15305c'},
      orientation: 'h'
    };

    var data = [trace1, trace2]
    var layout = {
      barmode: 'group'
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
  createCrimeChart(neighID);
  createCrimeBreakdown(neighID);
}