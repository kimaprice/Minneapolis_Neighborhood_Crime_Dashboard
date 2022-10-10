//Minneapolis Neighborhood GeoJson filepath
// set the endpoint URL
const NeighborhoodData = "/getNeighborhoods";
const CrimeData = "/getCrimeData/";
const CrimeBreakdown = "/getCrimeBreakdown/";
const DemographicData = "/getDemographicData/";

initPage();


// ------------- Initialization Function --------------------//
function initPage() {
  console.log("test1")
  d3.json(NeighborhoodData).then(function(data) {
    // console.log(data);
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
  //let dropDownText = dropDown.property("text");

 
  //Call chart functions
  createEducationBar(dropDownId, 'Education');
  createAgeBar(dropDownId, 'Age');
  createIncomeBar(dropDownId, 'Income');
  createCrimeChart(dropDownId);
  createCrimeBreakdown(dropDownId);
  
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
  let endpoint = CrimeData + neighID;;
  d3.json(endpoint).then(function(data) {
    //console.log(data);

    let year_all = [];
    let year = [];
    let crime_count_all = [];
    let crime_count = [];

    data.forEach((n) => {
      if (n.id==100) {
        year_all.push(n.year);
        crime_count_all.push(n.crime_counts);
      } else {
        year.push(n.year);
        crime_count.push(n.crime_counts);
      }
    });
    //console.log(year);
    //console.log(crime_count);

    let trace1 = {
      x: year_all,
      y: crime_count_all,
      fill: 'tonexty',
      name: 'Minneapolis (all neighborhoods)',
      marker:{color:'#637899'},
      type: 'scatter'
    };
    
    let trace2 = {
      x: year,
      y: crime_count,
      fill: 'tozeroy',
      name: 'Selected neighborhood',
      marker:{color:'#15305c'},
      type: 'scatter'
    };
    
    var data = [trace1, trace2];
    var layout = {
      title: "Crime Rate",
      xaxis:{dtick:1, nticks:4}
    };
    
    Plotly.newPlot('Crime', data, layout);

  });
}

function createCrimeBreakdown(neighID){
  let endpoint = CrimeBreakdown + neighID;
  d3.json(endpoint).then(function(data) {
    console.log(data);
    let year = [];
    let offense_category = [];
    let crime_count = [];
    let current_offense = '';
    let traces = [];

    data.forEach((n) => {
      if (n.offense_cat==current_offense) {
        crime_count.push(n.crime_counts);
        offense_category.push(n.offense_cat);
        year.push(n.year);
      } 
      else {
        if (crime_count.length==0) {
          current_offense = n.offense_cat;
          crime_count.push(n.crime_counts);
          offense_category.push(n.offense_cat);
        year.push(n.year);
        } else {
        traces.push({x: year, y: crime_count, stackgroup: 'one', name: current_offense});
        crime_count = [];
        year = [];
        current_offense = n.offense_cat;
        }
      }
    });
  
    console.log(traces);

    let plotDiv = document.getElementById('plot');
    let layout = {
      title: 'Neighborhood Crime Breakdown',
      xaxis:{dtick:1, nticks:4}
    }
    
    Plotly.newPlot('CrimeBreakdown', traces, layout);
  });
}


// ------ Neighborhood Demographic Charts functionality ----- //
//Function to create the Income chart
function createIncomeBar(neighID){
  //Get the data by adding the neighID to endpoint
  let endpoint = DemographicData + neighID;
  d3.json(endpoint).then(function(data) {
    
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