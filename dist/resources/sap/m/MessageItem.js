/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Item","sap/ui/core/library","sap/base/Log"],function(e,t,a,r){"use strict";var s=a.MessageType;var i=t.extend("sap.m.MessageItem",{metadata:{library:"sap.m",properties:{type:{type:"sap.ui.core.MessageType",group:"Appearance",defaultValue:s.Error},title:{type:"string",group:"Appearance",defaultValue:""},subtitle:{type:"string",group:"Misc",defaultValue:null},description:{type:"string",group:"Appearance",defaultValue:""},markupDescription:{type:"boolean",group:"Appearance",defaultValue:false},longtextUrl:{type:"sap.ui.core.URI",group:"Behavior",defaultValue:null},counter:{type:"int",group:"Misc",defaultValue:null},groupName:{type:"string",group:"Misc",defaultValue:""},activeTitle:{type:"boolean",group:"Misc",defaultValue:false}},defaultAggregation:"link",aggregations:{link:{type:"sap.m.Link",multiple:false,singularName:"link"}}}});i.prototype.setProperty=function(e,a,r){var s=this.getParent(),i=this.getType().toLowerCase(),p=["description","type","groupName"],o=function(e,t){if(t._oMessagePopoverItem.getId()===this.getId()&&t.getMetadata().getProperty(e)){t.setProperty(e,a)}};if(p.indexOf(e)===-1&&s&&"_bItemsChanged"in s&&!s._bItemsChanged){s._oLists&&s._oLists.all&&s._oLists.all.getItems&&s._oLists.all.getItems().forEach(o.bind(this,e));s._oLists&&s._oLists[i]&&s._oLists[i].getItems&&s._oLists[i].getItems().forEach(o.bind(this,e))}if(typeof this._updatePropertiesFn==="function"){this._updatePropertiesFn()}return t.prototype.setProperty.apply(this,arguments)};i.prototype._updateProperties=function(e){this._updatePropertiesFn=e};i.prototype.setType=function(e){if(e===s.None){e=s.Information;r.warning("The provided None type is handled and rendered as Information type")}return this.setProperty("type",e,true)};return i});
//# sourceMappingURL=MessageItem.js.map