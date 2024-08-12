sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
  ],
  function (e, a, t) {
    "use strict";
    return e.extend("sap.ui.demo.walkthrough.controller.View1", {
      onInit: function () {
        this._jsonData = null;
        this._chart = null;
      },
      onFileChange: function (e) {
        var a = e.getSource();
        var t = a.oFileUpload.files[0];
        if (t) {
          if (this._isValidFile(t)) {
            this.byId("fileNameText").setText("Selected file: " + t.name);
          } else {
            this.byId("fileNameText").setText(
              "Invalid file type. Please upload a CSV file."
            );
          }
        } else {
          this.byId("fileNameText").setText("");
        }
      },
      _isValidFile: function (e) {
        var a = ["csv"];
        var t = e.name.split(".").pop().toLowerCase();
        return a.includes(t);
      },
      onSubmit: function () {
        var e = this.byId("fileUploader");
        var t = e.oFileUpload.files[0];
        if (t) {
          this._processFile(t);
        } else {
          a.show("Please upload a file first.");
        }
      },
      _processFile: function (e) {
        var a = this;
        var t = new FileReader();
        t.onload = function (e) {
          var t = e.target.result;
          console.log("File content:", t);
          var n = a._csvToJson(t);
          console.log("Converted JSON data:", n);
          a._jsonData = n;
          a._displayDataInTable(n);
        };
        t.onerror = function (e) {
          console.error("Error reading file:", e);
        };
        t.readAsText(e);
      },
      _csvToJson: function (e) {
        var a = e.split("\n");
        var t = [];
        var n = a[0].split(",");
        for (var o = 1; o < a.length; o++) {
          var r = {};
          var i = a[o].split(",");
          if (i.length === 1 && i[0].trim() === "") {
            continue;
          }
          for (var s = 0; s < n.length; s++) {
            var l = n[s].trim();
            var d = i[s] ? i[s].trim() : "";
            if (l && d) {
              r[l] = d;
            }
          }
          t.push(r);
        }
        return t;
      },
      onFetchData: function () {
        var e = this;
        var t = "http://localhost:3003/finaldata.json";
        jQuery.ajax({
          url: t,
          method: "GET",
          dataType: "json",
          success: function (a) {
            console.log("Fetched data from API:", a);
            var t = e._mergeDataByDate(e._jsonData, a);
            console.log("Merged data:", t);
            e._jsonData = t;
            e._displayDataInTable(t);
            e._displayCombinedChart(t);
          },
          error: function (e) {
            console.error("Error fetching data from API:", e);
            a.show("Error fetching data from API.");
          },
        });
      },
      _mergeDataByDate: function (e, a) {
        var t = new Map();
        e.forEach(function (e) {
          t.set(e.Date, e);
        });
        a.forEach(function (e) {
          var a = t.get(e.Date);
          if (a) {
            Object.keys(e).forEach(function (t) {
              if (t !== "Date") {
                a[t] = e[t];
              }
            });
          } else {
            t.set(e.Date, e);
          }
        });
        return Array.from(t.values());
      },
      _displayDataInTable: function (e) {
        var t = this.byId("dataTable");
        if (e.length > 0) {
          var n = Object.keys(e[0]);
          n.forEach(function (e) {
            t.addColumn(
              new sap.m.Column({ header: new sap.m.Label({ text: e }) })
            );
          });
          e.forEach(function (e) {
            var a = n.map(function (a) {
              return new sap.m.Text({ text: e[a] });
            });
            t.addItem(new sap.m.ColumnListItem({ cells: a }));
          });
          t.setVisible(true);
        } else {
          a.show("No data to display.");
        }
      },
      onSeeChart: function () {
        if (!this._jsonData) {
          a.show("Please upload a file first.");
          return;
        }
        this._displayCombinedChart(this._jsonData);
      },
      _displayCombinedChart: function (e) {
        var a = e.map(function (e) {
          return e.Date;
        });
        var t = e.map(function (e) {
          return e.Net_Price;
        });
        var n = e.map(function (e) {
          return e.Sales_Plan_value;
        });
        console.log(t);
        var o = this.byId("combinedChartVBox");
        o.destroyItems();
        var r = new sap.ui.core.HTML({
          content:
            "<canvas id='combinedChart' style='width: 100%; height: 400px;'></canvas>",
        });
        o.addItem(r);
        setTimeout(
          function () {
            var e = document.getElementById("combinedChart").getContext("2d");
            if (this._chart) {
              this._chart.destroy();
            }
            var o = this;
            this._chart = new Chart(e, {
              type: "bar",
              data: {
                labels: a,
                datasets: [
                  {
                    type: "bar",
                    label: "Sales Plan Value (Bar)",
                    data: t,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                  {
                    type: "line",
                    label: "Sales Plan Value (Line)",
                    data: n,
                    borderColor: "rgba(255, 99, 132, 1)",
                    fill: false,
                  },
                ],
              },
              options: {
                responsive: true,
                scales: { y: { beginAtZero: true } },
                onClick: function (e, a) {
                  if (a.length > 0) {
                    var t = a[0];
                    var n = t.datasetIndex;
                    var r = t._index;
                    console.log(r);
                    var i = o._chart.data.labels[r];
                    console.log(i);
                    console.log("Clicked Date:", i);
                    o._displayFilteredDataInTable(i);
                  }
                },
              },
            });
          }.bind(this),
          500
        );
        o.setVisible(true);
      },
      _displayFilteredDataInTable: function (e) {
        var t = this._jsonData.filter(function (a) {
          return a.Date === e;
        });
        var n = this.byId("selectedDataTable");
        n.destroyColumns();
        n.destroyItems();
        if (t.length > 0) {
          var o = Object.keys(t[0]);
          o.forEach(function (e) {
            n.addColumn(
              new sap.m.Column({ header: new sap.m.Label({ text: e }) })
            );
          });
          t.forEach(function (e) {
            var a = o.map(function (a) {
              return new sap.m.Text({ text: e[a] });
            });
            n.addItem(new sap.m.ColumnListItem({ cells: a }));
          });
          n.setVisible(true);
        } else {
          a.show("No data to display.");
        }
      },
    });
  }
);
//# sourceMappingURL=View1.controller.js.map
