sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.controller.View1", {
      onInit: function () {
        // Create and set the model for the view
        var oModel = new JSONModel({
          metrics: [
            { key: "Select the Option", text: "Select the Option" },
            { key: "Balnc_Prodn_value", text: "Balnc Prodn Value" },
            { key: "Colln", text: "Collection" },
            { key: "Paymt", text: "Payment" },
          ],
        });

        this.getView().setModel(oModel);
      },

      onFileChange: function (oEvent) {
        // Handle file change event
        var oFileUploader = this.byId("fileUploader");
        var sFileName = oFileUploader.getValue();
        this.byId("fileNameText").setText(sFileName);
      },

      _isValidFile: function (oFile) {
        var validExtensions = ["csv"];
        var fileExtension = oFile.name.split(".").pop().toLowerCase();
        return validExtensions.includes(fileExtension);
      },

      onSubmit: function () {
        var oFileUploader = this.byId("fileUploader");
        var oFile = oFileUploader.oFileUpload.files[0];

        if (oFile) {
          this._processFile(oFile);
        } else {
          MessageToast.show("Please upload a file first.");
        }
      },

      _processFile: function (file) {
        var that = this;
        var reader = new FileReader();
        reader.onload = function (e) {
          var csvData = e.target.result;
          console.log("File content:", csvData);

          // Convert CSV to JSON
          var jsonData = that._csvToJson(csvData);
          console.log("Converted JSON data:", jsonData);

          // Store the JSON data
          that._jsonData = jsonData;

          // Display the data in the table
          that._displayDataInTable(jsonData);
        };

        reader.onerror = function (error) {
          console.error("Error reading file:", error);
        };

        reader.readAsText(file);
      },

      _csvToJson: function (csv) {
        var lines = csv.split("\n");
        var result = [];
        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {
          var obj = {};
          var currentLine = lines[i].split(",");

          // Skip empty lines
          if (currentLine.length === 1 && currentLine[0].trim() === "") {
            continue;
          }

          for (var j = 0; j < headers.length; j++) {
            var header = headers[j].trim();
            var value = currentLine[j] ? currentLine[j].trim() : "";

            // Skip if header or value is empty
            if (header && value) {
              obj[header] = value;
            }
          }
          result.push(obj);
        }
        return result;
      },

      onFetchData: function () {
        var that = this;
        var apiUrl = "http://localhost:3003/finaldata.json"; // Replace with your API endpoint

        jQuery.ajax({
          url: apiUrl,
          method: "GET",
          dataType: "json",
          success: function (data) {
            console.log("Fetched data from API:", data);

            // Merge fetched data with uploaded data based on date
            var mergedData = that._mergeDataByDate(that._jsonData, data);
            console.log("Merged data:", mergedData);

            that._jsonData = mergedData;
            that._displayDataInTable(mergedData);

            // Initially hide the select box and chart container
            that.byId("metricSelect").setVisible(false);
            that.byId("combinedChartVBox").setVisible(false);
          },
          error: function (error) {
            console.error("Error fetching data from API:", error);
            MessageToast.show("Error fetching data from API.");
          },
        });
      },

      _mergeDataByDate: function (existingData, fetchedData) {
        var dateMap = new Map();

        // Create a map from existing data for quick lookup
        existingData.forEach(function (item) {
          dateMap.set(item.Date, item);
        });

        // Merge fetched data into existing data based on date
        fetchedData.forEach(function (item) {
          var existingItem = dateMap.get(item.Date);
          if (existingItem) {
            // Merge the values (you may need to adjust based on your actual data structure)
            Object.keys(item).forEach(function (key) {
              if (key !== "Date") {
                existingItem[key] = item[key];
              }
            });
          } else {
            // Add new entry if date does not exist
            dateMap.set(item.Date, item);
          }
        });

        // Convert map back to array
        return Array.from(dateMap.values());
      },

      _displayDataInTable: function (data) {
        var oTable = this.byId("dataTable");

        // Clear existing table content
        oTable.destroyColumns();
        oTable.destroyItems();

        if (data.length > 0) {
          // Create columns dynamically based on JSON keys
          var columns = Object.keys(data[0]);
          columns.forEach(function (col) {
            oTable.addColumn(
              new sap.m.Column({
                header: new sap.m.Label({
                  text: col,
                  wrapping: true, // Enable text wrapping
                  tooltip: col, // Show full text on hover
                }),
                width: "auto", // Set width to auto-adjust to content
                minScreenWidth: "Small", // Ensure visibility on smaller screens
              })
            );
          });

          // Create rows dynamically
          data.forEach(function (item) {
            var cells = columns.map(function (col) {
              return new sap.m.Text({ text: item[col] });
            });

            oTable.addItem(
              new sap.m.ColumnListItem({
                cells: cells,
              })
            );
          });

          // Make table visible
          oTable.setVisible(true);
        } else {
          MessageToast.show("No data to display.");
        }
      },

      onShowSelectBox: function () {
        // Show the select box and chart container
        this.byId("metricSelect").setVisible(true);
        this.byId("combinedChartVBox").setVisible(true);
      },

      onSeeChart: function () {
        if (!this._jsonData) {
          MessageToast.show("Please upload a file first.");
          return;
        }

        var barLabel = "Net Price (Bar)";
        var line1Label = "Sales Plan Value (Line)"; // Default line chart
        var line2Label = this._selectedMetric
          ? this._selectedMetric + " (Line)"
          : null;

        // Create or update the chart
        if (!this._chart) {
          // Display the initial chart
          this._displayCombinedChart(
            this._jsonData,
            barLabel,
            line1Label,
            null
          );
        } else if (line2Label) {
          // Add a new line chart to the existing chart
          this._addAdditionalLineChart(this._jsonData, line2Label);
        }

        // Show the select box after the chart is rendered
        this.byId("metricSelect").setVisible(true);
      },

      onSelectChange: function (oEvent) {
        // Get all selected items
        var selectedItems = oEvent.getSource().getSelectedItems();
        var selectedKeys = selectedItems.map(function (item) {
          return item.getKey();
        });

        // Update the selected metrics
        this._selectedMetrics = selectedKeys;

        if (this._jsonData) {
          // Display combined chart with all selected metrics
          this._displayCombinedChart(this._jsonData, this._selectedMetrics);
        }
      },

      _displayCombinedChart: function (data, selectedMetrics) {
        var labels = data.map(function (item) {
          return item.Date;
        });

        var barValue = data.map(function (item) {
          return item.Net_Price;
        });

        // Initialize selectedMetrics if it's not an array
        if (!Array.isArray(selectedMetrics)) {
          selectedMetrics = [];
        }

        // Default datasets: static bar chart and initial line chart
        var datasets = [
          {
            type: "bar",
            label: "Net Price",
            data: barValue,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            type: "line",
            label: "Sales_Plan_value (Line)",
            data: data.map(function (item) {
              return item.Sales_Plan_value || 0; // Handle missing data
            }),
            borderColor: "rgba(54, 162, 235, 1)",
            fill: false,
          },
        ];

        // Add line charts based on selected metrics
        selectedMetrics.forEach(function (metric) {
          datasets.push({
            type: "line",
            label: metric + " (Line)",
            data: data.map(function (item) {
              return item[metric] || 0; // Handle missing data
            }),
            borderColor: "rgba(255, 159, 64, 1)",
            fill: false,
          });
        });

        // Create or update the combined chart container
        var oVBox = this.byId("combinedChartVBox");
        if (oVBox.getItems().length === 0) {
          var combinedChartContainer = new sap.ui.core.HTML({
            content:
              "<canvas id='combinedChart' style='width: 100%; height: 400px;'></canvas>",
          });
          oVBox.addItem(combinedChartContainer);
        }

        // Create or update the chart
        setTimeout(
          function () {
            var ctx = document.getElementById("combinedChart").getContext("2d");

            if (this._chart) {
              this._chart.destroy(); // Destroy existing chart if it exists
            }

            // Initialize a new Chart instance
            this._chart = new Chart(ctx, {
              type: "bar", // Default chart type
              data: {
                labels: labels,
                datasets: datasets,
              },
              options: {
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
                onClick: function (evt, elements) {
                  if (elements.length > 0) {
                    var firstElement = elements[0];
                    var index = firstElement._index; // Get the data index within the dataset
                    var clickedDate = this._chart.data.labels[index]; // Access the labels array
                    console.log("Clicked Date:", clickedDate);
                    this._displayFilteredDataInTable(clickedDate);
                  }
                }.bind(this),
              },
            });

            // Explicitly call update to ensure the chart is rendered with new data
            this._chart.update();
          }.bind(this),
          500
        );

        // Ensure the chart container is visible
        oVBox.setVisible(true);
      },

      _addAdditionalLineChart: function (data, line2Label) {
        var labels = data.map(function (item) {
          return item.Date;
        });

        var line2Values = data.map(
          function (item) {
            return item[this._selectedMetric]; // Dynamic line chart values
          }.bind(this)
        );

        // Add new line chart dataset
        if (this._chart) {
          this._chart.data.datasets.push({
            type: "line",
            label: line2Label,
            data: line2Values,
            borderColor: "rgba(54, 162, 235, 1)",
            fill: false,
          });

          this._chart.update(); // Update the chart with new dataset
        }
      },

      _displayFilteredDataInTable: function (date) {
        var filteredData = this._jsonData.filter(function (item) {
          return item.Date === date;
        });

        var oTable = this.byId("selectedDataTable");

        // Clear existing table content
        oTable.destroyColumns();
        oTable.destroyItems();

        if (filteredData.length > 0) {
          // Create columns dynamically based on JSON keys
          var columns = Object.keys(filteredData[0]);
          columns.forEach(function (col) {
            oTable.addColumn(
              new sap.m.Column({
                header: new sap.m.Label({
                  text: col,
                  wrapping: true, // Enable text wrapping
                  tooltip: col, // Show full text on hover
                }),
                width: "auto", // Set width to auto-adjust to content
                minScreenWidth: "Small", // Ensure visibility on smaller screens
              })
            );
          });

          // Create rows dynamically
          filteredData.forEach(function (item) {
            var cells = columns.map(function (col) {
              return new sap.m.Text({ text: item[col] });
            });

            oTable.addItem(
              new sap.m.ColumnListItem({
                cells: cells,
              })
            );
          });

          // Make table visible
          oTable.setVisible(true);
        } else {
          MessageToast.show("No data to display.");
        }
      },
    });
  }
);
