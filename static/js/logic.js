//Minneapolis Neighborhood GeoJson filepath
// set the endpoint URL
const NeighborhoodData = "/getNeighborhoods";
const CrimeData = "/getCrimeData/";
const CrimeBreakdown = "/getCrimeBreakdown/";
const DemographicData = "/getDemographicData/";
const PercentData = "/percent";

initPage();


// ------------- Initialization Function --------------------//
function initPage() {

  //Set the chart header to Minneapolis for load
  d3.select('#Neighborhood').text('Minneapolis');

  //Call chart functions on first load to contain Minneapolis (all neighborhoods) Data
  createEducationBar(100,'Minneapolis', 'Education');
  createAgeBar(100,'Minneapolis', 'Age');
  createIncomeBar(100,'Minneapolis', 'Income');
  createCrimeChart(100,'Minneapolis');
  //createCrimeBreakdown(100),'Minneapolis';

}


// ------ Create Map and load Minneapolis geojson.  Attach functionality for selecting a neighborhood. ----- //
// Get the GeoJson from file
let geoFile = "static/Data/Minneapolis_Neighborhoods.geojson"

// Creating the map object cenetered over Minneapolis
let myMap = L.map("map", {
  center: [44.9778, -93.2650],
  zoom: 11
});

// Adding the tile layer using open street map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Add the geojson layer and functionality for hover and click
d3.json(geoFile).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor() function to decide which color to color our neighborhood. (The color is based on the borough.)
        fillColor: '#15305c',
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    // This is called on each feature.
    onEachFeature: function(feature, layer) {
      // Set the mouse events to change the map styling.
      layer.on({
        // When a user's mouse cursor touches a map feature, the opacity change to 90% so that it stands out and the popup layer is opened to show which neighborhood it is.
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
          layer.openPopup();
        },
        // When the cursor no longer hovers over a map feature the feature's opacity reverts back to 50% and the popup closes
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
          layer.closePopup();
        },
        // When a feature (neighborhood) is clicked, it calls the function to redraw all of the charts and populate various components with the neighborhood data
        click: function(event) {
          neighSelect(event.target.feature.properties.BDNAME);
        }
        
      });
      // Giving each feature a popup with the neighborhood name
      layer.bindPopup("<h5>" + feature.properties.BDNAME);
    }
  }).addTo(myMap);
});

// -------Neighborhood Crime Chart Functionality ----- //
function createCrimeChart(neighID, neighborhood){
  //add the neighbrohood id to the endpoint
  let endpoint = CrimeData + neighID;
  //call the endpoint and get the crime data for the selcted neighborhood
  d3.json(endpoint).then(function(data) {

    //initializing arrays to store data for area chart
    let year_all = [];
    let year = [];
    let crime_count_all = [];
    let crime_count = [];

    //Looping thorugh data to pull out the values for each array
    data.forEach((n) => {
      if (n.id==100) {
        year_all.push(n.year);
        crime_count_all.push(n.crime_counts);
      } else {
        year.push(n.year);
        crime_count.push(n.crime_counts);
      }
    });

    //Setting up trace for Minneaplis (all neighborhoods)
    let trace1 = {
      x: year_all,
      y: crime_count_all,
      fill: 'tonexty',
      name: 'Minneapolis (all neighborhoods)',
      marker:{color:'#637899'},
      type: 'scatter'
    };
    
    //Setting up trace for selected neighborhood
    let trace2 = {
      x: year,
      y: crime_count,
      fill: 'tozeroy',
      name: neighborhood,
      marker:{color:'#15305c'},
      type: 'scatter'
    };
    
    //Create array containing both traces to send to newPlot function
    var data = [trace1, trace2];

    //Setup layout to include title and define how many ticks to show
    var layout = {
      title: neighborhood + " Crime Rate",
      xaxis:{dtick:1, nticks:4},
      legend: {"orientation": "h", 
      //x: 0.1, y: 1.2
    }
    };
    
    //Drawing chart in 'Crime' div
    Plotly.newPlot('Crime', data, layout);

  });
}

function createCrimeBreakdown(neighID, neighborhood){
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
      title: neighborhood + " Crime Breakdown",
      xaxis:{dtick:1, nticks:4}
    }
    
    Plotly.newPlot('CrimeBreakdown', traces, layout);
  });
}


// ------ Neighborhood Demographic Charts functionality ----- //
//Function to create the Income chart
function createIncomeBar(neighID, neighborhood){
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
      name: neighborhood,
      marker:{color:'#637899'},
      orientation: 'h'
    };

    var trace2 = {
      x: minnePercent,
      y: minneCategory,
      type: 'bar',
      name: 'Minneapolis (all neighborhoods)',
      marker:{color:'#15305c'},
      orientation: 'h'
    };

    var data = [trace1, trace2]
    var layout = {
      barmode: 'group',
      title: 'Income Demographics',
      yaxis: {automargin: true},
      legend: {"orientation": "h"}
    };
    //plot the bar graph
    Plotly.newPlot('Income', data, layout);
  });
}

//Function to create the Age chart
function createAgeBar(neighID, neighborhood){
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
      name: neighborhood,
      marker:{color:'#637899'},
      orientation: 'h'
    };

    var trace2 = {
      x: minnePercent,
      y: minneCategory,
      type: 'bar',
      name: 'Minneapolis (all neighborhoods)',
      marker:{color:'#15305c'},
      orientation: 'h'
    };

    var data = [trace1, trace2]
    var layout = {
      barmode: 'group',
      title: 'Age Demographics',
      yaxis: {automargin: true},
      legend: {"orientation": "h"}
    };
    //plot the bar graph
    Plotly.newPlot('Age', data, layout);
  });
}
//Funciton to create the Education chart
function createEducationBar(neighID, neighborhood){
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
      name: neighborhood,
      marker:{color:'#637899'},
      orientation: 'h'
    };

    var trace2 = {
      x: minnePercent,
      y: minneCategory,
      type: 'bar',
      name: 'Minneapolis (all neighborhoods)',
      marker:{color:'#15305c'},
      orientation: 'h'
    };

    var data = [trace1, trace2]
    var layout = {
      barmode: 'group',
      title: 'Education Demographics',
      yaxis: {automargin: true},
      legend: {"orientation": "h"}
    };

    //plot the bar graph
    Plotly.newPlot('Education', data, layout);
  });
}

function neighSelect(neighborhood){
  d3.json(NeighborhoodData).then(function(data) {
    //console.log(data);
    let neighid = '';
    let neighborhoodData = data.filter(i=> i.neighborhood == neighborhood);
    neighborhoodData.forEach((n) => {
        neighid = n.neighborhoodID;
    });

    // get percent of Minneapolis crime for selected neighborhood
    let endpoint = PercentData;
    d3.json(endpoint).then(function(data) {
      //console.log(data);
      let allCrime = [];
      let Crime = [];
      //Get array of crime counts and array containing specific neighborhood crime count
     data.forEach((n) => {
          allCrime.push(n.crime_counts);
          if (n.neighborhood == neighborhood){
            Crime.push(n.crime_counts);
          }
      });
  
      let crimeSum = arr.max(arr.cumsum(allCrime));
      Crime.push(crimeSum);
   
      let percent = arr.min(Crime)/arr.max(Crime)*100;

    //Call chart functions
    d3.select('#Neighborhood').text("Neighborhood: " + neighborhood);
    d3.select('#Percent').text(percent.toFixed(2) + "% of Minneaoplis Crime 1/2018 to 8/2022");
    createEducationBar(neighid, neighborhood, 'Education');
    createAgeBar(neighid, neighborhood, 'Age');
    createIncomeBar(neighid, neighborhood, 'Income');
    createCrimeChart(neighid,  neighborhood);
    createCrimeBreakdown(neighid,  neighborhood);
  });
  });
}

$(document).ready(function(){
  activaTab('aaa');
});

function activaTab(tab){
  $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};

// $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
   
//   var target = $(e.target).attr("href") // activated tab
//  if(target=="#tab2")
//  {
//         //call the corresponding function which generates that plot
//  }
// });