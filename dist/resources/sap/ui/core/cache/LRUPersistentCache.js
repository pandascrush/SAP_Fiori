/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/config","sap/base/Log","sap/ui/performance/Measurement","sap/ui/Global"],function(e,t,a,n){"use strict";var r={name:"LRUPersistentCache",logResolved:function(e){t.debug("Cache Manager: "+e+" completed successfully.")},defaultOptions:{databaseName:"ui5-cachemanager-db",_contentStoreName:"content-store",_metadataStoreName:"metadata-store",_metadataKey:"metadataKey"},_db:{},init:function(){this._metadata={};this._mru=-1;this._lru=-1;return g(this)},_destroy:function(){if(this._db.close){this._db.close()}this._metadata=null;this._ui5version=null},set:function(e,n){if(R(e)){t.warning("Cache Manager ignored 'set' for key ["+e+"]");return Promise.resolve()}if(e==null){return Promise.reject("Cache Manager does not accept undefined or null as key")}if(typeof n==="undefined"){return Promise.reject("Cache Manager does not accept undefined as value")}t.debug("Cache Manager LRUPersistentCache: adding item with key ["+e+"]...");var r=this,o="[sync ] fnSet: total[sync]  key ["+e+"]",i="[sync ] fnSet: txStart[sync]  key ["+e+"]",c="[sync ] fnSet: storeOpen[sync]  key ["+e+"]",u="[sync ] fnSet: putContent[sync]  key ["+e+"]",d="[sync ] fnSet: putMetadata[sync]  key ["+e+"]",l="[sync ] fnSet: serialize[sync]  key ["+e+"]";return new Promise(function f(m,_){a.start(o,"CM",s);var g,y,C,S,w;w=b(r._metadata);S=new p(e,n,typeof n,++r._mru,l,s).serialize();a.start(i,"CM",s);var P=r._db.transaction([r.defaultOptions._contentStoreName,r.defaultOptions._metadataStoreName],"readwrite");a.end(i);P.onerror=function(e){var a="Cache Manager cannot complete add/put transaction for entry with key: "+S.oData.key+". Details: "+L(e);t.error(a);r._metadata=w;M(r);_(a)};P.onabort=function(a){r._metadata=w;M(r);var o=v(r);if(D(a)&&o>0){t.warning("Cache Manager is trying to free some space to add/put new item");O(r,e,n).then(function(){t.debug("Cache Manager LRUPersistentCache: set completed after freeing space. ItemCount changed from "+o+" to "+v(r));m()},function(e){var a="Cache Manager LRUPersistentCache: set unsuccessful. Cannot free space to add/put entry. Details: "+e;t.error(a);_(a)})}else{var s="Cache Manager LRUPersistentCache: set failed: "+L(a);t.error(s);_(s)}};P.oncomplete=function(){t.debug("Cache Manager LRUPersistentCache: adding item with key ["+e+"]... done");m()};a.start(c,"CM",s);g=P.objectStore(r.defaultOptions._contentStoreName);C=P.objectStore(r.defaultOptions._metadataStoreName);a.end(c);a.start(u,"CM",s);y=g.put(S.oData,S.oData.key);a.end(u);a.end(o);y.onsuccess=function(){h(r,S);a.start(d,"CM",s);C.put(r._metadata,r.defaultOptions._metadataKey);a.end(d)};if(t.getLevel()>=t.Level.DEBUG){t.debug("Cache Manager LRUPersistentCache: measurements: "+o+": "+a.getMeasurement(o).duration+"; "+l+": "+a.getMeasurement(l).duration+"; "+i+": "+a.getMeasurement(i).duration+"; "+c+": "+a.getMeasurement(c).duration+"; "+u+": "+a.getMeasurement(u).duration+"; "+d+": "+a.getMeasurement(d).duration)}})},has:function(e){if(R(e)){t.warning("Cache Manager ignored 'has' for key ["+e+"]");return Promise.resolve(false)}return this.get(e).then(function(a){var n=typeof a!=="undefined";t.debug("Cache Manager: has key ["+e+"] returned "+n);return n})},_getCount:function(){return Promise.resolve(v(this))},_getAll:function(e){var t=this,a,n="[sync ] _getAll: deserialize";return new Promise(function(e,r){var s=[],i=t._db.transaction([t.defaultOptions._contentStoreName],"readonly"),c=i.objectStore(t.defaultOptions._contentStoreName);i.onerror=function(e){r(L(e))};i.oncomplete=function(t){e(s)};c.openCursor().onsuccess=function(e){var t=e.target.result;if(t&&t.value){a=new p(t.value,n,o).deserialize();s.push({key:a.oData.key,value:a.oData.value});t.continue()}}})},_loadMetaStructure:function(){var e=this;return new Promise(function(a,n){var r=e._db.transaction([e.defaultOptions._metadataStoreName],"readonly");r.onerror=function(e){if(!r.errorHandled){r.errorHandled=true;var a="Cache Manager cannot complete transaction for read metadata. Details: "+r.error;t.error(a);n(a)}};var o=r.objectStore(e.defaultOptions._metadataStoreName);try{var s=o.get(e.defaultOptions._metadataKey);s.onsuccess=function(n){e._metadata=s.result?s.result:C(e._ui5version);if(e._metadata.__ui5version!==e._ui5version){e.reset().then(a,function(e){t.error("Cannot reset the cache. Details:"+e);r.abort()})}else{if(!e._metadata.timestamps){e._metadata.timestamps={}}a()}};s.onerror=function(e){t.error("Cache Manager cannot complete transaction for read metadata items. Details: "+e.message);n(e.message)}}catch(a){t.error("Cache Manager cannot read metadata entries behind key: "+e.defaultOptions._metadataKey+". Details: "+a.message);n(a.message)}})},get:function(e){if(R(e)){t.warning("Cache Manager ignored 'get' for key ["+e+"]");return Promise.resolve()}return d(this,e)},del:function(e){if(R(e)){t.warning("Cache Manager ignored 'del' for key ["+e+"]");return Promise.resolve()}return u(this,e)},delWithFilters:function(e){var a=this,n=e||{};return new Promise(function(e,r){var o=b(a._metadata),s=a._db.transaction([a.defaultOptions._contentStoreName,a.defaultOptions._metadataStoreName],"readwrite"),i=s.objectStore(a.defaultOptions._contentStoreName),c=s.objectStore(a.defaultOptions._metadataStoreName),u=i.openCursor(),d=n.prefix||"";function l(){a._metadata=o;M(a)}function f(e){l();r(L(e))}s.onerror=f;s.onabort=f;s.oncomplete=function(t){e()};u.onsuccess=function(e){var r=e.target.result,o,s;if(!r){c.put(a._metadata,a.defaultOptions._metadataKey);return}o=r.value.key;if(o.indexOf(d)===0&&(!n.olderThan||!(o in a._metadata.timestamps)||a._metadata.timestamps[o]<=n.olderThan)){s=r.delete();s.onsuccess=function(){t.debug("Deleted "+o+"!");P(a,o)}}r.continue()}})},reset:function(){var e=this;return new Promise(function(a,r){var o,s,i,c,u;u=e._db.transaction([e.defaultOptions._contentStoreName,e.defaultOptions._metadataStoreName],"readwrite");u.onerror=u.onabort=function(e){if(!u.errorHandled){u.errorHandled=true;var a="Cache Manager LRUPersistentCache: transaction for reset() failed. Details: "+u.error;t.error(a);r(a)}};u.oncomplete=function(e){a()};o=u.objectStore(e.defaultOptions._contentStoreName);s=u.objectStore(e.defaultOptions._metadataStoreName);try{i=o.clear();i.onerror=function(){u.abort()};i.onsuccess=function(){c=s.clear();c.onerror=function(){u.abort()};c.onsuccess=function(){e._metadata=C(n.version);M(e)}}}catch(e){u.abort()}})}};var o="LRUPersistentCache,get",s="LRUPersistentCache,set",i=0;function c(e,a){var n;e._metadata.timestamps[a.oData.key]=Date.now();n=e._db.transaction([e.defaultOptions._contentStoreName,e.defaultOptions._metadataStoreName],"readwrite");n.onerror=n.onabort=function(e){t.warning("Cache Manager cannot persist the information about usage of an entry. This may lead to earlier removal of the entry if browser storage space is over. Details: "+n.error)};try{n.objectStore(e.defaultOptions._metadataStoreName).put(e._metadata,e.defaultOptions._metadataKey)}catch(e){t.warning("Cache Manager cannot persist the information about usage of an entry. This may lead to earlier removal of the entry if browser storage space is over. Details: "+e.message)}}function u(e,a){return new Promise(function(n,r){var o,s;o=e._db.transaction([e.defaultOptions._contentStoreName,e.defaultOptions._metadataStoreName],"readwrite");s=b(e._metadata);function i(n){e._metadata=s;M(e);var o="Cache Manager LRUPersistentCache: cannot delete item with key: "+a+". Details: "+L(n);t.error(o);r(o)}o.onerror=i;o.onabort=i;o.oncomplete=function(){if(v(e)===0){e._lru=-1;e._mru=-1;e._metadata=C(e._ui5version)}t.debug("Cache Manager LRUPersistentCache: item with key "+a+" deleted");n()};t.debug("Cache Manager LRUPersistentCache: deleting item ["+a+"]");var c=o.objectStore(e.defaultOptions._contentStoreName).delete(a);c.onsuccess=function(){t.debug("Cache Manager LRUPersistentCache: request for deleting item ["+a+"] is successful, updating metadata...");P(e,a);o.objectStore(e.defaultOptions._metadataStoreName).put(e._metadata,e.defaultOptions._metadataKey)}})}function d(e,n){if(e.getCounter===undefined){e.getCounter=0}e.getCounter++;var r="[sync ] fnGet"+e.getCounter+": total[sync]  key ["+n+"]",s="[sync ] fnGet"+e.getCounter+": txStart[sync]  key ["+n+"]",i="[sync ] fnGet"+e.getCounter+": storeOpen[sync]  key ["+n+"]",u="[sync ] fnGet"+e.getCounter+": access result[sync]  key ["+n+"]",d="[sync ] fnGet"+e.getCounter+": putMetadata[sync]  key ["+n+"]",l="[sync ] fnGet"+e.getCounter+": deserialize[sync]  key ["+n+"]",f="[sync ]  _instance.get",m="[sync ]  getRequest.onSuccess";t.debug("Cache Manager LRUPersistentCache: get for key ["+n+"]...");a.start(f,"CM",o);var _=new Promise(function f(_,g){var y,C,b,M;a.start(r,"CM",o);a.start(s,"CM",o);C=e._db.transaction([e.defaultOptions._contentStoreName,e.defaultOptions._metadataStoreName],"readwrite");a.end(s);C.onerror=function(e){var a="Cache Manager cannot complete delete transaction for entry with key: "+n+". Details: "+C.error;t.error(a);g(a)};try{a.start(i,"CM",o);b=C.objectStore(e.defaultOptions._contentStoreName).get(n);a.end(i);b.onsuccess=function(r){a.start(m,"CM",o);a.start(u,"CM",o);M=new p(b.result,l,o);a.end(u);I("Cache Manager LRUPersistentCache: accessing the result",n,u);if(M.oData){a.start(d,"CM",o);if(M.oData.lu!==e._mru){M.oData.lu=++e._mru;h(e,M)}c(e,M);a.end(d);y=M.deserialize().oData.value}a.end(m);t.debug("Cache Manager LRUPersistentCache: get for key ["+n+"]...done");_(y)};b.onerror=function(e){t.error("Cache Manager cannot get entry with key: "+n+". Details: "+e.message);g(e.message)}}catch(e){t.error("Cache Manager cannot get entry with key: "+n+". Details: "+e.message);g(e.message);return}a.end(r)});a.end(f);return _}function l(e){var a=S(e);if(a==undefined){var n="Cache Manager LRUPersistentCache: deleteItemAndUpdateMetadata cannot find item to delete";t.debug(n);return Promise.reject(n)}return m(e,a).then(function(){return Promise.resolve().then(function(){P(e,a);return f(e).then(function(){return a},function(){t.warning("Cache Manager LRUPersistentCache: Free space algorithm deleted item "+"but the metadata changes could not be persisted. This won't break the functionality.");return a})})})}function f(e){return new Promise(function(a,n){try{var r=e._db.transaction([e.defaultOptions._contentStoreName,e.defaultOptions._metadataStoreName],"readwrite");r.onerror=o;r.onabort=o;r.oncomplete=function(){t.debug("Cache Manager LRUPersistentCache: persistMetadata - metadata was successfully updated");a()};r.objectStore(e.defaultOptions._metadataStoreName).put(e._metadata,e.defaultOptions._metadataKey)}catch(e){o(null,e)}function o(e,a){var r="Cache Manager LRUPersistentCache: persistMetadata error - metadata was not successfully persisted. Details: "+L(e)+". Exception: "+(a?a.message:"");t.debug(r);n(r)}})}function m(e,a){return new Promise(function(n,r){var o=e._db.transaction([e.defaultOptions._contentStoreName,e.defaultOptions._metadataStoreName],"readwrite");function s(e){var n="Cache Manager LRUPersistentCache: internalDel cannot complete delete transaction for entry with key: "+a+". Details: "+L(e);t.warning(n);r(e)}o.onerror=s;o.onabort=s;o.oncomplete=function(){if(v(e)===0){e._lru=0;e._mru=0;e._metadata=C(e._ui5version)}t.debug("Cache Manager LRUPersistentCache: internalDel deleting item ["+a+"]...done");n()};t.debug("Cache Manager LRUPersistentCache: internalDel deleting item ["+a+"]...");o.objectStore(e.defaultOptions._contentStoreName).delete(a)})}function _(e,a,n){return new Promise(function(r,o){var i,c,u,d="[sync ] internalSet: serialize[sync]  key ["+a+"]";u=b(e._metadata);var l=new p(a,n,typeof n,++e._mru,d,s).serialize();t.debug("Cache Manager: LRUPersistentCache: internal set with parameters: key ["+l.oData.key+"], access index ["+l.oData.lu+"]");c=e._db.transaction([e.defaultOptions._contentStoreName,e.defaultOptions._metadataStoreName],"readwrite");c.onerror=f;c.onabort=f;function f(a){t.debug("Cache Manager: LRUPersistentCache: internal set failed. Details: "+L(a));e._metadata=u;M(e);o(a)}c.oncomplete=function(){t.debug("Cache Manager: LRUPersistentCache: Internal set transaction completed. ItemCount: "+v(e));r()};i=c.objectStore(e.defaultOptions._contentStoreName).put(l.oData,l.oData.key);i.onsuccess=function(){h(e,l);c.objectStore(e.defaultOptions._metadataStoreName).put(e._metadata,e.defaultOptions._metadataKey)}})}function h(e,a){if(e._metadata.__byKey__[a.oData.key]!=null){var n=e._metadata.__byKey__[a.oData.key];delete e._metadata.__byIndex__[n];t.debug("Cache Manager LRUPersistentCache: set/internalset - item already exists, so its indexes are updated")}e._metadata.__byIndex__[a.oData.lu]=a.oData.key;e._metadata.__byKey__[a.oData.key]=a.oData.lu;k(e)}function g(e){e._ui5version=n.version;return new Promise(function a(n,r){var o;t.debug("Cache Manager "+"_initIndexedDB started");function s(){try{o=window.indexedDB.open(e.defaultOptions.databaseName,1)}catch(e){t.error("Could not open Cache Manager database. Details: "+e.message);r(e.message)}}s();o.onerror=function(e){t.error("Could not initialize Cache Manager database. Details: "+e.message);r(e.error)};o.onsuccess=function(a){var s=x("init_onsuccess");e._db=o.result;e._db.onversionchange=function(e){if(!e.newVersion){e.target.close()}};e._loadMetaStructure().then(function(){t.debug("Cache Manager "+" metadataLoaded. Serialization support: "+N()+", resolving initIndexDb promise");n(e)},r);s.endSync()};o.onupgradeneeded=function(a){var n=a.target.result;n.onerror=function(e){t.error("Cache Manager error. Details: "+e.message);r(n.error)};try{var o=n.createObjectStore(e.defaultOptions._contentStoreName);n.createObjectStore(e.defaultOptions._metadataStoreName)}catch(e){t.error("Could not initialize Cache Manager object store. Details: "+e.message);throw e}o.createIndex("ui5version","ui5version",{unique:false})}})}function y(e,t,a,n){this.key=e;this.sOrigType=a;this.value=t;this.lu=n}function p(e,t,a,n,r,o){if(arguments.length===3){this.oData=e;this.sMeasureId=t;this.sMsrCat=a}else{this.oData=new y(e,t,a,n)}}p.prototype.deserialize=function(){if(N()&&this.oData.sOrigType==="object"){a.start(this.sMeasureId,this.sMeasureId,this.sMsrCat);this.oData.value=JSON.parse(this.oData.value);a.end(this.sMeasureId);I("Cache Manager LRUPersistentCache: de-serialization the result",this.oData.key,this.sMeasureId)}return this};p.prototype.serialize=function(){if(N()&&this.oData.sOrigType==="object"){a.start(this.sMeasureId,this.sMeasureId,this.sMsrCat);this.oData.value=JSON.stringify(this.oData.value);a.end(this.sMeasureId);I("Cache Manager LRUPersistentCache: serialization of the value",this.oData.key,this.sMeasureId)}return this};function C(e){return{timestamps:{},__byKey__:{},__byIndex__:{},__ui5version:e}}function b(e){var t=C(e.__ui5version);for(var a in e.__byIndex__){t.__byIndex__[a]=e.__byIndex__[a]}for(var n in e.__byKey__){t.__byKey__[n]=e.__byKey__[n]}for(var n in e.timestamps){t.timestamps[n]=e.timestamps[n]}return t}function M(e){var a=w(e._metadata.__byIndex__);e._mru=a.mru;e._lru=a.lru;t.debug("Cache Manager LRUPersistentCache: LRU counters are assigned to the CM: "+JSON.stringify(a))}function v(e){return Object.keys(e._metadata.__byKey__).length}function S(e){var t=e._metadata.__byIndex__[e._lru];if(t==undefined&&!k(e)){return null}else{return e._metadata.__byIndex__[e._lru]}}function w(e){var t=-1,a=-1,n=Number.MAX_VALUE,r=Object.keys(e),o=r.length;if(o===0){return{mru:-1,lru:-1}}else{while(++t<o){var s=parseInt(r[t]);if(a<s){a=s}if(n>s){n=s}}return{mru:a,lru:n}}}function O(e,a,n){return new Promise(function(r,o){var s=0;i(e,a,n);function i(e,a,n){s++;t.debug("Cache Manager LRUPersistentCache: cleanAndStore: freeing space attempt ["+s+"]");l(e).then(function(s){t.debug("Cache Manager LRUPersistentCache: cleanAndStore: deleted item with key ["+s+"]. Going to put "+a);return _(e,a,n).then(r,function(r){if(D(r)){t.debug("Cache Manager LRUPersistentCache: cleanAndStore: QuotaExceedError during freeing up space...");if(v(e)>0){i(e,a,n)}else{o("Cache Manager LRUPersistentCache: cleanAndStore: even when the cache is empty, the new item with key ["+a+"] cannot be added")}}else{o("Cache Manager LRUPersistentCache: cleanAndStore: cannot free space: "+L(r))}})},o)}})}function D(e){return e&&e.target&&e.target.error&&e.target.error.name==="QuotaExceededError"}function P(e,t){var a=e._metadata.__byKey__[t];delete e._metadata.__byKey__[t];delete e._metadata.__byIndex__[a];if(e._metadata.timestamps[t]){delete e._metadata.timestamps[t]}k(e)}function k(e){while(e._lru<=e._mru&&e._metadata.__byIndex__[e._lru]==undefined){e._lru++}return e._lru<=e._mru}function L(e){if(!e){return""}var t=e.message;if(e.target&&e.target.error&&e.target.error.name){t+=" Error name: "+e.target.error.name}return t}function N(){return e.get({name:"sapUiXxCacheSerialization",type:e.Type.Boolean,external:true})}function U(){return e.get({name:"sapUiXxCacheExcludedKeys",type:e.Type.StringArray,external:true})}function R(e){return U().some(function(t){return e.indexOf(t)>-1})}function x(e,t){i++;var n="[async]  "+e+"["+t+"]- #"+i,r="[sync ]  "+e+"["+t+"]- #"+i;a.start(n,"CM",["LRUPersistentCache",e]);a.start(r,"CM",["LRUPersistentCache",e]);return{sMeasureAsync:n,sMeasureSync:r,endAsync:function(){a.end(this.sMeasureAsync)},endSync:function(){a.end(this.sMeasureSync)}}}function I(e,n,r){if(t.getLevel()>=t.Level.DEBUG){t.debug(e+" for key ["+n+"] took: "+a.getMeasurement(r).duration)}}return r});
//# sourceMappingURL=LRUPersistentCache.js.map