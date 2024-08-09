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
        this._jsonData = null; // Store the JSON data here
        this._chart = null; // Store the chart instance here
      },

      onFileChange: function (oEvent) {
        var oFileUploader = oEvent.getSource();
        var oFile = oFileUploader.oFileUpload.files[0];

        if (oFile) {
          if (this._isValidFile(oFile)) {
            this.byId("fileNameText").setText("Selected file: " + oFile.name);
          } else {
            this.byId("fileNameText").setText(
              "Invalid file type. Please upload a CSV file."
            );
          }
        } else {
          this.byId("fileNameText").setText("");
        }
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
        var apiUrl = "http://localhost:8080/finaldata.json"; // Replace with your API endpoint

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
            that._displayCombinedChart(mergedData);
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
        // oTable.destroyColumns();
        // oTable.destroyItems();

        if (data.length > 0) {
          // Create columns dynamically based on JSON keys
          var columns = Object.keys(data[0]);
          columns.forEach(function (col) {
            oTable.addColumn(
              new sap.m.Column({
                header: new sap.m.Label({ text: col }),
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

      onSeeChart: function () {
        if (!this._jsonData) {
          MessageToast.show("Please upload a file first.");
          return;
        }

        this._displayCombinedChart(this._jsonData);
      },

      _displayCombinedChart: function (data) {
        var labels = data.map(function (item) {
          return item.Date;
        });
        var barvalue = data.map(function (item) {
          return item.NETPR;
        });
        var values = data.map(function (item) {
          return item.Sales_Plan_value;
        });

        // Create the combined chart container
        var oVBox = this.byId("combinedChartVBox");
        oVBox.destroyItems();
        var combinedChartContainer = new sap.ui.core.HTML({
          content:
            "<canvas id='combinedChart' style='width: 100%; height: 400px;'></canvas>",
        });
        oVBox.addItem(combinedChartContainer);

        // Create the combined chart
        setTimeout(
          function () {
            var ctx = document.getElementById("combinedChart").getContext("2d");
            if (this._chart) {
              this._chart.destroy(); // Destroy existing chart if it exists
            }
            var that = this;
            this._chart = new Chart(ctx, {
              type: "bar", // Set type to bar initially
              data: {
                labels: labels,
                datasets: [
                  {
                    type: "bar",
                    label: "Sales Plan Value (Bar)",
                    data: barvalue,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                  {
                    type: "line",
                    label: "Sales Plan Value (Line)",
                    data: values,
                    borderColor: "rgba(255, 99, 132, 1)",
                    fill: false,
                  },
                ],
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
                    var datasetIndex = firstElement.datasetIndex; // Get the dataset index
                    var index = firstElement._index; // Get the data index within the dataset
                    console.log(index);
                    var clickedDate = that._chart.data.labels[index]; // Access the labels array
                    console.log(clickedDate);
                    console.log("Clicked Date:", clickedDate);
                    that._displayFilteredDataInTable(clickedDate);
                  }
                },
              },
            });
          }.bind(this),
          500
        );

        oVBox.setVisible(true);
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
                header: new sap.m.Label({ text: col }),
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
