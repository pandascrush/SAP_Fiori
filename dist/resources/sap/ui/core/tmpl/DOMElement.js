/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","./DOMAttribute","./DOMElementRenderer","sap/base/Log","sap/ui/thirdparty/jquery","sap/ui/core/library"],function(t,e,i,r,jQuery){"use strict";var a=t.extend("sap.ui.core.tmpl.DOMElement",{metadata:{library:"sap.ui.core",properties:{text:{type:"string",group:"Appearance",defaultValue:null},tag:{type:"string",group:"Behavior",defaultValue:"span"}},defaultAggregation:"attributes",aggregations:{attributes:{type:"sap.ui.core.tmpl.DOMAttribute",multiple:true,singularName:"attribute"},elements:{type:"sap.ui.core.tmpl.DOMElement",multiple:true,singularName:"element"}}},renderer:i});a.prototype.applySettings=function(i){var a=this.getMetadata(),n=a.getJSONKeys();if(i){if(!i["attributes"]){var s=i["attributes"]=[];jQuery.each(i,function(t,r){if(t!=="id"&&!n[t]&&typeof r==="string"){s.push(new e({name:t,value:r}));delete i[t]}})}else{r.warning("DOMElement#"+this.getId()+": custom attributes in settings will be ignored since attributes are provided!")}}t.prototype.applySettings.apply(this,arguments)};a.prototype.exit=a.prototype.onBeforeRendering=function(){var t=this.getTag().toLowerCase();if(t==="input"||t==="textarea"||t==="select"){this.$().off("change")}};a.prototype.onAfterRendering=function(){var t=this.getTag().toLowerCase();if(t==="input"||t==="textarea"||t==="select"){this.$().on("change",jQuery.proxy(this.oninputchange,this))}};a.prototype.oninputchange=function(t){var e=this.getTag().toLowerCase();if(e==="input"){var i=this.$().val();this.getAttributes().forEach(function(t){if(t.getName().toLowerCase()==="value"){t.setValue(i)}})}else if(e==="textarea"){var r=this.$().val();this.setText(r)}else if(e==="select"){var r="";this.$().find("select option:selected").each(function(){r+=jQuery(this).text()+" "});this.setText(r)}};a.prototype.attr=function(t,i){var r=this.getAttributes().find(function(e){var i=e.getName();return i.toLowerCase()===t});if(i===undefined){return r&&r.getValue()}else{if(r){if(i===null){this.removeAttribute(r)}else{r.setValue(i)}}else{if(i!==null){this.addAttribute(new e({name:t,value:i}))}}return this}};a.prototype.removeAttr=function(t){this.attr(t,null);return this};a.prototype.setText=function(t){this.setProperty("text",t,true);var e=this.$();if(e.length>0){var i=this.getTag().toLowerCase();if(i==="textarea"){e.val(this.getProperty("text"))}else{e.text(this.getProperty("text"))}}return this};return a});
//# sourceMappingURL=DOMElement.js.map