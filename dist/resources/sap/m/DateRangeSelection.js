/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/i18n/Formatting","sap/ui/Device","./DatePicker","./library","sap/ui/core/Lib","sap/ui/core/Locale","sap/ui/core/LocaleData","sap/ui/core/format/DateFormat","sap/ui/core/date/UniversalDate","./DateRangeSelectionRenderer","sap/ui/unified/calendar/CustomMonthPicker","sap/ui/unified/calendar/CustomYearPicker","sap/base/util/deepEqual","sap/base/Log","sap/base/assert","sap/ui/core/date/UI5Date","sap/ui/dom/jquery/cursorPos"],function(e,t,a,i,s,r,n,o,l,u,h,g,p,c,f,d){"use strict";var D=a.extend("sap.m.DateRangeSelection",{metadata:{library:"sap.m",properties:{delimiter:{type:"string",group:"Misc",defaultValue:"-"},secondDateValue:{type:"object",group:"Data",defaultValue:null},from:{type:"object",group:"Misc",defaultValue:null,deprecated:true},to:{type:"object",group:"Misc",defaultValue:null,deprecated:true}},designtime:"sap/m/designtime/DateRangeSelection.designtime",dnd:{draggable:false,droppable:true}},renderer:u});var _=String.fromCharCode(45),m=String.fromCharCode(8211),y=String.fromCharCode(8212);D.prototype.init=function(){a.prototype.init.apply(this,arguments);this._bIntervalSelection=true};D.prototype._createPopupContent=function(){a.prototype._createPopupContent.apply(this,arguments);var e=this._getCalendar();if(e instanceof h){e._getMonthPicker().setIntervalSelection(true)}if(e instanceof g){e._getYearPicker().setIntervalSelection(true)}this._getCalendar().detachWeekNumberSelect(this._handleWeekSelect,this);this._getCalendar().attachWeekNumberSelect(this._handleWeekSelect,this);this._getCalendar().getSelectedDates()[0].setStartDate(this._oDateRange.getStartDate());this._getCalendar().getSelectedDates()[0].setEndDate(this._oDateRange.getEndDate())};D.prototype.onkeypress=function(e){if(!e.charCode||e.metaKey||e.ctrlKey){return}var t=b.call(this);var a=S.call(this);var i=t.sAllowedCharacters+a+" ";var s=String.fromCharCode(e.charCode);if(s&&t.sAllowedCharacters&&i.indexOf(s)<0){e.preventDefault()}};D.prototype._getPlaceholder=function(){var t=this.getPlaceholder(),a,i,s,o,l;if(!t){a=this.getBinding("value");s=new r(e.getLanguageTag());o=n.getInstance(s);if(a&&a.getType()&&a.getType().isA("sap.ui.model.type.DateInterval")){i=a.getType();if(i.oFormatOptions&&i.oFormatOptions.format){t=o.getCustomDateTimePattern(i.oFormatOptions.format)}else{l=Object.assign({interval:true,singleIntervalValue:true},i.oFormatOptions);return this._getDateFormatPlaceholderText(l)}}else{t=this.getDisplayFormat();if(!t){t="medium"}if(this._checkStyle(t)){l=Object.assign({interval:true,singleIntervalValue:true,intervalDelimiter:S.call(this)},b.call(this).oFormatOptions);return this._getDateFormatPlaceholderText(l)}}var u=S.call(this);if(u&&u!==""){t=t+" "+u+" "+t}}return t};D.prototype._getDateFormatPlaceholderText=function(e){return o.getDateInstance(e).getPlaceholderText()};D.prototype.setValue=function(e){var t;e=this.validateProperty("value",e);if(e!==this.getValue()){this.setLastValue(e)}else{return this}t=this._parseAndValidateValue(e);this.setProperty("dateValue",this._normalizeDateValue(t[0]),this._bPreferUserInteraction);this.setProperty("secondDateValue",this._normalizeDateValue(t[1]),this._bPreferUserInteraction);this._formatValueAndUpdateOutput(t);this.setProperty("value",e,this._bPreferUserInteraction);return this};D.prototype._parseAndValidateValue=function(e){this._bValid=true;var t=[undefined,undefined];if(e){t=this._parseValue(e);if(!V.call(this,t[0],t[1])[0]){this._bValid=false;c.warning("Value can not be converted to a valid dates",this)}}return t};D.prototype._formatValueAndUpdateOutput=function(e){if(!this.getDomRef()){return}var t=this._formatValue(e[0],e[1]);if(this._bPreferUserInteraction){this.handleInputValueConcurrency(t)}else if(this._$input.val()!==t){this._$input.val(t);this._curpos=this._$input.cursorPos()}};D.prototype._normalizeDateValue=function(e){switch(typeof e){case"number":return d.getInstance(e);case"string":return b.call(this).parse(e);default:return e}};D.prototype._denormalizeDateValue=function(e){return e&&e.getTime?e.getTime():e};D.prototype.setValueFormat=function(e){this.setProperty("valueFormat",e,true);c.warning("Property valueFormat is not supported in sap.m.DateRangeSelection control.",this);return this};D.prototype.setDisplayFormat=function(e){a.prototype.setDisplayFormat.apply(this,arguments);var t=this._formatValue(this.getDateValue(),this.getSecondDateValue());this.setProperty("value",t,true);if(this.getDomRef()&&this._$input.val()!==t){this._$input.val(t);this._curpos=this._$input.cursorPos()}return this};D.prototype.setFrom=function(e){this.setDateValue(e);return this};D.prototype.getFrom=function(){return this.getDateValue()};D.prototype.setTo=function(e){this.setSecondDateValue(e);return this};D.prototype.getTo=function(){return this.getSecondDateValue()};D.prototype.setDateValue=function(e){if(!this._isValidDate(e)){throw new Error("Date must be a JavaScript or UI5Date date object; "+this)}if(p(this.getDateValue(),e)){return this}a.prototype._dateValidation.call(this,e);this._syncDateObjectsToValue(e,this.getSecondDateValue());return this};D.prototype.setSecondDateValue=function(e){if(!this._isValidDate(e)){throw new Error("Date must be a JavaScript or UI5Date date object; "+this)}if(p(this.getSecondDateValue(),e)){return this}this._bValid=true;if(e&&(e.getTime()<this._oMinDate.getTime()||e.getTime()>this._oMaxDate.getTime())){this._bValid=false;f(this._bValid,"Date must be in valid range")}this.setProperty("secondDateValue",e);this._syncDateObjectsToValue(this.getDateValue(),e);return this};D.prototype.setMinDate=function(e){a.prototype.setMinDate.apply(this,arguments);if(e){var t=this.getSecondDateValue();if(t&&t.getTime()<this._oMinDate.getTime()){c.warning("SecondDateValue not in valid date range",this)}}return this};D.prototype.setMaxDate=function(e){a.prototype.setMaxDate.apply(this,arguments);if(e){var t=this.getSecondDateValue();if(t&&t.getTime()>this._oMaxDate.getTime()){c.warning("SecondDateValue not in valid date range",this)}}return this};D.prototype._checkMinMaxDate=function(){a.prototype._checkMinMaxDate.apply(this,arguments);var e=this.getSecondDateValue();if(e&&(e.getTime()<this._oMinDate.getTime()||e.getTime()>this._oMaxDate.getTime())){c.error("secondDateValue "+e.toString()+"(value="+this.getValue()+") does not match "+"min/max date range("+this._oMinDate.toString()+" - "+this._oMaxDate.toString()+"). App. "+"developers should take care to maintain secondDateValue/value accordingly.",this)}};D.prototype._parseValue=function(e){var t;var a=[];var i,s;var r=this.getBinding("value");if(r&&r.getType()&&r.getType().isA("sap.ui.model.type.DateInterval")){try{a=r.getType().parseValue(e,"string")}catch(e){return[undefined,undefined]}if(r.getType().oFormatOptions&&r.getType().oFormatOptions.UTC){a=a.map(function(e){return d.getInstance(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate(),e.getUTCHours(),e.getUTCMinutes(),e.getUTCSeconds())})}return a}var n=S.call(this);if(n&&e){e=e.trim();e=F(e,[n," "]);a=this._splitValueByDelimiter(e,n);if(a.length===2){if(a[0].slice(a[0].length-1,a[0].length)==" "){a[0]=a[0].slice(0,a[0].length-1)}if(a[1].slice(0,1)==" "){a[1]=a[1].slice(1)}}else{a=e.split(" "+n+" ")}if(e.indexOf(n)===-1){var o=e.split(" ");if(o.length===2){a=o}}}if(e&&a.length<=2){t=b.call(this);if(!n||n===""||a.length===1){i=t.parse(e)}else if(a.length===2){i=t.parse(a[0]);s=t.parse(a[1]);if(!i||!s){i=undefined;s=undefined}}}return[i,s]};D.prototype._splitValueByDelimiter=function(e,t){var a=[_,m,y],i;if(t){if(a.indexOf(t)===-1){return e.split(t)}}for(i=0;i<a.length;i++){if(e.indexOf(a[i])>0){return e.split(a[i])}}return e?e.split(" "):[]};D.prototype._formatValue=function(e,t){var a="",i=S.call(this),s=b.call(this),r,n,o,l;o=e;l=t;if(o){r=this.getBinding("value");if(r&&r.getType()&&r.getType().isA("sap.ui.model.type.DateInterval")){if(r.getType().oFormatOptions&&r.getType().oFormatOptions.source&&r.getType().oFormatOptions.source.pattern==="timestamp"){a=r.getType().formatValue([this._denormalizeDateValue(e),this._denormalizeDateValue(t)],"string")}else{n=r.getType();if(n.oFormatOptions&&r.getType().oFormatOptions.UTC){o=d.getInstance(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds()));if(t){l=d.getInstance(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds()))}}if(n.oInputFormat&&typeof o==="object"){o=s.format(o)}if(n.oInputFormat&&typeof l==="object"){l=s.format(l)}a=r.getType().formatValue([o,l],"string")}}else{if(i&&i!==""&&l){a=s.format(o)+" "+i+" "+s.format(l)}else{a=s.format(o)}}}return a};D.prototype.onChange=function(){if(!this.getEditable()||!this.getEnabled()){return}var e=this._$input.val();var t=e;var a=[undefined,undefined];if(this.getShowFooter()&&this._oPopup&&!t){this._oPopup.getBeginButton().setEnabled(false)}this._bValid=true;if(t!=""){a=this._parseValue(t);a[0]=this._normalizeDateValue(a[0]);a[1]=this._normalizeDateValue(a[1]);a[1]&&a[1].setHours(23,59,59,999);a=V.call(this,a[0],a[1]);if(a[0]){t=this._formatValue(a[0],a[1])}else{this._bValid=false}}if(t!==this.getLastValue()){if(this.getDomRef()&&this._$input.val()!==t){this._$input.val(t);this._curpos=this._$input.cursorPos()}this.setLastValue(t);this.setProperty("value",t,true);if(this._bValid){this.setProperty("dateValue",this._normalizeDateValue(a[0]),true);this.setProperty("secondDateValue",this._normalizeDateValue(a[1]),true)}if(this._oPopup&&this._oPopup.isOpen()){var i=this.getDateValue();if(i){if(!this._oDateRange.getStartDate()||this._oDateRange.getStartDate().getTime()!==i.getTime()){this._oDateRange.setStartDate(d.getInstance(i.getTime()));this._getCalendar().focusDate(i)}}else{if(this._oDateRange.getStartDate()){this._oDateRange.setStartDate(undefined)}}var s=this.getSecondDateValue();if(s){if(!this._oDateRange.getEndDate()||this._oDateRange.getEndDate().getTime()!==s.getTime()){this._oDateRange.setEndDate(d.getInstance(s.getTime()));this._getCalendar().focusDate(s)}}else{if(this._oDateRange.getEndDate()){this._oDateRange.setEndDate(undefined)}}}v.call(this,this._bValid)}else if(e!==this.getLastValue()&&t===this.getLastValue()){if(this.getDomRef()&&this._$input.val()!==t){this._$input.val(t);this._curpos=this._$input.cursorPos()}}};D.prototype.updateDomValue=function(e){this._bCheckDomValue=true;e=typeof e=="undefined"?this._$input.val():e.toString();this._curpos=this._$input.cursorPos();var t=this._parseValue(e);e=this._formatValue(t[0],t[1]);if(this._bPreferUserInteraction){this.handleInputValueConcurrency(e)}else{if(this.isActive()&&this._$input.val()!==e){this._$input.val(e);this._$input.cursorPos(this._curpos)}}return this};D.prototype.onsapescape=function(e){var t=this.getLastValue(),a=this._parseValue(this._getInputValue(),true),i=this._formatValue(a[0],a[1],true);if(i!==t){e.setMarked();e.preventDefault();this.updateDomValue(t);this.onValueRevertedByEscape(t,i)}};D.prototype._fillDateRange=function(){a.prototype._fillDateRange.apply(this,arguments);var e=this.getSecondDateValue();if(e&&e.getTime()>=this._oMinDate.getTime()&&e.getTime()<=this._oMaxDate.getTime()){if(!this._oDateRange.getEndDate()||this._oDateRange.getEndDate().getTime()!==e.getTime()){this._oDateRange.setEndDate(d.getInstance(e.getTime()))}}else{if(this._oDateRange.getEndDate()){this._oDateRange.setEndDate(undefined)}}};D.prototype._selectDate=function(){var e=this._getCalendar().getSelectedDates();if(e.length>0){var a=e[0].getStartDate();var i=e[0].getEndDate();if(a&&i){var s=this.getDateValue();var r=this.getSecondDateValue();i.setHours(23,59,59,999);var n;if(!p(a,s)||!p(i,r)){if(p(i,r)){this.setDateValue(a)}else{this.setProperty("dateValue",a,true);this.setSecondDateValue(i)}n=this.getValue();v.call(this,true);if(t.system.desktop||!t.support.touch){this._curpos=n.length;this._$input.cursorPos(this._curpos)}}else if(!this._bValid){n=this._formatValue(a,i);if(n!=this._$input.val()){this._bValid=true;if(this.getDomRef()){this._$input.val(n)}v.call(this,true)}}this._oDateRange.setStartDate(this._getCalendar().getSelectedDates()[0].getStartDate());this._oDateRange.setEndDate(this._getCalendar().getSelectedDates()[0].getEndDate());this._oPopup.close()}}};D.prototype._handleCalendarSelect=function(){var e=this._getCalendar().getSelectedDates(),t=e[0].getStartDate(),a=e[0].getEndDate();if(this.getShowFooter()){this._oPopup.getBeginButton().setEnabled(!!(t&&a));return}this._selectDate()};D.prototype._handleWeekSelect=function(e){var t=e.getParameter("weekDays"),a=t.getStartDate(),i=t.getEndDate();if(!t){return}if(this.getShowFooter()){this._oPopup.getBeginButton().setEnabled(!!(a&&i));return}this._getCalendar().getSelectedDates()[0].setStartDate(a);this._getCalendar().getSelectedDates()[0].setEndDate(i);this._oDateRange.setStartDate(a);this._oDateRange.setEndDate(i);this._selectDate()};D.prototype.getAccessibilityInfo=function(){var e=this.getRenderer();var t=a.prototype.getAccessibilityInfo.apply(this,arguments);var i=this.getValue()||"";var r=this.getRequired()?s.getResourceBundleFor("sap.m").getText("ELEMENT_REQUIRED"):"";if(this._bValid){var n=this.getDateValue();if(n){i=this._formatValue(n,this.getSecondDateValue())}}t.type=s.getResourceBundleFor("sap.m").getText("ACC_CTR_TYPE_DATERANGEINPUT");t.description=[i||this._getPlaceholder(),e.getLabelledByAnnouncement(this),e.getDescribedByAnnouncement(this),r].join(" ").trim();return t};D.prototype._syncDateObjectsToValue=function(e,t){var a=this._formatValue(e,t);if(a!==this.getValue()){this.setLastValue(a)}this.setProperty("value",a);if(this.getDomRef()){var i=this._formatValue(e,t);if(this._$input.val()!==i){this._$input.val(i);this._curpos=this._$input.cursorPos()}}};function v(e){this.fireChangeEvent(this.getValue(),{from:this.getDateValue(),to:this.getSecondDateValue(),valid:e})}function V(e,t){var a,i;if(e&&e.getTime){a=e.getTime()}else if(typeof e==="number"){a=e}if(t&&t.getTime){i=t.getTime()}else if(typeof t==="number"){i=t}if(e&&t&&a>i){var s=e;e=t;t=s}if(e&&(a<this._oMinDate.getTime()||a>this._oMaxDate.getTime())||t&&(i<this._oMinDate.getTime()||i>this._oMaxDate.getTime())){return[undefined,undefined]}else{return[e,t]}}D.prototype._increaseDate=function(e,t){var a=this._$input.val(),i=this._parseValue(a),s=i[0]||null,r=i[1]||null,n,l,u,h,g,f,D;if(!s||!this.getEditable()||!this.getEnabled()){return}if(!V.call(this,s,r)[0]){c.warning("Value can not be converted to a valid dates or dates are outside of the min/max range",this);this._bValid=false;v.call(this,this._bValid);return}var _={interval:true,singleIntervalValue:true,intervalDelimiter:S.call(this)};_=this.getBinding("value")?Object.assign(_,this.getBinding("value").getType().oFormatOptions):Object.assign(_,b.call(this).oFormatOptions);var m=o.getDateInstance(_);a=m.format([s,r]);n=this._$input.cursorPos();l=s?m.format([s,null]).length:0;u=r?m.format([r,null]).length:0;h=a.length;g=n<=l+1;f=n>=h-u-1&&n<=h;if(g&&s){D=T.call(this,s,e,t);if(!p(this.getDateValue(),D.getJSDate())){this.setDateValue(d.getInstance(D.getTime()));this._curpos=n;this._$input.cursorPos(this._curpos);this.fireChangeEvent(this.getValue(),{valid:this._bValid})}}else if(f&&r){D=T.call(this,r,e,t);if(!p(this.getSecondDateValue(),D.getJSDate())){this.setSecondDateValue(d.getInstance(D.getTime()));this._curpos=n;this._$input.cursorPos(this._curpos);this.fireChangeEvent(this.getValue(),{valid:this._bValid})}}};function T(e,t,a){var i=this.getBinding("value"),s,r,n,o;if(i&&i.oType&&i.oType.oOutputFormat){s=i.oType.oOutputFormat.oFormatOptions.calendarType}else if(i&&i.oType&&i.oType.oFormat){s=i.oType.oFormat.oFormatOptions.calendarType}if(!s){s=this.getDisplayFormatType()}n=l.getInstance(d.getInstance(e.getTime()),s);o=n.getMonth();switch(a){case"day":n.setDate(n.getDate()+t);break;case"month":n.setMonth(n.getMonth()+t);r=(o+t)%12;if(r<0){r=12+r}while(n.getMonth()!=r){n.setDate(n.getDate()-1)}break;case"year":n.setFullYear(n.getFullYear()+t);while(n.getMonth()!=o){n.setDate(n.getDate()-1)}break;default:break}if(n.getTime()<this._oMinDate.getTime()){n=new l(this._oMinDate.getTime())}else if(n.getTime()>this._oMaxDate.getTime()){n=new l(this._oMaxDate.getTime())}return n}function S(){var t=this.getDelimiter();if(!t){if(!this._sLocaleDelimiter){var a=new r(e.getLanguageTag());var i=n.getInstance(a);var s=i.getIntervalPattern();var o=s.indexOf("{0}")+3;var l=s.indexOf("{1}");t=s.slice(o,l);if(t.length>1){if(t.slice(0,1)==" "){t=t.slice(1)}if(t.slice(t.length-1,t.length)==" "){t=t.slice(0,t.length-1)}}this._sLocaleDelimiter=t}else{t=this._sLocaleDelimiter}}return t}function b(){var e=this.getDisplayFormat()||"medium";var t;var a=this.getDisplayFormatType();if(e==this._sUsedDisplayPattern&&a==this._sUsedDisplayCalendarType){t=this._oDisplayFormat}else{if(this._checkStyle(e)){t=o.getInstance({style:e,strictParsing:true,calendarType:a})}else{t=o.getInstance({pattern:e,strictParsing:true,calendarType:a})}this._sUsedDisplayPattern=e;this._sUsedDisplayCalendarType=a;this._oDisplayFormat=t}return t}function P(e,t){return e&&t&&e.lastIndexOf(t)===e.length-t.length}function C(e,t){return e&&t&&e.indexOf(t)===0}function F(e,t){var a=0,i=t;if(!i){i=[" "]}while(a<i.length){if(P(e,i[a])){e=e.substring(0,e.length-i[a].length);a=0;continue}a++}a=0;while(a<i.length){if(C(e,i[a])){e=e.substring(i[a].length);a=0;continue}a++}return e}return D});
//# sourceMappingURL=DateRangeSelection.js.map