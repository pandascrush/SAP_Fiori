/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/f/cards/BaseHeaderRenderer","sap/ui/core/Renderer"],function(e,a){"use strict";var t=a.extend(e);t.apiVersion=2;t.render=function(a,t){var r=t.getId(),i=t.mBindingInfos,s=t.getStatusText(),d=t.getAggregation("_title"),n=t.getAggregation("_subtitle"),o=t.getSubtitle()||i.subtitle,l=t.getAggregation("_dataTimestamp"),p=t.getDataTimestamp()||i.dataTimestamp,c=t.isLoading(),g=t.getAggregation("_error"),f=t.getToolbar(),u=t.getProperty("useTileLayout"),C=t.isLink();a.openStart("div",t).class("sapFCardHeader");if(c){a.class("sapFCardHeaderLoading")}if(t.isInteractive()){a.class("sapFCardSectionClickable")}if(t.getIconSrc()&&t.getIconVisible()){a.class("sapFCardHeaderHasIcon")}if(f?.getVisible()){a.class("sapFCardHeaderHasToolbar")}a.openEnd();if(C){a.openStart("a");e.linkAttributes(a,t)}else{a.openStart("div")}a.attr("id",r+"-focusable").class("sapFCardHeaderWrapper");if(t.getProperty("focusable")&&!t._isInsideGridContainer()){a.attr("tabindex","0")}if(!t._isInsideGridContainer()){a.accessibilityState({labelledby:{value:t._getAriaLabelledBy(),append:true},role:t.getFocusableElementAriaRole(),roledescription:t.getAriaRoleDescription()})}a.openEnd();if(g){a.renderControl(g);a.close("div");a.close("div");return}if(!u){e.renderAvatar(a,t)}a.openStart("div").class("sapFCardHeaderText").openEnd();if(t.getTitle()||i.title){a.openStart("div").class("sapFCardHeaderTextFirstLine").openEnd();if(i.title){d.addStyleClass("sapFCardHeaderItemBinded")}a.renderControl(d);if(s&&t.getStatusVisible()){a.openStart("span",r+"-status").class("sapFCardStatus");if(i.statusText){a.class("sapFCardHeaderItemBinded")}a.openEnd().text(s).close("span")}a.close("div");if(o||p){a.openStart("div").class("sapFCardHeaderTextSecondLine");if(p){a.class("sapFCardHeaderLineIncludesDataTimestamp")}a.openEnd();if(o){if(i.subtitle){n.addStyleClass("sapFCardHeaderItemBinded")}a.renderControl(n)}if(p){a.renderControl(l)}a.close("div")}}a.close("div");if(u){e.renderAvatar(a,t)}e.renderBanner(a,t);if(C){a.close("a")}else{a.close("div")}if(f){a.openStart("div").class("sapFCardHeaderToolbarCont").openEnd();a.renderControl(f);a.close("div")}a.close("div")};return t},true);
//# sourceMappingURL=HeaderRenderer.js.map