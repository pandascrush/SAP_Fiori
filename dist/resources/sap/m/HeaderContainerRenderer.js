/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library"],function(t){"use strict";var e=t.Orientation;var r={apiVersion:2};r.render=function(t,r){var n=r.getTooltip_AsString();var a=r.getOrientation();var i="sapMHdrCntrBG"+r.getBackgroundDesign();t.openStart("div",r);if(n){t.attr("title",n)}t.class("sapMHdrCntr");if(r.getSnapToRow()){t.class("sapMHdrCntrSnapToRow")}t.class(a);if(r.getShowDividers()){t.class("sapMHrdrCntrDvdrs")}if(r.getHeight()){t.style("height",r.getHeight())}else{t.style("height",r.getOrientation()===e.Horizontal?"auto":"100%")}if(r.getWidth()){t.style("width",r.getWidth())}else{t.style("width",r.getOrientation()===e.Horizontal?"100%":"auto")}t.openEnd();t.openStart("div",r.getId()+"-scroll-area");t.class("sapMHdrCntrCntr");t.class(a);t.class(i);t.openEnd();t.renderControl(r.getAggregation("_scrollContainer"));t.close("div");var s=r.getAggregation("_prevButton");if(s){t.openStart("div",r.getId()+"-prev-button-container");t.class("sapMHdrCntrBtnCntr");t.class("sapMHdrCntrLeft");t.class(a);t.openEnd();t.renderControl(s);t.close("div")}s=r.getAggregation("_nextButton");if(s){t.openStart("div",r.getId()+"-next-button-container");t.class("sapMHdrCntrBtnCntr");t.class("sapMHdrCntrRight");t.class(a);t.openEnd();t.renderControl(s);t.close("div")}t.openStart("div",r.getId()+"-after");t.attr("tabindex","0");t.openEnd().close("div");t.close("div")};return r},true);
//# sourceMappingURL=HeaderContainerRenderer.js.map