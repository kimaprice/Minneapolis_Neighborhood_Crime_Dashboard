// set the endpoint URLs
const NeighborhoodData = "/getNeighborhoods";
const CrimeData = "/getCrimeData/";
const CrimeBreakdown = "/getCrimeBreakdown/";
const DemographicData = "/getDemographicData/";
const PercentData = "/percent";
const MinneapolisGeoJson = "/readjsonfile";
const MinneapolisCrimeBreakdown = "/MinneapolisCrimeBreakdown";

// call the page initialization function
initPage();

// ------------- Initialization Function --------------------//
function initPage() {

  //Set the chart header to Minneapolis for load
  d3.select('#Neighborhood').text('Minneapolis');

  //Call chart functions on first load to contain Minneapolis (all neighborhoods) Data
  createGeoJsonMap();
  createEducationBar(100,'Minneapolis', 'Education');
  createAgeBar(100,'Minneapolis', 'Age');
  createIncomeBar(100,'Minneapolis', 'Income');
  createCrimeChart(100,'Minneapolis');
  createCrimeBreakdownMinneapolis();

}


// ------ Create Map and load Minneapolis geojson.  Attach functionality for selecting a neighborhood. ----- //

function createGeoJsonMap(){
  // Get the GeoJson from file
  let geoFile = "static/Data/Minneapolis_GeoJson_Updated.geojson"

  // Creating the map object cenetered over Minneapolis
  let myMap = L.map("map", {
    center: [44.9778, -93.2950],
    zoom: 11
  });

  // Adding the tile layer using open street map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Add the geojson layer and functionality for hover and click
  d3.json(MinneapolisGeoJson).then(function(data) {

    // Creating a GeoJSON layer with the retrieved data
    geojson = L.choropleth(data, {

      // Define which property in the features to use.
      valueProperty: 'crimeTotal',
  
      // Set the color scale.
      scale: ["#dae1ed", "#022052"],
  
      // The number of breaks in the step range
      steps: 6,
  
      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#ffffff",
        weight: 1,
        fillOpacity: 0.8
      },
      // This is called on each feature.
      onEachFeature: function(feature, layer) {
        // Set the mouse events to change the map styling.
        layer.on({
          // When a user's mouse cursor touches a map feature, the opacity change to 90% so that it stands out and the popup layer is opened to show which neighborhood it is.
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              color: "#021536",
              weight: 3,
              fillOpacity: 1
            });
            layer.openPopup();
          },
          // When the cursor no longer hovers over a map feature the feature's opacity reverts back to 50% and the popup closes
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              color: "#ffffff",
              weight: 1,
              fillOpacity: 0.8
            });
            layer.closePopup();
          },
          // When a feature (neighborhood) is clicked, it calls the function to redraw all of the charts and populate various components with the neighborhood data
          click: function(event) {
            neighSelect(event.target.feature.properties.BDNAME, feature.properties.crimeTotal);
          }
        });
        // Giving each feature a popup with the neighborhood name

        layer.bindPopup("<h6>" + feature.properties.BDNAME + "</h6>" + feature.properties.crimeTotal + " crimes</h6>");
      }
    }).addTo(myMap);

       // Set up the legend.
      let legend = L.control({ position: "bottomleft" });
      legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let limits = geojson.options.limits;
        let colors = geojson.options.colors;
        let labels = [];

        // Add the minimum and maximum.
        let legendInfo = "<h6>Number of Crimes<br/>(2019-2022)</h6>" +
          "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
          "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };

      // Adding the legend to the map
      legend.addTo(myMap);
  });
}

// -------    Neighborhood Crime Chart Functionality    ----- //

// function to create the crime chart for the selected neighborhood
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

    //Looping thorugh data to pull out the values to push to each array
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
      xaxis:{dtick:1, nticks:4},
      legend: {"orientation": "h"},
      yaxis: {automargin: true},
      margin: {
        l: 30,
        r: 20,
        b: 30,
        t: 40,
        pad: 5
      }
      
    };
    
    //Drawing chart in 'Crime' div
    Plotly.newPlot('nav-crime', data, layout);

  });
}

// function to create the stacked area charting showing the breakdown of total crime for a neighborhood into the offense categories
function createCrimeBreakdown(neighID, neighborhood){
  // add the neighbrohood id to the endpoint
  let endpoint = CrimeBreakdown + neighID;
  
  // call the endpoint and get the crime data for the selcted neighborhood
  d3.json(endpoint).then(function(data) {
    console.log(data);

    //initializing arrays to store data for stacked area chart
    let year = [];
    let offense_category = [];
    let crime_count = [];
    let current_offense = '';
    let traces = [];

    // Looping thorugh data to pull out the values to push to an array for each offense category, which then get added to the trace array for the stacked area chart
    data.forEach((n) => {
      // if the current offense is the same as the previous,  add the count to the array for that offense category and year to the year array
      if (n.offense_cat==current_offense) {
        crime_count.push(n.crime_counts);
        offense_category.push(n.offense_cat);
        year.push(n.year);
      } 
      // if the current offense is NOT the same as the previous....
      else {
        // and it is the first value of the loop,  add the count to the array for that offense category and year to the year array 
        if (crime_count.length==0) {
          current_offense = n.offense_cat;
          crime_count.push(n.crime_counts);
          offense_category.push(n.offense_cat);
          year.push(n.year);
        } 
        // and it is NOT the first value of the loop,  push a trace to the group with the age array as the x value and the crime counts array as the y value
        else {
          traces.push({x: year, y: crime_count, stackgroup: 'one', name: current_offense});
          // reset the arrays to empty to prepare for the next offense category
          crime_count = [];
          year = [];
          // push the first round of data for the next category
          current_offense = n.offense_cat;
          crime_count.push(n.crime_counts);
          offense_category.push(n.offense_cat);
          year.push(n.year);
        }
      }
    });
    // Push the last category to the trace
    traces.push({x: year, y: crime_count, stackgroup: 'one', name: current_offense});

    // set layout for the chart to contain the title, set the number if ticks
    let layout = {
      xaxis:{dtick:1, nticks:4},
      yaxis: {automargin: true},
      margin: {
        l: 30,
        r: 20,
        b: 40,
        t: 40,
        pad: 5
      }
    }

    // Plot the chart in the 'CrimeBreakdown' div
    Plotly.newPlot('nav-breakdown', traces, layout);
    
  });
}

// Function to show crime breakdown for all of Minneapolis when page first loads
function createCrimeBreakdownMinneapolis(){

  let endpoint = MinneapolisCrimeBreakdown;
  
    // call the endpoint and get the crime data for the selcted neighborhood
    d3.json(endpoint).then(function(data) {
      console.log(data);
  
      //initializing arrays to store data for stacked area chart
      let year = [];
      let offense_category = [];
      let crime_count = [];
      let current_offense = '';
      let traces = [];
  
      // Looping thorugh data to pull out the values to push to an array for each offense category, which then get added to the trace array for the stacked area chart
      data.forEach((n) => {
        // if the current offense is the same as the previous,  add the count to the array for that offense category and year to the year array
        if (n.offense_cat==current_offense) {
          crime_count.push(n.crime_counts);
          offense_category.push(n.offense_cat);
          year.push(n.year);
        } 
        // if the current offense is NOT the same as the previous....
        else {
          // and it is the first value of the loop,  add the count to the array for that offense category and year to the year array 
          if (crime_count.length==0) {
            current_offense = n.offense_cat;
            crime_count.push(n.crime_counts);
            offense_category.push(n.offense_cat);
            year.push(n.year);
          } 
          // and it is NOT the first value of the loop,  push a trace to the group with the age array as the x value and the crime counts array as the y value
          else {
            traces.push({x: year, y: crime_count, stackgroup: 'one', name: current_offense});
            // reset the arrays to empty to prepare for the next offense category
            crime_count = [];
            year = [];
            // push the first round of data for the next category
            current_offense = n.offense_cat;
            crime_count.push(n.crime_counts);
            offense_category.push(n.offense_cat);
            year.push(n.year);
          }
        }
      });
      // Push the last category to the trace
      traces.push({x: year, y: crime_count, stackgroup: 'one', name: current_offense});
  
      // set layout for the chart to contain the title, set the number if ticks
      let layout = {
        xaxis:{dtick:1, nticks:4},
        yaxis: {automargin: true},
        margin: {
          l: 30,
          r: 20,
          b: 40,
          t: 40,
          pad: 5
        }
      }
  
      // Plot the chart in the 'CrimeBreakdown' div
      Plotly.newPlot('nav-breakdown', traces, layout);
  });
}

// ------   Neighborhood Demographic Charts functionality   ----- //

// Function to create the Income chart
function createIncomeBar(neighID, neighborhood){
  // Get the data by adding the neighID to endpoint
  let endpoint = DemographicData + neighID;

  // call the endpoint and get the income demographic data for the selcted neighborhood
  d3.json(endpoint).then(function(data) {
    
    // filter the data to only contain income data
    let incomeData = data.filter(m => m.demographic == 'income');

    // initializing arrays to store data for income demographic bar chart
    let incomePercent = [];
    let incomeCategory = [];
    let incomeNeigh = [];
    let minnePercent = [];
    let minneCategory = [];
    let minneNeigh = [];

    // Loop through the dataset
    incomeData.forEach((n) => {

      // if the neighbor hood id is 100 (Minneapolis), then push to the array for the minneapolis values
      if (n.neighborhoodID==100) {
        minnePercent.push(n.percent);
        minneCategory.push(n.category);
        minneNeigh.push(n.category);

      } 
      // if the neighbor hood id is NOT 100 (Minneapolis), then push to the array for the neighborhood values
      else {
        incomePercent.push(n.percent);
        incomeCategory.push(n.category);
        incomeNeigh.push(n.category);
      }
    });

    // populate the first trace with neighborhood values
    var trace1 = {
      x: incomePercent,
      y: incomeCategory,
      type: 'bar',
      name: neighborhood,
      marker:{color:'#637899'},
      orientation: 'h'
    };

    // populate the second trace with Minneapolis values
    var trace2 = {
      x: minnePercent,
      y: minneCategory,
      type: 'bar',
      name: 'Minneapolis (all neighborhoods)',
      marker:{color:'#15305c'},
      orientation: 'h'
    };

    // create data array containing the 2 traces
    var data = [trace1, trace2]

    // set the layout to a grouped bar chart with the title, horizontal legend, and automargins to make sure the bar labels are not cut off
    var layout = {
      barmode: 'group',
      // title: 'Income Demographics',
      yaxis: {automargin: true},
      legend: {"orientation": "h"},
      margin: {
        t: 20,
        pad: 5
      }
    };

    // plot the bar graph in the 'Income' div
    Plotly.newPlot('nav-income', data, layout);
  });
}

//Function to create the Age chart
function createAgeBar(neighID, neighborhood){
  // Get the data by adding the neighID to endpoint
  let endpoint = DemographicData + neighID;

  // call the endpoint and get the age demographic data for the selcted neighborhood
  d3.json(endpoint).then(function(data) {
    
    // filter the data to only contain age data
    let ageData = data.filter(i=> i.demographic == 'age');

    //initializing arrays to store data for age demographic bar chart
    let agePercent = [];
    let ageCategory = [];
    let ageNeigh = [];
    let minnePercent = [];
    let minneCategory = [];
    let minneNeigh = [];

    // Loop through the dataset
    ageData.forEach((n) => {

      // if the neighbor hood id is 100 (Minneapolis), then push to the array for the minneapolis values
      if (n.neighborhoodID==100) {
        minnePercent.push(n.percent);
        minneCategory.push(n.category);
        minneNeigh.push(n.category);

      } 
      // if the neighbor hood id is NOT 100 (Minneapolis), then push to the array for the neighborhood values
      else {
        agePercent.push(n.percent);
        ageCategory.push(n.category);
        ageNeigh.push(n.category);
      }
    });

    // populate the first trace with neighborhood values
    var trace1 = {
      x: agePercent,
      y: ageCategory,
      type: 'bar',
      name: neighborhood,
      marker:{color:'#637899'},
      orientation: 'h'
    };

    // populate the second trace with Minneapolis values
    var trace2 = {
      x: minnePercent,
      y: minneCategory,
      type: 'bar',
      name: 'Minneapolis (all neighborhoods)',
      marker:{color:'#15305c'},
      orientation: 'h'
    };

    // create data array containing the 2 traces
    var data = [trace1, trace2]

    // set the layout to a grouped bar chart with the title, horizontal legend, and automargins to make sure the bar labels are not cut off
    var layout = {
      barmode: 'group',
      // title: 'Age Demographics',
      yaxis: {automargin: true},
      legend: {"orientation": "h"},
      margin: {
        t: 20,
        pad: 5
      }
    };

    // plot the bar graph
    Plotly.newPlot('nav-age', data, layout);
  });
}

// Funciton to create the Education chart
function createEducationBar(neighID, neighborhood){
  // Get the selected neighborhood data by adding the neighID to endpoint
  let endpoint = DemographicData + neighID;

  // call the endpoint and education the income demographic data for the selcted neighborhood
  d3.json(endpoint).then(function(data) {
    
    // filter the data to only contain education data
    let educationData = data.filter(i=> i.demographic == 'education');

    //initializing arrays to store data for education demographic bar chart
    let educationPercent = [];
    let educationCategory = [];
    let educationNeigh = [];
    let minnePercent = [];
    let minneCategory = [];
    let minneNeigh = [];

    // Loop through the dataset
    educationData.forEach((n) => {

      // if the neighbor hood id is 100 (Minneapolis), then push to the array for the minneapolis values
      if (n.neighborhoodID==100) {
        minnePercent.push(n.percent);
        minneCategory.push(n.category);
        minneNeigh.push(n.category);

      }
      // if the neighbor hood id is NOT 100 (Minneapolis), then push to the array for the neighborhood values 
      else {
        educationPercent.push(n.percent);
        educationCategory.push(n.category);
        educationNeigh.push(n.category);
      }
    });

    // populate the first trace with neighborhood values
    var trace1 = {
      x: educationPercent,
      y: educationCategory,
      type: 'bar',
      name: neighborhood,
      marker:{color:'#637899'},
      orientation: 'h'
    };

    // populate the second trace with Minneapolis values
    var trace2 = {
      x: minnePercent,
      y: minneCategory,
      type: 'bar',
      name: 'Minneapolis (all neighborhoods)',
      marker:{color:'#15305c'},
      orientation: 'h'
    };

    // create data array containing the 2 traces
    var data = [trace1, trace2]

    // set the layout to a grouped bar chart with the title, horizontal legend, and automargins to make sure the bar labels are not cut off
    var layout = {
      barmode: 'group',
      // title: 'Education Demographics',
      yaxis: {automargin: true},
      legend: {"orientation": "h"},
      margin: {
        t: 20,
        pad: 5
      }
    };

    // plot the bar graph
    Plotly.newPlot('nav-education', data, layout);
  });
}

// ------   Neighborhood Selection Functionality   ----- //

// function to run when a neighborhood is clicked on the geojson layer of the map - receives neighborhood name
function neighSelect(neighborhood, crimeTotal){
// 1. Calculate the percent of total crime in Minneapolis is in this neighborhood

  // get endpoint for percent data
  let endpoint = PercentData;

  // retrieve data from the end point for percent data
  d3.json(endpoint).then(function(data) {
      
    // initalize the arrays to store the data
    let allCrime = [];

    // loop through the data
    data.forEach((n) => {
      // push the crime count to the array that will hold all of the crime counts - total array
      allCrime.push(n.crime_counts);
    });
    // use the arraygeous library to find the sum of the total crimes array.  This is done by first using the cumsum 
    // to get the cumulative sum array and then using the max value to find the largest value which is the overall sum 
    let crimeSum = arr.max(arr.cumsum(allCrime));

    // calculate the percent by ussing arraygeous math to identify the max (total value) and min(neighborhood value) 
    // and then divide the min by the max and muliple by 100
    let percent = crimeTotal/crimeSum * 100;

// 2.  Update the dashboard with the neighborhood specific information

    // set the heading to the selected neighborhood name
    d3.select('#Neighborhood').text(neighborhood);

    // set the percent text area to the selected neighborhood percent
    d3.select('#Percent').text(percent.toFixed(2) + "% of Minneaoplis Crime 2019-2022");

    // Calls the endpoint for the neighborhood data (neighborhood name and neighborhood id)
    d3.json(NeighborhoodData).then(function(data) {

//3.  Get the neighborhood id for the neighborhood so it can be passed in other functions

      // initialize the variable to hold the id
      let neighid = '';

      // filter the data to the enter with for the selected neighborhood
      let neighborhoodData = data.filter(i=> i.neighborhood == neighborhood);

      // assign the id to the id for the slected neighborhood
      neighborhoodData.forEach((n) => {
        neighid = n.neighborhoodID;
      });

      // call the functions to redraw the charts with the selected neighborhood data
      createEducationBar(neighid, neighborhood, 'Education');
      createAgeBar(neighid, neighborhood, 'Age');
      createIncomeBar(neighid, neighborhood, 'Income');
      createCrimeChart(neighid,  neighborhood);
      createCrimeBreakdown(neighid,  neighborhood);
      
    });
  });
}

//-----  Code to fix the issues with Plotly charts not sizing correctly in bootstrap tab controls -----//

// on click event for the education chart tab calls the function to resize the graph
d3.select('#nav-education-tab').on("click", function() {
  reDraw("nav-education");
});

// on click event for the income chart tab calls the function to resize the graph
d3.select('#nav-income-tab').on("click", function() {
  reDraw("nav-income");
});

// on click event for the age chart tab calls the function to resize the graph
d3.select('#nav-age-tab').on("click", function() {
  reDraw("nav-age");
});

// on click event for the crime chart tab calls the function to resize the graph
d3.select('#nav-crime-tab').on("click", function() {
  reDraw("nav-crime");
});

// on click event for the crime breakdown chart tab calls the function to resize the graph
d3.select('#nav-breakdown-tab').on("click", function() {
  reDraw("nav-breakdown");
});

// function to resize the plotly chart sent from the tab on click event - eliminates the issue of the charts not sizing correctly in hidden tabs
function reDraw(div) {
  let update = {autosize: true}
  console.log("update plotly:" + div);
  Plotly.relayout(div, update);

}

//-----  Code to adjust chart sizes when window resizes  -----//
window.addEventListener("resize", chartUpdateWindow);

function chartUpdateWindow() {
    
  reDraw("nav-education");
  reDraw("nav-income");
  reDraw("nav-age");
  reDraw("nav-crime");
  reDraw("nav-breakdown");

}
