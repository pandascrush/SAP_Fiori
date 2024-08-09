
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.controller.View1", {
        onInit: function () {
            this._jsonData = null; // Store the JSON data here
        },
        onFetchData: function () {
            var that = this;
            var apiUrl = ""; // Replace with your API endpoint

            jQuery.ajax({
                url: apiUrl,
                method: "GET",
                dataType: "json",
                success: function (data) {
                    console.log("Fetched data from API:", data);
                    that._jsonData = data;
                    that._displayDataInTable(that._jsonData);
                },
                error: function (error) {
                    console.error("Error fetching data from API:", error);
                    MessageToast.show("Error fetching data from API.");
                }
            });
        },
        onFileChange: function (oEvent) {
            var oFileUploader = oEvent.getSource();
            var oFile = oFileUploader.oFileUpload.files[0];

            if (oFile) {
                if (this._isValidFile(oFile)) {
                    this.byId("fileNameText").setText("Selected file: " + oFile.name);
                } else {
                    this.byId("fileNameText").setText("Invalid file type. Please upload a JSON file.");
                }
            } else {
                this.byId("fileNameText").setText("");
            }
        },

        _isValidFile: function (oFile) {
            var validExtensions = ["json"];
            var fileExtension = oFile.name.split('.').pop().toLowerCase();
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
                var data = e.target.result;
                console.log("File content:", data);

                // Parse JSON data
                try {
                    that._jsonData = JSON.parse(data);
                    console.log("Parsed JSON data:", that._jsonData);

                    // Check if data is an array and contains required keys
                    if (Array.isArray(that._jsonData) && that._jsonData.length > 0 && that._jsonData[0].Date !== undefined) {
                        that._displayDataInTable(that._jsonData);
                    } else {
                        console.error("Invalid JSON structure or missing keys.");
                        MessageToast.show("Invalid JSON structure or missing keys.");
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    MessageToast.show("Invalid JSON file.");
                }
            };

            reader.onerror = function (error) {
                console.error("Error reading file:", error);
            };

            reader.readAsText(file);
        },

        // _displayDataInTable: function (data) {
        //     var oTable = this.byId("dataTable");

        //     // Clear existing table content
        //     // oTable.destroyColumns();
        //     // oTable.destroyItems();

        //     if (data.length > 0) {
        //         // Create columns dynamically based on JSON keys
        //         var columns = Object.keys(data[0]);
        //         console.log("Data keys:", columns);
        //         columns.forEach(function (col) {
        //             oTable.addColumn(new sap.m.Column({
        //                 header: new sap.m.Label({ text: col })
        //             }));
        //         });

        //         // Create rows dynamically
        //         data.forEach(function (item) {
        //             console.log("Data item:", item);
        //             var cells = columns.map(function (col) {
        //                 console.log("Column:", col, "Value:", item[col]);
        //                 return new sap.m.Text({ text: item[col] });
        //             });

        //             oTable.addItem(new sap.m.ColumnListItem({
        //                 cells: cells
        //             }));
        //         });

        //         // Make table visible
        //         oTable.setVisible(true);
        //     } else {
        //         MessageToast.show("No data to display.");
        //     }
        // },

        onSeeChart: function () {
            if (!this._jsonData) {
                MessageToast.show("Please upload a file first.");
                return;
            }

            this._displayBarChart(this._jsonData);
        },

        _displayBarChart: function (data) {
            var labels = data.map(function(item) {
                console.log("Date value:", item.Date);
                return item.Date;
            });
            var values = data.map(function(item) {
                console.log("Sales_Plan_value:", item.Sales_Plan_value);
                return item.Sales_Plan_value;
            });
            var valuess = data.map(function(item) {
                console.log("Sold_value:", item.Sold_value);
                return item.Sold_value;
            });

            console.log("Chart Labels:", labels);
            console.log("Chart Values (Sales_Plan_value):", values);
            console.log("Chart Values (Sold_value):", valuess);

            // Create the bar chart container
            var oVBox = this.byId("barChartVBox");
            oVBox.destroyItems();
            var barChartContainer = new sap.ui.core.HTML({
                content: "<canvas id='barChart' style='width: 100%; height: 400px;'></canvas>"
            });
            oVBox.addItem(barChartContainer);

            // Create the bar chart
            setTimeout(function () {
                var ctx = document.getElementById('barChart').getContext('2d');
                var chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Sales Plan Value',
                            data: values,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            type: 'line',
                            label: 'Sold_value',
                            data: valuess,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            fill: false
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: false
                            }
                        },
                        onClick: function (evt) {
                            var activePoints = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
                            if (activePoints.length > 0) {
                                console.log(activePoints[0])
                                var index = activePoints[0]._index;
                                console.log(index)
                                console.log("Active Point Index:", index);
                                var clickedDate = chart.data.labels[index];
                                console.log('Clicked Date:', clickedDate);
                                this._displayFilteredDataInTable(clickedDate);
                            } else {
                                console.log("No active points found.");
                            }
                        }.bind(this)
                    }
                });
            }.bind(this), 500);
//             onClick: function (evt, elements) {
//                 if (elements.length > 0) {
//                     console.log(elements[0]._index)
//                     var index = elements[0].index;
//                     var clickedDate = this.data.labels[elements[0]._index];
//                     console.log('Clicked Date:', clickedDate);
//                     this._displayFilteredDataInTable(clickedDate);
//                 }
//             }.bind(this)
//         }
//     });
// }.bind(this), 500);


            oVBox.setVisible(true);
        },

        _displayFilteredDataInTable: function (clickedDate) {
            console.log("Filtering data for date:", clickedDate);

            // Filter the JSON data based on the clicked date
            var filteredData = this._jsonData.filter(function (item) {
                return item.Date === clickedDate;
            });

            if (filteredData.length > 0) {
                console.log("Filtered Data:", filteredData[0]);
                this._displaySelectedDataInTable(filteredData[0]); // Display the first match (or handle multiple matches as needed)
            } else {
                MessageToast.show("No data found for the selected date.");
            }
        },

        _displaySelectedDataInTable: function (data) {
            var oTable = this.byId("selectedDataTable");

            // Clear existing table content
            oTable.destroyColumns();
            oTable.destroyItems();

            console.log("Displaying Data in Table:", data);

            // Create columns dynamically based on JSON keys
            var columns = Object.keys(data);
            columns.forEach(function (col) {
                oTable.addColumn(new sap.m.Column({
                    header: new sap.m.Label({ text: col })
                }));
            });

            // Create row
            var cells = columns.map(function (col) {
                console.log("Column:", col, "Value:", data[col]);
                return new sap.m.Text({ text: data[col] });
            });

            oTable.addItem(new sap.m.ColumnListItem({
                cells: cells
            }));

            // Make table visible
            oTable.setVisible(true);
        }
    });
});
// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/m/MessageToast",
//     "sap/ui/model/json/JSONModel"
// ], function (Controller, MessageToast, JSONModel) {
//     "use strict";

//     return Controller.extend("sap.ui.demo.walkthrough.controller.View1", {
//         onInit: function () {
//             this._jsonData = null; // Store the JSON data here
//             this._chart = null;    // Store the chart instance here
//         },

//         onFetchData: function () {
//             var that = this;
//             var apiUrl = "http://localhost:8080/fioridemo.json"; // Replace with your API endpoint

//             jQuery.ajax({
//                 url: apiUrl,
//                 method: "GET",
//                 dataType: "json",
//                 success: function (data) {
//                     console.log("Fetched data from API:", data);
//                     that._jsonData = data;
//                     that._displayDataInTable(that._jsonData);
//                 },
//                 error: function (error) {
//                     console.error("Error fetching data from API:", error);
//                     MessageToast.show("Error fetching data from API.");
//                 }
//             });
//         },

//         _displayDataInTable: function (data) {
//             var oTable = this.byId("dataTable");

//             // Clear existing table content
//             // oTable.destroyColumns();
//             // oTable.destroyItems();

//             if (data.length > 0) {
//                 // Create columns dynamically based on JSON keys
//                 var columns = Object.keys(data[0]);
//                 columns.forEach(function (col) {
//                     oTable.addColumn(new sap.m.Column({
//                         header: new sap.m.Label({ text: col })
//                     }));
//                 });

//                 // Create rows dynamically 
//                 data.forEach(function (item) {
//                     var cells = columns.map(function (col) {
//                         return new sap.m.Text({ text: item[col] });
//                     });

//                     oTable.addItem(new sap.m.ColumnListItem({
//                         cells: cells
//                     }));
//                 });

//                 // Make table visible
//                 oTable.setVisible(true);
//             } else {
//                 MessageToast.show("No data to display.");
//             }
//         },

//         onSeeChart: function () {
//             if (!this._jsonData) {
//                 MessageToast.show("Please fetch data first.");
//                 return;
//             }

//             this._displayCombinedChart(this._jsonData);
//         },

//         _displayCombinedChart: function (data) {
//             var labels = data.map(function(item) { return item.Date; });
//             var values = data.map(function(item) { return item['Sales Plan Value']; });

//             // Create the combined chart container
//             var oVBox = this.byId("combinedChartVBox");
//             // oVBox.destroyItems(); 
//             var combinedChartContainer = new sap.ui.core.HTML({
//                 content: "<canvas id='combinedChart' style='width: 100%; height: 400px;'></canvas>"
//             });
//             oVBox.addItem(combinedChartContainer);

//             // Create the combined chart
//             setTimeout(function () {
//                 var ctx = document.getElementById('combinedChart').getContext('2d');
//                 if (this._chart) {
//                     this._chart.destroy(); // Destroy existing chart if it exists
//                 }
//                 this._chart = new Chart(ctx, {
//                     type: 'bar', // Set type to bar initially
//                     data: {
//                         labels: labels,
//                         datasets: [
//                             {
//                                 type: 'bar',
//                                 label: 'Sales Plan Value (Bar)',
//                                 data: values,
//                                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                                 borderColor: 'rgba(75, 192, 192, 1)',
//                                 borderWidth: 1
//                             },
//                             {
//                                 type: 'line',
//                                 label: 'Sales Plan Value (Line)',
//                                 data: values,
//                                 borderColor: 'rgba(255, 99, 132, 1)',
//                                 fill: false
//                             }
//                         ]
//                     },
//                     options: {
//                         responsive: true,
//                         scales: {
//                             y: {
//                                 beginAtZero: true
//                             }
//                         },
//                         onClick: function (evt, elements) {
//                             if (elements.length > 0) {
//                                 var index = elements[0].index;
//                                 var clickedDate = this.data.labels[index];
//                                 console.log('Clicked Date:', clickedDate);
//                                 this._displayFilteredDataInTable(clickedDate);
//                             }
//                         }.bind(this)
//                     }
//                 });
//             }.bind(this), 500);

//             oVBox.setVisible(true);
//         },

//         _displayFilteredDataInTable: function (date) {
//             var filteredData = this._jsonData.filter(function(item) {
//                 return item.Date === date;
//             });

//             var oTable = this.byId("selectedDataTable");

//             // Clear existing table content
//             oTable.destroyColumns();
//             oTable.destroyItems();

//             if (filteredData.length > 0) {
//                 // Create columns dynamically based on JSON keys
//                 var columns = Object.keys(filteredData[0]);
//                 columns.forEach(function (col) {
//                     oTable.addColumn(new sap.m.Column({
//                         header: new sap.m.Label({ text: col })
//                     }));
//                 });

//                 // Create rows dynamically 
//                 filteredData.forEach(function (item) {
//                     var cells = columns.map(function (col) {
//                         return new sap.m.Text({ text: item[col] });
//                     });

//                     oTable.addItem(new sap.m.ColumnListItem({
//                         cells: cells
//                     }));
//                 });

//                 // Make table visible
//                 oTable.setVisible(true);
//             } else {
//                 MessageToast.show("No data to display.");
//             }
//         }
//     });
// });
// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/m/MessageToast"
// ], function (Controller, MessageToast) {
//     "use strict";

//     return Controller.extend("sap.ui.demo.controller.App", {
//         onInit: function () {
//             var oModel = new sap.ui.model.json.JSONModel();
//             oModel.setData({
//                 Months: [
//                     { Month: "January" },
//                     { Month: "February" },
//                     { Month: "March" },
//                     { Month: "April" },
//                     { Month: "May" },
//                     { Month: "June" },
//                     { Month: "July" },
//                     { Month: "August" },
//                     { Month: "September" },
//                     { Month: "October" },
//                     { Month: "November" },
//                     { Month: "December" }
//                 ]
//             });
//             this.getView().setModel(oModel);
//         },

//         onSubmit: function () {
//             var oComboBox = this.byId("monthComboBox");
//             var oFileUploader = this.byId("fileUploader");
//             var sSelectedMonth = oComboBox.getSelectedKey();
//             var oFile = oFileUploader.getFocusDomRef();

//             if (!sSelectedMonth || !oFile) {
//                 MessageToast.show("Please select a month and choose a file.");
//                 return;
//             }

//             var formData = new FormData();
//             formData.append("month", sSelectedMonth);
//             formData.append("file", oFile);

//             $.ajax({
//                 url: "/api/upload",
//                 type: "POST",
//                 data: formData,
//                 processData: false,
//                 contentType: false,
//                 success: function () {
//                     MessageToast.show("File uploaded successfully");
//                 },
//                 error: function () {
//                     MessageToast.show("Failed to upload file");
//                 }
//             });
//         }
//     });
// });

