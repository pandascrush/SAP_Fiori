/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library"],function(e){"use strict";var t=e.IconColor;var i={apiVersion:2};i.render=function(e,i){var r=i._getParams(),n=i.getVisibleItems(),a=i._oIconTabHeader,s=i._checkTextOnly(),l=a.getVisibleTabFilters().length,o=r.fNestedItemPaddingLeft,c=false;var f=n.filter(function(e){return e.isA("sap.m.IconTabFilter")}).some(function(e){return e.getIconColor()!==t.Default});i.checkIconOnly();var u=r.fAdditionalPadding;if(f&&u){o+=u;c=true}this.renderList(e,n,i,a,s,o,c,l)};i.renderList=function(e,t,i,r,n,a,s,l){if(!t.length){return}e.openStart("ul",i).attr("role","menu").class("sapMITBSelectList");if(n){e.class("sapMITBSelectListTextOnly")}e.openEnd();for(var o=0;o<t.length;o++){var c=t[o],f;if(r&&c.isA("sap.m.IconTabFilter")){f=r.getVisibleTabFilters().indexOf(c._getRealTab())}if(c.isA("sap.m.IconTabFilter")&&c._getRootTab()._getSelectList()===i){f=o;l=t.length}var u=c._getNestedLevel()-2;if(s){u++}if(i._bIsOverflow){u++}c.renderInSelectList(e,i,f,l,a*u)}e.close("ul")};return i},true);
//# sourceMappingURL=IconTabBarSelectListRenderer.js.map