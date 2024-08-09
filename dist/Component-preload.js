//@ui5-bundle <id>/Component-preload.js
sap.ui.predefine("<id>/Component", ["sap/ui/core/UIComponent"], function (t) {
  "use strict";
  return t.extend("sap.ui.demo.walkthrough.Component", {
    metadata: { manifest: "json" },
    init: function () {
      t.prototype.init.apply(this, arguments);
      this.getRouter().initialize();
    },
  });
});
sap.ui.predefine(
  "<id>/controller/View1.controller",
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
      },
      onFetchData: function () {
        var e = this;
        var t = "";
        jQuery.ajax({
          url: t,
          method: "GET",
          dataType: "json",
          success: function (a) {
            console.log("Fetched data from API:", a);
            e._jsonData = a;
            e._displayDataInTable(e._jsonData);
          },
          error: function (e) {
            console.error("Error fetching data from API:", e);
            a.show("Error fetching data from API.");
          },
        });
      },
      onFileChange: function (e) {
        var a = e.getSource();
        var t = a.oFileUpload.files[0];
        if (t) {
          if (this._isValidFile(t)) {
            this.byId("fileNameText").setText("Selected file: " + t.name);
          } else {
            this.byId("fileNameText").setText(
              "Invalid file type. Please upload a JSON file."
            );
          }
        } else {
          this.byId("fileNameText").setText("");
        }
      },
      _isValidFile: function (e) {
        var a = ["json"];
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
        var t = this;
        var o = new FileReader();
        o.onload = function (e) {
          var o = e.target.result;
          console.log("File content:", o);
          try {
            t._jsonData = JSON.parse(o);
            console.log("Parsed JSON data:", t._jsonData);
            if (
              Array.isArray(t._jsonData) &&
              t._jsonData.length > 0 &&
              t._jsonData[0].Date !== undefined
            ) {
              t._displayDataInTable(t._jsonData);
            } else {
              console.error("Invalid JSON structure or missing keys.");
              a.show("Invalid JSON structure or missing keys.");
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
            a.show("Invalid JSON file.");
          }
        };
        o.onerror = function (e) {
          console.error("Error reading file:", e);
        };
        o.readAsText(e);
      },
      onSeeChart: function () {
        if (!this._jsonData) {
          a.show("Please upload a file first.");
          return;
        }
        this._displayBarChart(this._jsonData);
      },
      _displayBarChart: function (e) {
        var a = e.map(function (e) {
          console.log("Date value:", e.Date);
          return e.Date;
        });
        var t = e.map(function (e) {
          console.log("Sales_Plan_value:", e.Sales_Plan_value);
          return e.Sales_Plan_value;
        });
        var o = e.map(function (e) {
          console.log("Sold_value:", e.Sold_value);
          return e.Sold_value;
        });
        console.log("Chart Labels:", a);
        console.log("Chart Values (Sales_Plan_value):", t);
        console.log("Chart Values (Sold_value):", o);
        var l = this.byId("barChartVBox");
        l.destroyItems();
        var n = new sap.ui.core.HTML({
          content:
            "<canvas id='barChart' style='width: 100%; height: 400px;'></canvas>",
        });
        l.addItem(n);
        setTimeout(
          function () {
            var e = document.getElementById("barChart").getContext("2d");
            var l = new Chart(e, {
              type: "bar",
              data: {
                labels: a,
                datasets: [
                  {
                    label: "Sales Plan Value",
                    data: t,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                  {
                    type: "line",
                    label: "Sold_value",
                    data: o,
                    borderColor: "rgba(255, 99, 132, 1)",
                    fill: false,
                  },
                ],
              },
              options: {
                responsive: true,
                scales: { y: { beginAtZero: false } },
                onClick: function (e) {
                  var a = l.getElementsAtEventForMode(
                    e,
                    "nearest",
                    { intersect: true },
                    true
                  );
                  if (a.length > 0) {
                    console.log(a[0]);
                    var t = a[0]._index;
                    console.log(t);
                    console.log("Active Point Index:", t);
                    var o = l.data.labels[t];
                    console.log("Clicked Date:", o);
                    this._displayFilteredDataInTable(o);
                  } else {
                    console.log("No active points found.");
                  }
                }.bind(this),
              },
            });
          }.bind(this),
          500
        );
        l.setVisible(true);
      },
      _displayFilteredDataInTable: function (e) {
        console.log("Filtering data for date:", e);
        var t = this._jsonData.filter(function (a) {
          return a.Date === e;
        });
        if (t.length > 0) {
          console.log("Filtered Data:", t[0]);
          this._displaySelectedDataInTable(t[0]);
        } else {
          a.show("No data found for the selected date.");
        }
      },
      _displaySelectedDataInTable: function (e) {
        var a = this.byId("selectedDataTable");
        a.destroyColumns();
        a.destroyItems();
        console.log("Displaying Data in Table:", e);
        var t = Object.keys(e);
        t.forEach(function (e) {
          a.addColumn(
            new sap.m.Column({ header: new sap.m.Label({ text: e }) })
          );
        });
        var o = t.map(function (a) {
          console.log("Column:", a, "Value:", e[a]);
          return new sap.m.Text({ text: e[a] });
        });
        a.addItem(new sap.m.ColumnListItem({ cells: o }));
        a.setVisible(true);
      },
    });
  }
);
sap.ui.predefine("<id>/index", ["sap/ui/core/mvc/XMLView"], function (e) {
  "use strict";
  e.create({ viewName: "sap.ui.demo.walkthrough.view.View1" }).then(function (
    e
  ) {
    e.placeAt("content");
  });
});
sap.ui.require.preload({
  "<id>/manifest.json":
    '{"_version":"1.1.0","start_url":"<startUrl>","sap.app":{"_version":"1.1.0","id":"<id>","type":"application","i18n":"<i18nPathRelativeToManifest>","applicationVersion":{"version":"<version>"},"title":"{{<title>}}","tags":{"keywords":["{{<keyword1>}}","{{<keyword2>}}"]},"dataSources":{"<dataSourceAlias>":{"uri":"<uri>","settings":{"localUri":"<localUri>"}}}},"sap.ui":{"_version":"1.1.0","icons":{"icon":"<icon>","favIcon":"<favIcon>","phone":"<phone>","phone@2":"<phone@2>","tablet":"<tablet>","tablet@2":"<tablet@2>"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_bluecrystal"]},"sap.ui5":{"_version":"1.1.0","resources":{"js":[{"uri":"<uri>"}],"css":[{"uri":"<uri>","id":"<id>"}]},"dependencies":{"minUI5Version":"<minUI5Version>","libs":{"<ui5lib1>":{"minVersion":"<minVersion1>"},"<ui5lib2>":{"minVersion":"<minVersion2>"}},"components":{"<ui5component1>":{"minVersion":"<minComp1Version>"}}},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"<uriRelativeToManifest>"},"":{"dataSource":"<dataSourceAlias>","settings":{}}},"rootView":"<rootView>","handleValidation":false,"config":{},"routing":{},"extends":{"component":"<extendedComponentId>","minVersion":"<minComp1Version>","extensions":{}},"contentDensities":{"compact":false,"cozy":false}},"sap.platform.abap":{"_version":"1.1.0","uri":"<uri>"},"sap.platform.hcp":{"_version":"1.1.0","uri":"<uri>"}}',
  "<id>/view/View1.view.xml":
    '<mvc:View\r\n    xmlns="sap.m"\r\n    xmlns:mvc="sap.ui.core.mvc"\r\n    xmlns:unified="sap.ui.unified"\r\n    xmlns:core="sap.ui.core"\r\n    controllerName="sap.ui.demo.walkthrough.controller.View1"><VBox class="sapUiSmallMargin"><Label text="Upload your file" labelFor="fileUploader"/><unified:FileUploader id="fileUploader" name="myFile" fileType="json" change="onFileChange"/><Text id="fileNameText" text=""/><Button\r\n            text="Submit"\r\n            press="onSubmit"\r\n            type="Emphasized"/><Button\r\n            id="fetchDataButton"\r\n            text="Fetch Data from API"\r\n            press="onFetchData"\r\n            type="Emphasized"/><Button\r\n            id="seeChartButton"\r\n            text="Seechart"\r\n            press="onSeeChart"\r\n            type="Emphasized"/><Table id="dataTable" inset="false" visible="false"><columns></columns><items><ColumnListItem></ColumnListItem></items></Table><VBox id="barChartVBox" visible="false"></VBox><Table id="selectedDataTable" inset="false" visible="false"><columns></columns><items><ColumnListItem></ColumnListItem></items></Table></VBox><VBox class="sapUiSmallMargin"><Label text="Month:"></Label><ComboBox id="combomonth"></ComboBox></VBox></mvc:View>',
});
//# sourceMappingURL=Component-preload.js.map
