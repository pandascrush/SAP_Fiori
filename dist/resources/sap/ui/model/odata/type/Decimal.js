/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/core/Lib","sap/ui/core/format/NumberFormat","sap/ui/model/FormatException","sap/ui/model/ParseException","sap/ui/model/ValidateException","sap/ui/model/odata/ODataUtils","sap/ui/model/odata/type/ODataType"],function(t,e,i,n,r,a,o,s){"use strict";var u=/^[-+]?(\d+)(?:\.(\d+))?$/,m=/(?:(\.[0-9]*[1-9]+)0+|\.0*)$/;function l(t){return t.oConstraints&&t.oConstraints.scale||0}function f(t,i){return e.getResourceBundleFor("sap.ui.core").getText(t,i)}function c(t){if(t.indexOf(".")>=0){t=t.replace(m,"$1")}return t}function p(e,i){var n,r,a,o,s;function m(i,n){t.warning("Illegal "+n+": "+i,null,e.getName())}function l(t,e,i,n){var r=typeof t==="string"?parseInt(t):t;if(r===undefined){return e}if(typeof r!=="number"||isNaN(r)||r<i){m(t,n);return e}return r}function f(t,e){if(t){if(t.match(u)){return t}m(t,e)}return undefined}function c(t,e){if(t===true||t==="true"){return true}if(t!==undefined&&t!==false&&t!=="false"){m(t,e)}return undefined}function p(t,i,n){if(i!==n){e.oConstraints=e.oConstraints||{};e.oConstraints[t]=i}}e.oConstraints=undefined;if(i){n=i.nullable;a=i.precision;s=i.scale;o=s==="variable"?Infinity:l(s,0,0,"scale");r=l(a,Infinity,1,"precision");if(o!==Infinity&&r<o){t.warning("Illegal scale: must be less than or equal to precision (precision="+a+", scale="+s+")",null,e.getName());o=Infinity}p("precision",r,Infinity);p("scale",o,0);if(n===false||n==="false"){p("nullable",false,true)}else if(n!==undefined&&n!==true&&n!=="true"){m(n,"nullable")}p("minimum",f(i.minimum,"minimum"));p("minimumExclusive",c(i.minimumExclusive,"minimumExclusive"));p("maximum",f(i.maximum,"maximum"));p("maximumExclusive",c(i.maximumExclusive,"maximumExclusive"))}e._handleLocalizationChange()}var h=s.extend("sap.ui.model.odata.type.Decimal",{constructor:function(t,e){s.apply(this,arguments);this.oFormatOptions=t;p(this,e);this.checkParseEmptyValueToZero()}});h.prototype.formatValue=function(t,e){if(t===null||t===undefined){return null}switch(this.getPrimitiveType(e)){case"any":return t;case"float":return parseFloat(t);case"int":return Math.floor(parseFloat(t));case"string":return this.getFormat().format(c(String(t)));default:throw new n("Don't know how to format "+this.getName()+" to "+e)}};h.prototype.getFormat=function(){if(!this.oFormat){var t={groupingEnabled:true,maxIntegerDigits:Infinity},e=l(this);if(e!==Infinity){t.minFractionDigits=t.maxFractionDigits=e}var n=this.oFormatOptions||{};if(n.style!=="short"&&n.style!=="long"){t.preserveDecimals=true}Object.assign(t,this.oFormatOptions);t.parseAsString=true;delete t.parseEmptyValueToZero;this.oFormat=i.getFloatInstance(t)}return this.oFormat};h.prototype.parseValue=function(t,n){var a=this.getEmptyValue(t);if(a!==undefined){return a}var o;switch(this.getPrimitiveType(n)){case"string":o=this.getFormat().parse(t);if(!o){throw new r(e.getResourceBundleFor("sap.ui.core").getText("EnterNumber"))}o=c(o);break;case"int":case"float":o=i.getFloatInstance({maxIntegerDigits:Infinity,decimalSeparator:".",groupingEnabled:false}).format(t);break;default:throw new r("Don't know how to parse "+this.getName()+" from "+n)}return o};h.prototype._handleLocalizationChange=function(){this.oFormat=null};h.prototype.validateValue=function(t){var e,i,n,r,s,m,c,p,h;if(t===null&&(!this.oConstraints||this.oConstraints.nullable!==false)){return}if(typeof t!=="string"){throw new a(f("EnterNumber"))}n=u.exec(t);if(!n){throw new a(f("EnterNumber"))}i=n[1].length;e=(n[2]||"").length;h=l(this);p=this.oConstraints&&this.oConstraints.precision||Infinity;m=this.oConstraints&&this.oConstraints.minimum;r=this.oConstraints&&this.oConstraints.maximum;if(e>h){if(h===0){throw new a(f("EnterInt"))}else if(i+h>p){if(h!==p){throw new a(f("EnterNumberIntegerFraction",[p-h,h]))}if(n[1]!=="0"){throw new a(f("EnterNumberFractionOnly",[h]))}}throw new a(f("EnterNumberFraction",[h]))}if(h===Infinity){if(i+e>p){throw new a(f("EnterNumberPrecision",[p]))}}else if(i>p-h){if(h!==p){if(h){throw new a(f("EnterNumberInteger",[p-h]))}throw new a(f("EnterMaximumOfDigits",[p]))}if(n[1]!=="0"){throw new a(f("EnterNumberFractionOnly",[h]))}}if(m){c=this.oConstraints.minimumExclusive;if(o.compare(m,t,true)>=(c?0:1)){throw new a(f(c?"EnterNumberMinExclusive":"EnterNumberMin",[this.formatValue(m,"string")]))}}if(r){s=this.oConstraints.maximumExclusive;if(o.compare(r,t,true)<=(s?0:-1)){throw new a(f(s?"EnterNumberMaxExclusive":"EnterNumberMax",[this.formatValue(r,"string")]))}}};h.prototype.getName=function(){return"sap.ui.model.odata.type.Decimal"};return h});
//# sourceMappingURL=Decimal.js.map