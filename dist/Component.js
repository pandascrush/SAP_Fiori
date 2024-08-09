sap.ui.define(["sap/ui/core/UIComponent"], function (t) {
  "use strict";
  return t.extend("sap.ui.demo.walkthrough.Component", {
    metadata: { manifest: "json" },
    init: function () {
      t.prototype.init.apply(this, arguments);
      this.getRouter().initialize();
    },
  });
});
//# sourceMappingURL=Component.js.map
