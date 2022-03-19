function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    //console.log(data);

    // Create a variable that holds the samples array. 
    var sampleArr = data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.
    var sampleResult = sampleArr.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that filters the metadata array for the object with the desired sample number.
    var sample_meta_id = data.metadata.filter(sampleObj => sampleObj.id == sample)

    // Create a variable that holds the first sample in the array.
    var result = sampleResult[0];
    //console.log(result)

    // Create a variable that holds the first sample in the metadata array.
    var result_meta_id = sample_meta_id[0];
    //console.log(result_meta_id);

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    otu_ids = Object.values(result.otu_ids)
    otu_labels = Object.values(result.otu_labels)
    sample_values = Object.values(result.sample_values)
    //console.log(otu_ids);

    // Create a variable that holds the washing frequency.
    var wfreq = parseInt(result_meta_id.wfreq);
    //console.log(wfreq);

    // Create the yticks for the bar chart.
    var yticks = otu_ids.slice(0,10).map(x => "OTU " + String(x)).reverse();
    //console.log(yticks);

    var xticks = sample_values.sort((a,b) => b - a).slice(0,10).reverse();
    //console.log(xticks);

    var trace1 = {
      x: xticks,
      y: yticks,
      type: "bar",
      orientation: 'h'
    }
    var barData = [trace1];
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

    // Create the trace for the bubble chart.
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Jet"
      }
    }

    var bubbleData = [trace2];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      xaxis: {title: "OTU ID"},
      height: 600,
      width: 1200
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
    // Create the trace for the gauge chart.
    var trace3 = {
      domain: { x: [0, 1], y: [0, 1] },
		  value: wfreq,
		  title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
		  type: "indicator",
		  mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        bar: {color: "black"},
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "greenyellow"},
          {range: [8,10], color: "green"}
        ]
      }
    }

    var gaugeData = [trace3];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, 
      height: 500, 
      margin: { t: 0, b: 0 }
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
