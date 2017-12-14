/*1513157024,,JIT Construction: v3523568,en_US*/

/**
 * Copyright (c) 2017-present, Facebook, Inc. All rights reserved.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to use,
 * copy, modify, and distribute this software in source code or binary form for use
 * in connection with the web services and APIs provided by Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use of
 * this software is subject to the Facebook Platform Policy
 * [http://developers.facebook.com/policy/]. This copyright notice shall be
 * included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
try {window.FB|| (function(window, fb_fif_window) {  var apply = Function.prototype.apply;  function bindContext(fn, thisArg) {    return function _sdkBound() {      return apply.call(fn, thisArg, arguments);    };  }  var global = {    __type: 'JS_SDK_SANDBOX',    window: window,    document: window.document  };  var sandboxWhitelist = [    'setTimeout',    'setInterval',    'clearTimeout',    'clearInterval'  ];  for (var i = 0; i < sandboxWhitelist.length; i++) {    global[sandboxWhitelist[i]] = bindContext(      window[sandboxWhitelist[i]],      window    );  }  (function() {    var self = window;    var __DEV__ = 0;    function emptyFunction() {};    var __transform_includes = {};    var __annotator, __bodyWrapper;    var __w, __t;    var undefined;    var __p;    with (this) {      (function(){var a={},b=function b(i,j){if(!i&&!j)return null;var k={};if(typeof i!=="undefined")k.type=i;if(typeof j!=="undefined")k.signature=j;return k},c=function c(i,j){return b(i&&/^[A-Z]/.test(i)?i:undefined,j&&(j.params&&j.params.length||j.returns)?"function("+(j.params?j.params.map(function(k){return/\?/.test(k)?"?"+k.replace("?",""):k}).join(","):"")+")"+(j.returns?":"+j.returns:""):undefined)},d=function d(i,j,k){return i},e=function e(i,j,k){if("sourcemeta"in __transform_includes)i.__SMmeta=j;if("typechecks"in __transform_includes){var l=c(j?j.name:undefined,k);if(l)__w(i,l)}return i},f=function f(i,j,k){return k.apply(i,j)},g=function g(i,j,k,l){if(l&&l.params)__t.apply(i,l.params);var m=k.apply(i,j);if(l&&l.returns)__t([m,l.returns]);return m},h=function h(i,j,k,l,m){if(m){if(!m.callId)m.callId=m.module+":"+(m.line||0)+":"+(m.column||0);var n=m.callId;a[n]=(a[n]||0)+1}return k.apply(i,j)};if(typeof __transform_includes==="undefined"){__annotator=d;__bodyWrapper=f}else{__annotator=e;if("codeusage"in __transform_includes){__annotator=d;__bodyWrapper=h;__bodyWrapper.getCodeUsage=function(){return a};__bodyWrapper.clearCodeUsage=function(){a={}}}else if("typechecks"in __transform_includes)__bodyWrapper=g;else __bodyWrapper=f}})();
__t=function(a){return a[0]};__w=function(a){return a};
var require,__d;(function(a){var b={},c={},d=["global","require","requireDynamic","requireLazy","module","exports"];require=function(e,f){if(Object.prototype.hasOwnProperty.call(c,e))return c[e];if(!Object.prototype.hasOwnProperty.call(b,e)){if(f)return null;throw new Error("Module "+e+" has not been defined")}var g=b[e],h=g.deps,i=g.factory.length,j,k=[];for(var l=0;l<i;l++){switch(h[l]){case"module":j=g;break;case"exports":j=g.exports;break;case"global":j=a;break;case"require":j=require;break;case"requireDynamic":j=null;break;case"requireLazy":j=null;break;default:j=require.call(null,h[l])}k.push(j)}g.factory.apply(a,k);c[e]=g.exports;return g.exports};__d=function(e,f,g,h){if(typeof g=="function"){b[e]={factory:g,deps:d.concat(f),exports:{}};if(h===3)require.call(null,e)}else c[e]=g}})(this);
__d("ES5Array",[],(function a(b,c,d,e,f,g){var h={};h.isArray=function(i){return Object.prototype.toString.call(i)=="[object Array]"};f.exports=h}),null);
__d("ES5ArrayPrototype",[],(function a(b,c,d,e,f,g){__p&&__p();var h={};h.map=function(i,j){if(typeof i!="function")throw new TypeError();var k=void 0,l=this.length,m=new Array(l);for(k=0;k<l;++k)if(k in this)m[k]=i.call(j,this[k],k,this);return m};h.forEach=function(i,j){h.map.call(this,i,j)};h.filter=function(i,j){__p&&__p();if(typeof i!="function")throw new TypeError();var k=void 0,l=void 0,m=this.length,n=[];for(k=0;k<m;++k)if(k in this){l=this[k];if(i.call(j,l,k,this))n.push(l)}return n};h.every=function(i,j){if(typeof i!="function")throw new TypeError();var k=new Object(this),l=k.length;for(var m=0;m<l;m++)if(m in k)if(!i.call(j,k[m],m,k))return false;return true};h.some=function(i,j){if(typeof i!="function")throw new TypeError();var k=new Object(this),l=k.length;for(var m=0;m<l;m++)if(m in k)if(i.call(j,k[m],m,k))return true;return false};h.indexOf=function(i,j){var k=this.length;j|=0;if(j<0)j+=k;for(;j<k;j++)if(j in this&&this[j]===i)return j;return-1};f.exports=h}),null);
__d("ES5Date",[],(function a(b,c,d,e,f,g){var h={};h.now=function(){return new Date().getTime()};f.exports=h}),null);
__d("ES5FunctionPrototype",[],(function a(b,c,d,e,f,g){__p&&__p();var h={};h.bind=function(i){if(typeof this!="function")throw new TypeError("Bind must be called on a function");var j=this,k=Array.prototype.slice.call(arguments,1);function l(){return j.apply(i,k.concat(Array.prototype.slice.call(arguments)))}l.displayName="bound:"+(j.displayName||j.name||"(?)");l.toString=function m(){return"bound: "+j};return l};f.exports=h}),null);
__d("ie8DontEnum",[],(function a(b,c,d,e,f,g){var h=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","prototypeIsEnumerable","constructor"],i={}.hasOwnProperty,j=function j(){};if({toString:true}.propertyIsEnumerable("toString"))j=function j(k,l){for(var m=0;m<h.length;m++){var n=h[m];if(i.call(k,n))l(n)}};f.exports=j}),null);
__d("ES5Object",["ie8DontEnum"],(function a(b,c,d,e,f,g,h){__p&&__p();var i={}.hasOwnProperty,j={};function k(){}j.create=function(l){var m=typeof l;if(m!="object"&&m!="function")throw new TypeError("Object prototype may only be a Object or null");k.prototype=l;return new k()};j.keys=function(l){__p&&__p();var m=typeof l;if(m!="object"&&m!="function"||l===null)throw new TypeError("Object.keys called on non-object");var n=[];for(var o in l)if(i.call(l,o))n.push(o);h(l,function(p){return n.push(p)});return n};f.exports=j}),null);
__d("ES5StringPrototype",[],(function a(b,c,d,e,f,g){__p&&__p();var h={};h.trim=function(){if(this==null)throw new TypeError("String.prototype.trim called on null or undefined");return String.prototype.replace.call(this,/^\s+|\s+$/g,"")};h.startsWith=function(i){var j=String(this);if(this==null)throw new TypeError("String.prototype.startsWith called on null or undefined");var k=arguments.length>1?Number(arguments[1]):0;if(isNaN(k))k=0;var l=Math.min(Math.max(k,0),j.length);return j.indexOf(String(i),k)==l};h.endsWith=function(i){__p&&__p();var j=String(this);if(this==null)throw new TypeError("String.prototype.endsWith called on null or undefined");var k=j.length,l=String(i),m=arguments.length>1?Number(arguments[1]):k;if(isNaN(m))m=0;var n=Math.min(Math.max(m,0),k),o=n-l.length;if(o<0)return false;return j.lastIndexOf(l,o)==o};h.includes=function(i){if(this==null)throw new TypeError("String.prototype.contains called on null or undefined");var j=String(this),k=arguments.length>1?Number(arguments[1]):0;if(isNaN(k))k=0;return j.indexOf(String(i),k)!=-1};h.contains=h.includes;h.repeat=function(i){__p&&__p();if(this==null)throw new TypeError("String.prototype.repeat called on null or undefined");var j=String(this),k=i?Number(i):0;if(isNaN(k))k=0;if(k<0||k===Infinity)throw RangeError();if(k===1)return j;if(k===0)return"";var l="";while(k){if(k&1)l+=j;if(k>>=1)j+=j}return l};f.exports=h}),null);
__d("ES6Array",[],(function a(b,c,d,e,f,g){"use strict";__p&&__p();var h={from:function i(j){__p&&__p();if(j==null)throw new TypeError("Object is null or undefined");var k=arguments[1],l=arguments[2],m=this,n=Object(j),o=typeof Symbol==="function"?typeof Symbol==="function"?Symbol.iterator:"@@iterator":"@@iterator",p=typeof k==="function",q=typeof n[o]==="function",r=0,s=void 0,t=void 0;if(q){s=typeof m==="function"?new m():[];var u=n[o](),v=void 0;while(!(v=u.next()).done){t=v.value;if(p)t=k.call(l,t,r);s[r]=t;r+=1}s.length=r;return s}var w=n.length;if(isNaN(w)||w<0)w=0;s=typeof m==="function"?new m(w):new Array(w);while(r<w){t=n[r];if(p)t=k.call(l,t,r);s[r]=t;r+=1}s.length=r;return s}};f.exports=h}),null);
__d("ES6ArrayPrototype",[],(function a(b,c,d,e,f,g){__p&&__p();var h={find:function i(j,k){if(this==null)throw new TypeError("Array.prototype.find called on null or undefined");if(typeof j!=="function")throw new TypeError("predicate must be a function");var l=h.findIndex.call(this,j,k);return l===-1?void 0:this[l]},findIndex:function i(j,k){if(this==null)throw new TypeError("Array.prototype.findIndex called on null or undefined");if(typeof j!=="function")throw new TypeError("predicate must be a function");var l=Object(this),m=l.length>>>0;for(var n=0;n<m;n++)if(j.call(k,l[n],n,l))return n;return-1},fill:function i(j){if(this==null)throw new TypeError("Array.prototype.fill called on null or undefined");var k=Object(this),l=k.length>>>0,m=arguments[1],n=m>>0,o=n<0?Math.max(l+n,0):Math.min(n,l),p=arguments[2],q=p===undefined?l:p>>0,r=q<0?Math.max(l+q,0):Math.min(q,l);while(o<r){k[o]=j;o++}return k}};f.exports=h}),null);
__d("ES6DatePrototype",[],(function a(b,c,d,e,f,g){function h(j){return(j<10?"0":"")+j}var i={toISOString:function j(){if(!isFinite(this))throw new Error("Invalid time value");var k=this.getUTCFullYear();k=(k<0?"-":k>9999?"+":"")+("00000"+Math.abs(k)).slice(0<=k&&k<=9999?-4:-6);return k+"-"+h(this.getUTCMonth()+1)+"-"+h(this.getUTCDate())+"T"+h(this.getUTCHours())+":"+h(this.getUTCMinutes())+":"+h(this.getUTCSeconds())+"."+(this.getUTCMilliseconds()/1e3).toFixed(3).slice(2,5)+"Z"}};f.exports=i}),null);
__d("ES6Number",[],(function a(b,c,d,e,f,g){__p&&__p();var h=Math.pow(2,-52),i=Math.pow(2,53)-1,j=-1*i,k={isFinite:function(l){function m(n){return l.apply(this,arguments)}m.toString=function(){return l.toString()};return m}(function(l){return typeof l=="number"&&isFinite(l)}),isNaN:function(l){function m(n){return l.apply(this,arguments)}m.toString=function(){return l.toString()};return m}(function(l){return typeof l=="number"&&isNaN(l)}),isInteger:function l(m){return this.isFinite(m)&&Math.floor(m)===m},isSafeInteger:function l(m){return this.isFinite(m)&&m>=this.MIN_SAFE_INTEGER&&m<=this.MAX_SAFE_INTEGER&&Math.floor(m)===m},EPSILON:h,MAX_SAFE_INTEGER:i,MIN_SAFE_INTEGER:j};f.exports=k}),null);
__d("ES6Object",["ie8DontEnum"],(function a(b,c,d,e,f,g,h){__p&&__p();var i={}.hasOwnProperty,j={assign:function k(l){__p&&__p();if(l==null)throw new TypeError("Object.assign target cannot be null or undefined");l=Object(l);for(var m=arguments.length,n=Array(m>1?m-1:0),o=1;o<m;o++)n[o-1]=arguments[o];for(var p=0;p<n.length;p++){var q=n[p];if(q==null)continue;q=Object(q);for(var r in q)if(i.call(q,r))l[r]=q[r];h(q,function(r){return l[r]=q[r]})}return l},is:function k(l,m){if(l===m)return l!==0||1/l===1/m;else return l!==l&&m!==m}};f.exports=j}),null);
__d("ES7ArrayPrototype",["ES5ArrayPrototype","ES5Array"],(function a(b,c,d,e,f,g,h,i){__p&&__p();var j=h.indexOf,k=i.isArray;function l(p){return Math.min(Math.max(m(p),0),Number.MAX_SAFE_INTEGER)}function m(p){var q=Number(p);return isFinite(q)&&q!==0?n(q)*Math.floor(Math.abs(q)):q}function n(p){return p>=0?1:-1}var o={includes:function p(q){"use strict";__p&&__p();if(q!==undefined&&k(this)&&!(typeof q==="number"&&isNaN(q)))return j.apply(this,arguments)!==-1;var r=Object(this),s=r.length?l(r.length):0;if(s===0)return false;var t=arguments.length>1?m(arguments[1]):0,u=t<0?Math.max(s+t,0):t,v=isNaN(q)&&typeof q==="number";while(u<s){var w=r[u];if(w===q||typeof w==="number"&&v&&isNaN(w))return true;u++}return false}};f.exports=o}),null);
__d("ES7Object",["ie8DontEnum"],(function a(b,c,d,e,f,g,h){__p&&__p();var i={}.hasOwnProperty,j={};j.entries=function(k){if(k==null)throw new TypeError("Object.entries called on non-object");var l=[];for(var m in k)if(i.call(k,m))l.push([m,k[m]]);h(k,function(n){return l.push([n,k[n]])});return l};j.values=function(k){if(k==null)throw new TypeError("Object.values called on non-object");var l=[];for(var m in k)if(i.call(k,m))l.push(k[m]);h(k,function(n){return l.push(k[n])});return l};f.exports=j}),null);
__d("ES7StringPrototype",[],(function a(b,c,d,e,f,g){var h={};h.trimLeft=function(){return this.replace(/^\s+/,"")};h.trimRight=function(){return this.replace(/\s+$/,"")};f.exports=h}),null);
/**
 * License: https://www.facebook.com/legal/license/lxO6Ayo2tdy/
 */
__d("json3-3.3.2",[],(function aa(ba,ca,da,ea,fa,a){"use strict";__p&&__p();var b={},c={exports:b},d;function ga(){__p&&__p();(function(){__p&&__p();var e=typeof d==="function"&&d.amd,f={"function":true,object:true},g=f[typeof b]&&b&&!b.nodeType&&b,h=f[typeof window]&&window||this,i=g&&f[typeof c]&&c&&!c.nodeType&&typeof ba=="object"&&ba;if(i&&(i.global===i||i.window===i||i.self===i))h=i;function j(m,a){__p&&__p();m||(m=h.Object());a||(a=h.Object());var ma=m.Number||h.Number,na=m.String||h.String,oa=m.Object||h.Object,n=m.Date||h.Date,pa=m.SyntaxError||h.SyntaxError,qa=m.TypeError||h.TypeError,ra=m.Math||h.Math,k=m.JSON||h.JSON;if(typeof k=="object"&&k){a.stringify=k.stringify;a.parse=k.parse}var sa=oa.prototype,o=sa.toString,p,q,r,s=new n(-3509827334573292);try{s=s.getUTCFullYear()==-109252&&s.getUTCMonth()===0&&s.getUTCDate()===1&&s.getUTCHours()==10&&s.getUTCMinutes()==37&&s.getUTCSeconds()==6&&s.getUTCMilliseconds()==708}catch(t){}function u(J){__p&&__p();if(u[J]!==r)return u[J];var K;if(J=="bug-string-char-index")K="a"[0]!="a";else if(J=="json")K=u("json-stringify")&&u("json-parse");else{var L,M='{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';if(J=="json-stringify"){var N=a.stringify,O=typeof N=="function"&&s;if(O){(L=function(){return 1}).toJSON=L;try{O=N(0)==="0"&&N(new ma())==="0"&&N(new na())=='""'&&N(o)===r&&N(r)===r&&N()===r&&N(L)==="1"&&N([L])=="[1]"&&N([r])=="[null]"&&N(null)=="null"&&N([r,o,null])=="[null,null,null]"&&N({a:[L,true,false,null,"\0\b\n\f\r\t"]})==M&&N(null,L)==="1"&&N([1,2],null,1)=="[\n 1,\n 2\n]"&&N(new n(-864e13))=='"-271821-04-20T00:00:00.000Z"'&&N(new n(864e13))=='"+275760-09-13T00:00:00.000Z"'&&N(new n(-621987552e5))=='"-000001-01-01T00:00:00.000Z"'&&N(new n(-1))=='"1969-12-31T23:59:59.999Z"'}catch(t){O=false}}K=O}if(J=="json-parse"){var P=a.parse;if(typeof P=="function")try{if(P("0")===0&&!P(false)){L=P(M);var Q=L.a.length==5&&L.a[0]===1;if(Q){try{Q=!P('"\t"')}catch(t){}if(Q)try{Q=P("01")!==1}catch(t){}if(Q)try{Q=P("1.")!==1}catch(t){}}}}catch(t){Q=false}K=Q}}return u[J]=!!K}if(!u("json")){var v="[object Function]",ta="[object Date]",w="[object Number]",x="[object String]",y="[object Array]",ua="[object Boolean]",z=u("bug-string-char-index");if(!s)var A=ra.floor,va=[0,31,59,90,120,151,181,212,243,273,304,334],B=function(J,K){return va[K]+365*(J-1970)+A((J-1969+(K=+(K>1)))/4)-A((J-1901+K)/100)+A((J-1601+K)/400)};if(!(p=sa.hasOwnProperty))p=function(J){__p&&__p();var K={},L;if((K.__proto__=null,K.__proto__={toString:1},K).toString!=o)p=function(J){var M=this.__proto__,N=J in(this.__proto__=null,this);this.__proto__=M;return N};else{L=K.constructor;p=function(J){var M=(this.constructor||L).prototype;return J in this&&!(J in M&&this[J]===M[J])}}K=null;return p.call(this,J)};q=function(J,K){__p&&__p();var L=0,M,N,O;(M=function(){this.valueOf=0}).prototype.valueOf=0;N=new M();for(O in N)if(p.call(N,O))L++;M=N=null;if(!L){N=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"];q=function(J,K){var P=o.call(J)==v,O,Q,R=!P&&typeof J.constructor!="function"&&f[typeof J.hasOwnProperty]&&J.hasOwnProperty||p;for(O in J)if(!(P&&O=="prototype")&&R.call(J,O))K(O);for(Q=N.length;O=N[--Q];R.call(J,O)&&K(O));}}else if(L==2)q=function(J,K){var N={},P=o.call(J)==v,O;for(O in J)if(!(P&&O=="prototype")&&!p.call(N,O)&&(N[O]=1)&&p.call(J,O))K(O)};else q=function(J,K){var P=o.call(J)==v,O,Q;for(O in J)if(!(P&&O=="prototype")&&p.call(J,O)&&!(Q=O==="constructor"))K(O);if(Q||p.call(J,O="constructor"))K(O)};return q(J,K)};if(!u("json-stringify")){var wa={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"},xa="000000",C=function(J,K){return(xa+(K||0)).slice(-J)},ya="\\u00",za=function(J){__p&&__p();var K='"',L=0,M=J.length,N=!z||M>10,O=N&&(z?J.split(""):J);for(;L<M;L++){var P=J.charCodeAt(L);switch(P){case 8:case 9:case 10:case 12:case 13:case 34:case 92:K+=wa[P];break;default:if(P<32){K+=ya+C(2,P.toString(16));break}K+=N?O[L]:J.charAt(L)}}return K+'"'},D=function(J,K,L,M,N,O,P){__p&&__p();var Q,R,S,T,U,V,W,Ea,Fa,Ga,X,Y,Z,$,Ha,Ia;try{Q=K[J]}catch(t){}if(typeof Q=="object"&&Q){R=o.call(Q);if(R==ta&&!p.call(Q,"toJSON"))if(Q>-1/0&&Q<1/0){if(B){U=A(Q/864e5);for(S=A(U/365.2425)+1970-1;B(S+1,0)<=U;S++);for(T=A((U-B(S,0))/30.42);B(S,T+1)<=U;T++);U=1+U-B(S,T);V=(Q%864e5+864e5)%864e5;W=A(V/36e5)%24;Ea=A(V/6e4)%60;Fa=A(V/1e3)%60;Ga=V%1e3}else{S=Q.getUTCFullYear();T=Q.getUTCMonth();U=Q.getUTCDate();W=Q.getUTCHours();Ea=Q.getUTCMinutes();Fa=Q.getUTCSeconds();Ga=Q.getUTCMilliseconds()}Q=(S<=0||S>=1e4?(S<0?"-":"+")+C(6,S<0?-S:S):C(4,S))+"-"+C(2,T+1)+"-"+C(2,U)+"T"+C(2,W)+":"+C(2,Ea)+":"+C(2,Fa)+"."+C(3,Ga)+"Z"}else Q=null;else if(typeof Q.toJSON=="function"&&(R!=w&&R!=x&&R!=y||p.call(Q,"toJSON")))Q=Q.toJSON(J)}if(L)Q=L.call(K,J,Q);if(Q===null)return"null";R=o.call(Q);if(R==ua)return""+Q;else if(R==w)return Q>-1/0&&Q<1/0?""+Q:"null";else if(R==x)return za(""+Q);if(typeof Q=="object"){for($=P.length;$--;)if(P[$]===Q)throw qa();P.push(Q);X=[];Ha=O;O+=N;if(R==y){for(Z=0,$=Q.length;Z<$;Z++){Y=D(Z,Q,L,M,N,O,P);X.push(Y===r?"null":Y)}Ia=X.length?N?"[\n"+O+X.join(",\n"+O)+"\n"+Ha+"]":"["+X.join(",")+"]":"[]"}else{q(M||Q,function(J){var Y=D(J,Q,L,M,N,O,P);if(Y!==r)X.push(za(J)+":"+(N?" ":"")+Y)});Ia=X.length?N?"{\n"+O+X.join(",\n"+O)+"\n"+Ha+"}":"{"+X.join(",")+"}":"{}"}P.pop();return Ia}};a.stringify=function(J,K,L){__p&&__p();var M,N,O,P;if(f[typeof K]&&K)if((P=o.call(K))==v)N=K;else if(P==y){O={};for(var Q=0,R=K.length,S;Q<R;S=K[Q++],(P=o.call(S),P==x||P==w)&&(O[S]=1));}if(L)if((P=o.call(L))==w){if((L-=L%1)>0)for(M="",L>10&&(L=10);M.length<L;M+=" ");}else if(P==x)M=L.length<=10?L:L.slice(0,10);return D("",(S={},S[""]=J,S),N,O,M,"",[])}}if(!u("json-parse")){var Aa=na.fromCharCode,Ba={92:"\\",34:'"',47:"/",98:"\b",116:"\t",110:"\n",102:"\f",114:"\r"},E,F,G=function(){E=F=null;throw pa()},H=function(){__p&&__p();var J=F,K=J.length,L,M,N,O,P;while(E<K){P=J.charCodeAt(E);switch(P){case 9:case 10:case 13:case 32:E++;break;case 123:case 125:case 91:case 93:case 58:case 44:L=z?J.charAt(E):J[E];E++;return L;case 34:for(L="@",E++;E<K;){P=J.charCodeAt(E);if(P<32)G();else if(P==92){P=J.charCodeAt(++E);switch(P){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:L+=Ba[P];E++;break;case 117:M=++E;for(N=E+4;E<N;E++){P=J.charCodeAt(E);if(!(P>=48&&P<=57||P>=97&&P<=102||P>=65&&P<=70))G()}L+=Aa("0x"+J.slice(M,E));break;default:G()}}else{if(P==34)break;P=J.charCodeAt(E);M=E;while(P>=32&&P!=92&&P!=34)P=J.charCodeAt(++E);L+=J.slice(M,E)}}if(J.charCodeAt(E)==34){E++;return L}G();default:M=E;if(P==45){O=true;P=J.charCodeAt(++E)}if(P>=48&&P<=57){if(P==48&&(P=J.charCodeAt(E+1),P>=48&&P<=57))G();O=false;for(;E<K&&(P=J.charCodeAt(E),P>=48&&P<=57);E++);if(J.charCodeAt(E)==46){N=++E;for(;N<K&&(P=J.charCodeAt(N),P>=48&&P<=57);N++);if(N==E)G();E=N}P=J.charCodeAt(E);if(P==101||P==69){P=J.charCodeAt(++E);if(P==43||P==45)E++;for(N=E;N<K&&(P=J.charCodeAt(N),P>=48&&P<=57);N++);if(N==E)G();E=N}return+J.slice(M,E)}if(O)G();if(J.slice(E,E+4)=="true"){E+=4;return true}else if(J.slice(E,E+5)=="false"){E+=5;return false}else if(J.slice(E,E+4)=="null"){E+=4;return null}G()}}return"$"},I=function(J){__p&&__p();var K,L;if(J=="$")G();if(typeof J=="string"){if((z?J.charAt(0):J[0])=="@")return J.slice(1);if(J=="["){K=[];for(;;L||(L=true)){J=H();if(J=="]")break;if(L)if(J==","){J=H();if(J=="]")G()}else G();if(J==",")G();K.push(I(J))}return K}else if(J=="{"){K={};for(;;L||(L=true)){J=H();if(J=="}")break;if(L)if(J==","){J=H();if(J=="}")G()}else G();if(J==","||typeof J!="string"||(z?J.charAt(0):J[0])!="@"||H()!=":")G();K[J.slice(1)]=I(H())}return K}G()}return J},Ca=function(J,K,L){var M=Da(J,K,L);if(M===r)delete J[K];else J[K]=M},Da=function(J,K,L){var M=J[K],N;if(typeof M=="object"&&M)if(o.call(M)==y)for(N=M.length;N--;)Ca(M,N,L);else q(M,function(K){Ca(M,K,L)});return L.call(J,K,M)};a.parse=function(J,K){var L,M;E=0;F=""+J;L=I(H());if(H()!="$")G();E=F=null;return K&&o.call(K)==v?Da((M={},M[""]=L,M),"",K):L}}}a.runInContext=j;return a}if(g&&!e)j(h,g);else{var k=h.JSON,ka=h.JSON3,la=false,l=j(h,h.JSON3={noConflict:function(){if(!la){la=true;h.JSON=k;h.JSON3=ka;k=ka=null}return l}});h.JSON={parse:l.parse,stringify:l.stringify}}if(e)d(function(){return l})}).call(this)}var ha=false,ia=function(){if(!ha){ha=true;ga()}return c.exports},ja=function(e){switch(e){case undefined:return ia()}};fa.exports=ja}),null);
__d("json3",["json3-3.3.2"],(function a(b,c,d,e,f,g){f.exports=c("json3-3.3.2")()}),null);
__d("ES",["json3","ES5ArrayPrototype","ES5FunctionPrototype","ES5StringPrototype","ES5Array","ES5Object","ES5Date","ES6Array","ES6Object","ES6ArrayPrototype","ES6DatePrototype","ES6Number","ES7StringPrototype","ES7Object","ES7ArrayPrototype"],(function a(b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v){__p&&__p();var w={}.toString,x={"JSON.stringify":h.stringify,"JSON.parse":h.parse},y={"Array.prototype":i,"Function.prototype":j,"String.prototype":k,Object:m,Array:l,Date:n},z={Object:p,"Array.prototype":q,"Date.prototype":r,Number:s,Array:o},A={Object:u,"String.prototype":t,"Array.prototype":v};function B(D){__p&&__p();for(var E in D){if(!Object.prototype.hasOwnProperty.call(D,E))continue;var F=D[E],G=E.split(".");if(G.length===2){var H=G[0],I=G[1];if(!H||!I||!window[H]||!window[H][I]){var J=H?window[H]:"-",K=H&&window[H]&&I?window[H][I]:"-";throw new Error("Unexpected state (t11975770): "+(H+", "+I+", "+J+", "+K+", "+E))}}var L=G.length===2?window[G[0]][G[1]]:window[E];for(var M in F){if(!Object.prototype.hasOwnProperty.call(F,M))continue;if(typeof F[M]!=="function"){x[E+"."+M]=F[M];continue}var N=L[M];x[E+"."+M]=N&&/\{\s+\[native code\]\s\}/.test(N)?N:F[M]}}}B(y);B(z);B(A);function C(D,E,F){var G=F?w.call(D).slice(8,-1)+".prototype":D,H=x[G+"."+E]||D[E];if(typeof H==="function"){for(var I=arguments.length,J=Array(I>3?I-3:0),K=3;K<I;K++)J[K-3]=arguments[K];return H.apply(D,J)}else if(H)return H;throw new Error("Polyfill "+G+" does not have implementation of "+E)}f.exports=C}),null);
__d("ES5FunctionPrototype",[],(function a(b,c,d,e,f,g){__p&&__p();var h={};h.bind=function(i){if(typeof this!="function")throw new TypeError("Bind must be called on a function");var j=this,k=Array.prototype.slice.call(arguments,1);function l(){return j.apply(i,k.concat(Array.prototype.slice.call(arguments)))}l.displayName="bound:"+(j.displayName||j.name||"(?)");l.toString=function m(){return"bound: "+j};return l};f.exports=h}),null);
__d("ie8DontEnum",[],(function a(b,c,d,e,f,g){var h=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","prototypeIsEnumerable","constructor"],i={}.hasOwnProperty,j=function j(){};if({toString:true}.propertyIsEnumerable("toString"))j=function j(k,l){for(var m=0;m<h.length;m++){var n=h[m];if(i.call(k,n))l(n)}};f.exports=j}),null);
__d("ES5Object",["ie8DontEnum"],(function a(b,c,d,e,f,g,h){__p&&__p();var i={}.hasOwnProperty,j={};function k(){}j.create=function(l){var m=typeof l;if(m!="object"&&m!="function")throw new TypeError("Object prototype may only be a Object or null");k.prototype=l;return new k()};j.keys=function(l){__p&&__p();var m=typeof l;if(m!="object"&&m!="function"||l===null)throw new TypeError("Object.keys called on non-object");var n=[];for(var o in l)if(i.call(l,o))n.push(o);h(l,function(p){return n.push(p)});return n};f.exports=j}),null);
__d("ES6Object",["ie8DontEnum"],(function a(b,c,d,e,f,g,h){__p&&__p();var i={}.hasOwnProperty,j={assign:function k(l){__p&&__p();if(l==null)throw new TypeError("Object.assign target cannot be null or undefined");l=Object(l);for(var m=arguments.length,n=Array(m>1?m-1:0),o=1;o<m;o++)n[o-1]=arguments[o];for(var p=0;p<n.length;p++){var q=n[p];if(q==null)continue;q=Object(q);for(var r in q)if(i.call(q,r))l[r]=q[r];h(q,function(r){return l[r]=q[r]})}return l},is:function k(l,m){if(l===m)return l!==0||1/l===1/m;else return l!==l&&m!==m}};f.exports=j}),null);
__d("sdk.babelHelpers",["ES5FunctionPrototype","ES5Object","ES6Object"],(function a(b,c,d,e,f,g,h,i,j){__p&&__p();var k={},l=Object.prototype.hasOwnProperty;k.inherits=function(m,n){j.assign(m,n);m.prototype=i.create(n&&n.prototype);m.prototype.constructor=m;m.__superConstructor__=n;return n};k._extends=j.assign;k["extends"]=k._extends;k.objectWithoutProperties=function(m,n){var o={};for(var p in m){if(!l.call(m,p)||n.indexOf(p)>=0)continue;o[p]=m[p]}return o};k.taggedTemplateLiteralLoose=function(m,n){m.raw=n;return m};k.bind=h.bind;f.exports=k}),null);      var ES = require('ES');      var babelHelpers = require('sdk.babelHelpers');      (function(a,b){var c="keys",d="values",e="entries",f=function(){var l=h(Array),m=void 0;if(!l)m=function(){function m(n,o){"use strict";this.$ArrayIterator1=n;this.$ArrayIterator2=o;this.$ArrayIterator3=0}m.prototype.next=function(){"use strict";if(this.$ArrayIterator1==null)return{value:b,done:true};var n=this.$ArrayIterator1,o=this.$ArrayIterator1.length,p=this.$ArrayIterator3,q=this.$ArrayIterator2;if(p>=o){this.$ArrayIterator1=b;return{value:b,done:true}}this.$ArrayIterator3=p+1;if(q===c)return{value:p,done:false};else if(q===d)return{value:n[p],done:false};else if(q===e)return{value:[p,n[p]],done:false}};m.prototype[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]=function(){"use strict";return this};return m}();return{keys:l?function(n){return n.keys()}:function(n){return new m(n,c)},values:l?function(n){return n.values()}:function(n){return new m(n,d)},entries:l?function(n){return n.entries()}:function(n){return new m(n,e)}}}(),g=function(){var l=h(String),m=void 0;if(!l)m=function(){function m(n){"use strict";this.$StringIterator1=n;this.$StringIterator2=0}m.prototype.next=function(){"use strict";if(this.$StringIterator1==null)return{value:b,done:true};var n=this.$StringIterator2,o=this.$StringIterator1,p=o.length;if(n>=p){this.$StringIterator1=b;return{value:b,done:true}}var q=void 0,r=o.charCodeAt(n);if(r<55296||r>56319||n+1===p)q=o[n];else{var s=o.charCodeAt(n+1);if(s<56320||s>57343)q=o[n];else q=o[n]+o[n+1]}this.$StringIterator2=n+q.length;return{value:q,done:false}};m.prototype[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]=function(){"use strict";return this};return m}();return{keys:function n(){throw TypeError("Strings default iterator doesn't implement keys.")},values:l?function(n){return n[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]()}:function(n){return new m(n)},entries:function n(){throw TypeError("Strings default iterator doesn't implement entries.")}}}();function h(l){return typeof l.prototype[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]==="function"&&typeof l.prototype.values==="function"&&typeof l.prototype.keys==="function"&&typeof l.prototype.entries==="function"}function i(l,m){"use strict";this.$ObjectIterator1=l;this.$ObjectIterator2=m;this.$ObjectIterator3=ES("Object","keys",false,l);this.$ObjectIterator4=0}i.prototype.next=function(){"use strict";var l=this.$ObjectIterator3.length,m=this.$ObjectIterator4,n=this.$ObjectIterator2,o=this.$ObjectIterator3[m];if(m>=l){this.$ObjectIterator1=b;return{value:b,done:true}}this.$ObjectIterator4=m+1;if(n===c)return{value:o,done:false};else if(n===d)return{value:this.$ObjectIterator1[o],done:false};else if(n===e)return{value:[o,this.$ObjectIterator1[o]],done:false}};i.prototype[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]=function(){"use strict";return this};var j={keys:function l(m){return new i(m,c)},values:function l(m){return new i(m,d)},entries:function l(m){return new i(m,e)}};function k(l,m){if(typeof l==="string")return g[m||d](l);else if(ES("Array","isArray",false,l))return f[m||d](l);else if(l[typeof Symbol==="function"?Symbol.iterator:"@@iterator"])return l[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();else return j[m||e](l)}ES("Object","assign",false,k,{KIND_KEYS:c,KIND_VALUES:d,KIND_ENTRIES:e,keys:function l(m){return k(m,c)},values:function l(m){return k(m,d)},entries:function l(m){return k(m,e)},generic:j.entries});a.FB_enumerate=k})(typeof global==="undefined"?this:global);
(function(a,b){var c=a.window||a;function d(){return"f"+(Math.random()*(1<<30)).toString(16).replace(".","")}function e(j){var k=j?j.ownerDocument||j:document,l=k.defaultView||c;return!!(j&&(typeof l.Node==="function"?j instanceof l.Node:typeof j==="object"&&typeof j.nodeType==="number"&&typeof j.nodeName==="string"))}function f(j){var k=c[j];if(k==null)return true;if(typeof c.Symbol!=="function")return true;var l=k.prototype;return k==null||typeof k!=="function"||typeof l.clear!=="function"||new k().size!==0||typeof l.keys!=="function"||typeof l.forEach!=="function"}var g=a.FB_enumerate,h=function(){if(!f("Map"))return c.Map;var j="key",k="value",l="key+value",m="$map_",n=void 0,o="IE_HASH_";function h(A){"use strict";if(!t(this))throw new TypeError("Wrong map object type.");s(this);if(A!=null){var B=g(A),C=void 0;while(!(C=B.next()).done){if(!t(C.value))throw new TypeError("Expected iterable items to be pair objects.");this.set(C.value[0],C.value[1])}}}h.prototype.clear=function(){"use strict";s(this)};h.prototype.has=function(A){"use strict";var B=q(this,A);return!!(B!=null&&this._mapData[B])};h.prototype.set=function(A,B){"use strict";var C=q(this,A);if(C!=null&&this._mapData[C])this._mapData[C][1]=B;else{C=this._mapData.push([A,B])-1;r(this,A,C);this.size+=1}return this};h.prototype.get=function(A){"use strict";var B=q(this,A);if(B==null)return b;else return this._mapData[B][1]};h.prototype["delete"]=function(A){"use strict";var B=q(this,A);if(B!=null&&this._mapData[B]){r(this,A,b);this._mapData[B]=b;this.size-=1;return true}else return false};h.prototype.entries=function(){"use strict";return new p(this,l)};h.prototype.keys=function(){"use strict";return new p(this,j)};h.prototype.values=function(){"use strict";return new p(this,k)};h.prototype.forEach=function(A,B){"use strict";if(typeof A!=="function")throw new TypeError("Callback must be callable.");var C=ES(A,"bind",true,B||b),D=this._mapData;for(var E=0;E<D.length;E++){var F=D[E];if(F!=null)C(F[1],F[0],this)}};h.prototype[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]=function(){"use strict";return this.entries()};function p(A,B){"use strict";if(!(t(A)&&A._mapData))throw new TypeError("Object is not a map.");if(ES([j,l,k],"indexOf",true,B)===-1)throw new Error("Invalid iteration kind.");this._map=A;this._nextIndex=0;this._kind=B}p.prototype.next=function(){"use strict";if(!this instanceof h)throw new TypeError("Expected to be called on a MapIterator.");var A=this._map,B=this._nextIndex,C=this._kind;if(A==null)return u(b,true);var D=A._mapData;while(B<D.length){var E=D[B];B+=1;this._nextIndex=B;if(E)if(C===j)return u(E[0],false);else if(C===k)return u(E[1],false);else if(C)return u(E,false)}this._map=b;return u(b,true)};p.prototype[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]=function(){"use strict";return this};function q(A,B){if(t(B)){var C=y(B);return C?A._objectIndex[C]:b}else{var D=m+B;if(typeof B==="string")return A._stringIndex[D];else return A._otherIndex[D]}}function r(A,B,C){var D=C==null;if(t(B)){var E=y(B);if(!E)E=z(B);if(D)delete A._objectIndex[E];else A._objectIndex[E]=C}else{var F=m+B;if(typeof B==="string")if(D)delete A._stringIndex[F];else A._stringIndex[F]=C;else if(D)delete A._otherIndex[F];else A._otherIndex[F]=C}}function s(A){A._mapData=[];A._objectIndex={};A._stringIndex={};A._otherIndex={};A.size=0}function t(A){return A!=null&&(typeof A==="object"||typeof A==="function")}function u(A,B){return{value:A,done:B}}h.__isES5=function(){try{Object.defineProperty({},"__.$#x",{});return true}catch(A){return false}}();function v(A){if(!h.__isES5||!Object.isExtensible)return true;else return Object.isExtensible(A)}function w(A){var B=void 0;switch(A.nodeType){case 1:B=A.uniqueID;break;case 9:B=A.documentElement.uniqueID;break;default:return null}if(B)return o+B;else return null}var x=d();function y(A){if(A[x])return A[x];else if(!h.__isES5&&A.propertyIsEnumerable&&A.propertyIsEnumerable[x])return A.propertyIsEnumerable[x];else if(!h.__isES5&&e(A)&&w(A))return w(A);else if(!h.__isES5&&A[x])return A[x]}var z=function(){var A=Object.prototype.propertyIsEnumerable,B=0;return function z(C){if(v(C)){B+=1;if(h.__isES5)Object.defineProperty(C,x,{enumerable:false,writable:false,configurable:false,value:B});else if(C.propertyIsEnumerable){C.propertyIsEnumerable=function(){return A.apply(this,arguments)};C.propertyIsEnumerable[x]=B}else if(e(C))C[x]=B;else throw new Error("Unable to set a non-enumerable property on object.");return B}else throw new Error("Non-extensible objects are not allowed as keys.")}}();return __annotator(h,{name:"Map"})}(),i=function(){if(!f("Set"))return c.Set;function i(k){"use strict";if(this==null||typeof this!=="object"&&typeof this!=="function")throw new TypeError("Wrong set object type.");j(this);if(k!=null){var l=g(k),m=void 0;while(!(m=l.next()).done)this.add(m.value)}}i.prototype.add=function(k){"use strict";this._map.set(k,k);this.size=this._map.size;return this};i.prototype.clear=function(){"use strict";j(this)};i.prototype["delete"]=function(k){"use strict";var l=this._map["delete"](k);this.size=this._map.size;return l};i.prototype.entries=function(){"use strict";return this._map.entries()};i.prototype.forEach=function(k){"use strict";var l=arguments[1],m=this._map.keys(),n=void 0;while(!(n=m.next()).done)k.call(l,n.value,n.value,this)};i.prototype.has=function(k){"use strict";return this._map.has(k)};i.prototype.values=function(){"use strict";return this._map.values()};i.prototype.keys=function(){"use strict";return this.values()};i.prototype[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]=function(){"use strict";return this.values()};function j(k){k._map=new h();k.size=k._map.size}return __annotator(i,{name:"Set"})}();a.Map=h;a.Set=i})(typeof global==="undefined"?this:global);      __d("PromiseUsePolyfillSetImmediateGK",[],{"www_always_use_polyfill_setimmediate":false});__d("TimeSliceInteractionSV",[],{"on_demand_reference_counting":{"thing":true},"on_demand_profiling_counters":false,"default_rate":1000,"lite_default_rate":100,"interaction_to_coinflip":{"ADS_INTERFACES_INTERACTION":1,"ads_perf_scenario":1,"ads_wait_time":1,"async_request":0,"video_psr":1000000,"video_stall":2500000,"snowlift_open_autoclosed":0,"Event":100,"cms_editor":1,"page_messaging_shortlist":1,"ffd_chart_loading":1,"pixelcloud_view_performance":25,"internsearch_initial_page_load":1,"tasks_initial_page_load":10,"tasks_initial_page_load_modern":10,"watch_carousel_left_scroll":1,"watch_carousel_right_scroll":1,"watch_sections_load_more":1,"fbpkg_ui":1},"interaction_to_lite_coinflip":{"ADS_INTERFACES_INTERACTION":0,"ads_perf_scenario":0,"ads_wait_time":0,"Event":1,"video_psr":0,"video_stall":0},"enable_heartbeat":true,"maxBlockMergeDuration":0,"maxBlockMergeDistance":0,"user_timing_coinflip":500,"enable_banzai_stream":true,"banzai_stream_coinflip":1,"compression_enabled":true,"ref_counting_fix":false,"ref_counting_cont_fix":false,"also_record_new_timeslice_format":false});__d("ServerNonce",[],{"ServerNonce":"ba5ux9FT1r_R4wLxLyDInb"});      __d("InstantGamesGameState",[],(function a(b,c,d,e,f,g){f.exports={INITIAL:"initial",LOADING:"loading",READY:"ready",PLAYING:"playing",GAMEOVER:"gameover"}}),null);
__d("InstantGamesPassThroughRequestType",[],(function a(b,c,d,e,f,g){f.exports=Object.freeze({CAN_PLAYER_MATCH:"CAN_PLAYER_MATCH",ECHO:"ECHO",ERROR:"ERROR",JOIN_ROOM:"JOIN_ROOM",HEARTBEAT:"HEARTBEAT",GET_PLAYER_STATS:"GET_PLAYER_STATS",INCREMENT_PLAYER_STATS:"INCREMENT_PLAYER_STATS",SET_PLAYER_STATS:"SET_PLAYER_STATS",SDK_EVENT:"SDK_EVENT",GET_ENTRY_POINT:"GET_ENTRY_POINT"})}),null);
__d("InstantGamesSDKFeatures",[],(function a(b,c,d,e,f,g){"use strict";var h={FLEXIBLE:"flexible"};f.exports=h}),null);
__d("InstantGamesSDKMessages",[],(function a(b,c,d,e,f,g){"use strict";var h={AD_CLICK:"adclick",ANALYTICS_LOG_EVENT:"analyticslogevent",AVERAGE_FRAME_TIME:"averageframetime",CHANGE_CONTEXT_ASYNC:"changecontextasync",CONTEXT_CHOOSE_ASYNC:"contextchooseasync",CONTEXT_CREATE_ASYNC:"contextcreateasync",CONTEXT_SWITCH_ASYNC:"contextswitchasync",CONTEXT_MATCH_CREATE_ASYNC:"contextmatchcreateasync",CONTEXT_MATCH_DATA_FETCH_ASYNC:"contextmatchdatafetchasync",CONTEXT_MATCH_DATA_INC_ASYNC:"contextmatchdataincasync",CONTEXT_MATCH_DATA_SAVE_ASYNC:"contextmatchdatasaveasync",CONTEXT_MATCH_END_ASYNC:"contextmatchendasync",CONTEXT_MATCH_FETCH_ASYNC:"contextmatchfetchasync",CONTEXT_PLAYERS_FETCH_ASYNC:"contextplayersfetchasync",FLUSH_PLAYER_DATA_ASYNC:"flushplayerdataasync",GAME_START:"gamestart",GET_CONNECTED_PLAYERS_ASYNC:"getconnectedplayersasync",GET_INTERSTITIAL_AD_ASYNC:"getinterstitialadasync",GET_REWARDED_VIDEO_ASYNC:"getrewardedvideoasync",GET_SIGNED_PLAYER_INFO_ASYNC:"getsignedplayerinfoasync",GET_PLAYER_DATA_ASYNC:"getplayerdataasync",INITIALIZE_ASYNC:"initializeasync",LOAD_AD_ASYNC:"loadadasync",MATCH_PLAYER_ASYNC:"matchplayerasync",MEDIA_SEND_IMAGE_ASYNC:"mediasendimageasync",ON_BEGIN_LOAD:"onbeginload",ON_CONSOLE:"onconsole",ON_END_GAME:"onendgame",ON_FRAME_DROP:"onframedrop",ON_GAME_READY:"ongameready",ON_PICTURE:"onpicture",ON_PROGRESS_LOAD:"onprogressload",ON_SCORE:"onscore",ON_SCREENSHOT:"onscreenshot",PAUSE:"pause",PAYMENTS_CONSUME_PURCHASE_ASYNC:"paymentsconsumepurchaseasync",PAYMENTS_FETCH_CATALOG_ASYNC:"paymentsfetchcatalogasync",PAYMENTS_FETCH_PURCHASES_ASYNC:"paymentsfetchpurchasesasync",PAYMENTS_INITIALIZED:"paymentsinitialized",PAYMENTS_PURCHASE_ASYNC:"paymentspurchaseasync",PAYMENTS_RESTORE_PURCHASES_ASYNC:"paymentsrestorepurchasesasync",QUIT:"quit",REJECT_PROMISE:"rejectpromise",RESOLVE_PROMISE:"resolvepromise",RESTART:"restart",SEND_PASS_THROUGH_ASYNC:"sendpassthroughasync",SET_PLAYER_DATA_ASYNC:"setplayerdataasync",SET_SESSION_DATA:"setsessiondata",SHARE_ASYNC:"shareasync",SHOW_AD_ASYNC:"showadasync"};f.exports=h}),null);
__d("ExecutionContextObservers",[],(function a(b,c,d,e,f,g){var h={MUTATION_COUNTING:0,PROFILING_COUNTERS:1,REFERENCE_COUNTING:2,HEARTBEAT:3,CALL_STACK:4,ASYNC_PROFILER:5,TIMESLICE_EXECUTION_LOGGER:6},i={MUTATION_COUNTING:0,REFERENCE_COUNTING:1,PROFILING_COUNTERS:2,HEARTBEAT:3,CALL_STACK:4,ASYNC_PROFILER:5,TIMESLICE_EXECUTION_LOGGER:6},j={beforeIDs:h,afterIDs:i};f.exports=j}),null);
__d("ifRequired",[],(function a(b,c,d,e,f,g){function h(i,j,k){var l=void 0;e&&e.call(null,[i],function(m){return l=[m]});l?j.apply(null,l):k()}f.exports=h}),null);
__d("uniqueID",[],(function a(b,c,d,e,f,g){var h="js_",i=36,j=0;function k(){return h+(j++).toString(i)}f.exports=k}),null);
__d("CallStackExecutionObserver",["ExecutionContextObservers","ifRequired","uniqueID"],(function a(b,c,d,e,f,g,h,i,j){"use strict";__p&&__p();var k={onNewContextCreated:function l(m,n,o,p){__p&&__p();var q,r=i("TimeSliceAutoclosedInteraction",function(u){return u}),s=r?r.getInteractionsActiveRightNow():[],t=ES(s,"filter",true,function(u){return u.isEnabledForMode("full")});if(p&&p.isContinuation&&t.length){var q=function(){var u=j(),v=Error.stackTraceLimit;Error.stackTraceLimit=1e3;var w=new Error().stack;Error.stackTraceLimit=v;ES(t,"forEach",true,function(x){x.inform("created_continuation:"+n,{rawStackTrace:w}).addStringAnnotation("id",u);x.trace().addStringAnnotation("has_stack_trace","1")});return{v:{id:u,name:n,interactions:t}}}();if(typeof q==="object")return q.v}return null},onBeforeContextStarted:function l(m,n,o){return null},onAfterContextStarted:function l(m,n,o,p){__p&&__p();var q;if(n)(function(){var r=n.id,s=n.name,t=n.interactions,u=Error.stackTraceLimit;Error.stackTraceLimit=1e3;var v=new Error().stack;Error.stackTraceLimit=u;ES(t,"forEach",true,function(w){w.inform("executing_continuation:"+s,{rawStackTrace:v}).addStringAnnotation("id",r)})})();return null},onAfterContextEnded:function l(m,n,o,p){},getBeforeID:function l(){return h.beforeIDs.CALL_STACK},getAfterID:function l(){return h.afterIDs.CALL_STACK}};f.exports=k}),null);
__d("eprintf",[],(function a(b,c,d,e,f,g){__p&&__p();function h(i){for(var j=arguments.length,k=Array(j>1?j-1:0),l=1;l<j;l++)k[l-1]=arguments[l];var m=ES(k,"map",true,function(p){return String(p)}),n=i.split("%s").length-1;if(n!==m.length)return h("eprintf args number mismatch: %s",ES("JSON","stringify",false,[i].concat(m)));var o=0;return i.replace(/%s/g,function(){return String(m[o++])})}f.exports=h}),null);
__d("ex",["eprintf"],(function a(b,c,d,e,f,g,h){__p&&__p();function i(j){for(var k=arguments.length,l=Array(k>1?k-1:0),m=1;m<k;m++)l[m-1]=arguments[m];var n=ES(l,"map",true,function(p){return String(p)}),o=j.split("%s").length-1;if(o!==n.length)return i("ex args number mismatch: %s",ES("JSON","stringify",false,[j].concat(n)));return i._prefix+ES("JSON","stringify",false,[j].concat(n))+i._suffix}i._prefix="<![EX[";i._suffix="]]>";f.exports=i}),null);
__d("sprintf",[],(function a(b,c,d,e,f,g){function h(i){for(var j=arguments.length,k=Array(j>1?j-1:0),l=1;l<j;l++)k[l-1]=arguments[l];var m=0;return i.replace(/%s/g,function(){return String(k[m++])})}f.exports=h}),null);
__d("invariant",["ex","sprintf"],(function a(b,c,d,e,f,g,h,i){"use strict";__p&&__p();var j=h;function k(l,m){__p&&__p();if(!l){var n=void 0;if(m===undefined)n=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{for(var o=arguments.length,p=Array(o>2?o-2:0),q=2;q<o;q++)p[q-2]=arguments[q];n=new Error(j.apply(undefined,[m].concat(p)));n.name="Invariant Violation";n.messageWithParams=[m].concat(p)}n.framesToPop=1;throw n}}f.exports=k}),null);
__d("CircularBuffer",["invariant"],(function a(b,c,d,e,f,g,h){__p&&__p();function i(j){"use strict";j>0||h(0);this.$CircularBuffer1=j;this.$CircularBuffer2=0;this.$CircularBuffer3=[];this.$CircularBuffer4=[]}i.prototype.write=function(j){"use strict";__p&&__p();if(this.$CircularBuffer3.length<this.$CircularBuffer1)this.$CircularBuffer3.push(j);else{ES(this.$CircularBuffer4,"forEach",true,ES(function(k){return k(this.$CircularBuffer3[this.$CircularBuffer2])},"bind",true,this));this.$CircularBuffer3[this.$CircularBuffer2]=j;this.$CircularBuffer2++;this.$CircularBuffer2%=this.$CircularBuffer1}return this};i.prototype.onEvict=function(j){"use strict";this.$CircularBuffer4.push(j);return this};i.prototype.read=function(){"use strict";return this.$CircularBuffer3.slice(this.$CircularBuffer2).concat(this.$CircularBuffer3.slice(0,this.$CircularBuffer2))};i.prototype.expand=function(j){"use strict";if(j>this.$CircularBuffer1){var k=this.read();this.$CircularBuffer2=0;this.$CircularBuffer3=k;this.$CircularBuffer1=j}return this};i.prototype.dropFirst=function(j){"use strict";if(j<=this.$CircularBuffer1){var k=this.read();this.$CircularBuffer2=0;k.splice(0,j);this.$CircularBuffer3=k}return this};i.prototype.clear=function(){"use strict";this.$CircularBuffer2=0;this.$CircularBuffer3=[];return this};i.prototype.currentSize=function(){"use strict";return this.$CircularBuffer3.length};f.exports=i}),null);
__d("Env",[],(function a(b,c,d,e,f,g){var h={start:ES("Date","now",false),nocatch:b.FB_GKS&&b.FB_GKS.js_nocatch,ajaxpipe_token:null};if(b.Env)ES("Object","assign",false,h,b.Env);b.Env=h;f.exports=h}),null);
__d("erx",["ex"],(function a(b,c,d,e,f,g,h){__p&&__p();function i(j){__p&&__p();if(typeof j!=="string")return j;var k=ES(j,"indexOf",true,h._prefix),l=j.lastIndexOf(h._suffix);if(k<0||l<0)return[j];var m=k+h._prefix.length,n=l+h._suffix.length;if(m>=l)return["erx slice failure: %s",j];var o=j.substring(0,k),p=j.substring(n);j=j.substring(m,l);try{var q=ES("JSON","parse",false,j);q[0]=o+q[0]+p;return q}catch(r){return["erx parse failure: %s",j]}}f.exports=i}),null);
__d("removeFromArray",[],(function a(b,c,d,e,f,g){function h(i,j){var k=ES(i,"indexOf",true,j);if(k!==-1)i.splice(k,1)}f.exports=h}),null);
__d("ErrorUtils",["Env","eprintf","erx","removeFromArray"],(function a(b,c,d,e,f,g,h,i,j,k){__p&&__p();var l="<anonymous guard>",m="<generated guard>",n=typeof window==="undefined"?"<self.onerror>":"<window.onerror>",o=/^https?:\/\//i,p=/^Type Mismatch for/,q=/(.*)[@\s][^\s]+$/,r=[],s=void 0,t=[],u=50,v=[],w=false,x=false,y=false,z=/\bnocatch\b/.test(location.search),A=["Unknown script code","Function code","eval code"];if(h.long_stack_traces&&Error.stackTraceLimit!=null)Error.stackTraceLimit=100;function B(N){var O=N.columnNumber||N.column;return O!=null?String(O):""}function C(N){return N[0]&&N[0].column||""}function D(N){for(var O=0;O<A.length;O++){var P=" "+A[O];if(ES(N,"endsWith",true,P))return[N,N.substring(0,N.length-P.length)]}return null}function E(N){var O=N.lineNumber||N.line;return O!=null?String(O):""}function F(N){return N[0]&&N[0].line||""}function G(N){var O=N.fileName||N.sourceURL;return O!=null?String(O):""}function H(N){return N[0]&&N[0].script||""}function I(N){if(!N)return null;var O=N.split("\n");O.splice(0,1);return ES(O,"map",true,function(P){return ES(P,"trim",true)})}function J(N){__p&&__p();if(!N)return[];return ES(N.split(/\n\n/)[0].replace(/[\(\)]|\[.*?\]|^[\w \.]+:\s.*?\n/g,"").split("\n"),"map",true,function(O){__p&&__p();O=ES(O,"trim",true);var P=void 0,Q=void 0,R=O.match(/:(\d+)(?::(\d+))?$/);if(R){P=R[1];Q=R[2];O=O.slice(0,-R[0].length)}var S=void 0,T=D(O)||O.match(q);if(T){O=O.substring(T[1].length+1);var U=T[1].match(/(?:at)?\s*(.*)(?:[^\s]+|$)/);S=U?U[1]:""}if(ES(O,"includes",true,"charset=utf-8;base64,"))O="<inlined-file>";var V={column:Q,identifier:S,line:P,script:O};if(s)s(V);var W="    at"+(V.identifier?" "+V.identifier+" (":" ")+V.script+(V.line?":"+V.line:"")+(V.column?":"+V.column:"")+(V.identifier?")":"");return babelHelpers["extends"]({},V,{text:W})})}function K(N){v.unshift(N);w=true}function L(){v.shift();w=v.length!==0}var M={ANONYMOUS_GUARD_TAG:l,GENERATED_GUARD_TAG:m,GLOBAL_ERROR_HANDLER_TAG:n,history:t,addListener:function N(O){var P=arguments.length<=1||arguments[1]===undefined?false:arguments[1];r.push(O);if(!P)ES(t,"forEach",true,O)},removeListener:function N(O){k(r,O)},setSourceResolver:function N(O){s=O},applyWithGuard:function N(O,P,Q,R,S){__p&&__p();K(S||l);if(h.nocatch)z=true;if(z){var T=void 0;try{T=O.apply(P,Q||[])}finally{L()}return T}try{return O.apply(P,Q||[])}catch(U){var V=M.normalizeError(U);if(R)R(V);if(O)try{V.callee=O.toString().substring(0,100)}catch(W){}if(Q)V.args=ES("Array","from",false,Q).toString().substring(0,100);V.guard=v[0];V.guardList=v.slice();M.reportError(V)}finally{L()}},guard:function N(O,P,Q){P=P||O.name||m;function R(){return M.applyWithGuard(O,Q||this,arguments,null,P)}if(O.__SMmeta)R.__SMmeta=O.__SMmeta;return R},inGuard:function N(){return w},normalizeError:function N(O){__p&&__p();if(O._originalError)return O;var P=J(O.stackTrace||O.stack),Q=false;if(O.framesToPop){var R=O.framesToPop,S=void 0;while(R>0&&P.length>0){S=P.shift();R--;Q=true}if(p.test(O.message)&&O.framesToPop===2&&S)if(o.test(S.script))O.message+=" at "+S.script+(S.line?":"+S.line:"")+(S.column?":"+S.column:"")}var T=I(O.reactComponentStackForLogging),U={_originalError:O,column:Q?C(P):B(O)||C(P),extra:O.extra,guard:O.guard,guardList:O.guardList,line:Q?F(P):E(O)||F(P),message:O.message,messageWithParams:O.messageWithParams,name:O.name,reactComponentStack:T,script:Q?H(P):G(O)||H(P),snapshot:O.snapshot,stack:ES(P,"map",true,function(W){return W.text}).join("\n"),stackFrames:P,type:O.type};if(typeof U.message==="string")U.messageWithParams=U.messageWithParams||j(U.message);else{U.messageObject=U.message;U.message=String(U.message)+" ("+typeof U.message+")"}if(U.messageWithParams)U.message=i.apply(undefined,U.messageWithParams);if(typeof window!=="undefined"&&window&&window.location)U.windowLocationURL=window.location.href;if(s)s(U);for(var V in U)if(U[V]==null)delete U[V];return U},onerror:function N(O,P,Q,R,S){S=S||{};S.message=S.message||O;S.script=S.script||P;S.line=S.line||Q;S.column=S.column||R;S.guard=n;S.guardList=[n];M.reportError(S,true)},reportError:function N(O){__p&&__p();var P=arguments.length<=1||arguments[1]===undefined?false:arguments[1];if(x)return false;if(v.length>0){O.guard=O.guard||v[0];O.guardList=v.slice()}var Q=M.normalizeError(O);if(!P){var R=b.console;if((!R[Q.type]||Q.type==="error")&&!y){var S=""+Q._originalError.message;if(S.length>80)S=S.slice(0,77)+"...";R.error('ErrorUtils caught an error: "'+S+"\". Subsequent errors won't be logged; see https://fburl.com/debugjs.");y=true}}if(t.length>u)t.splice(u/2,1);t.push(Q);x=true;for(var T=0;T<r.length;T++)try{r[T](Q)}catch(U){}x=false;return true}};b.onerror=M.onerror;f.exports=b.ErrorUtils=M;if(typeof __t==="function"&&__t.setHandler)__t.setHandler(M.reportError)}),3);
__d("LogBuffer",["CircularBuffer"],(function a(b,c,d,e,f,g,h){__p&&__p();var i=b.setTimeout.nativeBackup||b.setTimeout,j=5e3,k={},l={},m={write:function n(o,p){var q=k[o]=k[o]||new h(j);q.write(p);if(l[o])ES(l[o],"forEach",true,function(r){try{r(p)}catch(s){}})},read:function n(o){if(!k[o])return[];else return k[o].read()},tail:function n(o,p){__p&&__p();if(typeof p!=="function")return;l[o]=l[o]||[];l[o].push(p);if(k[o]){var q=k[o];ES(q.read(),"forEach",true,function(r){try{p(r)}catch(s){}})}},expand:function n(o,p){var q=k[o];if(q)q.expand(p);else k[o]=new h(p)},clear:function n(o){if(k[o])i(function(){k[o].clear()},0)}};f.exports=m}),null);
__d("nullthrows",[],(function a(b,c,d,e,f,g){var h=function h(i){var j=arguments.length<=1||arguments[1]===undefined?"Got unexpected null or undefined":arguments[1];if(i!=null)return i;var k=new Error(j);k.framesToPop=1;throw k};f.exports=h}),null);
__d("ExecutionEnvironment",[],(function a(b,c,d,e,f,g){"use strict";var h=!!(typeof window!=="undefined"&&window.document&&window.document.createElement),i={canUseDOM:h,canUseWorkers:typeof Worker!=="undefined",canUseEventListeners:h&&!!(window.addEventListener||window.attachEvent),canUseViewport:h&&!!window.screen,isInWorker:!h};f.exports=i}),null);
__d("performance",["ExecutionEnvironment"],(function a(b,c,d,e,f,g,h){"use strict";var i=void 0;if(h.canUseDOM)i=window.performance||window.msPerformance||window.webkitPerformance;f.exports=i||{}}),null);
__d("performanceAbsoluteNow",["performance"],(function a(b,c,d,e,f,g,h){var i;if(h.now&&h.timing&&h.timing.navigationStart){var j=h.timing.navigationStart;i=function i(){return h.now()+j}}else i=function i(){return ES("Date","now",false)};f.exports=i}),null);
__d("wrapFunction",[],(function a(b,c,d,e,f,g){var h={},i=function i(j,k,l){return function(){var m=k in h?h[k](j,l):j;for(var n=arguments.length,o=Array(n),p=0;p<n;p++)o[p]=arguments[p];return m.apply(this,o)}};i.setWrapper=function(j,k){h[k]=j};f.exports=i}),null);
__d("TimeSlice",["CallStackExecutionObserver","CircularBuffer","Env","ErrorUtils","LogBuffer","invariant","nullthrows","performanceAbsoluteNow","wrapFunction"],(function aa(a,ba,ca,da,b,ea,c,d,e,f,g,h,i,j,k){__p&&__p();var l=[],m=[],n="time_slice",o=1,p=false,q=0,r=1,s=2,t=q,u=new d(100),v=0,w=0,x=e.timesliceBufferSize;if(x)g.expand(n,x);var y="stackTraceLimit"in Error,z=[],A=[],B=[];function C(){return D(z)}function D(L){return L.length>0?L[L.length-1]:null}function E(L,M){var N={};f.applyWithGuard(H,null,[L,M,N]);f.applyWithGuard(I,null,[L,M,N]);z.push(L);A.push(M);B.push(N)}function F(L,M,N,O){ES(l,"forEach",true,function(P){var Q=P.onNewContextCreated(C(),M,O,N);L[P.getBeforeID()]=Q})}function G(L,M,N){ES(m,"forEach",true,function(O){O.onAfterContextEnded(L,M[O.getBeforeID()],N[O.getBeforeID()],L.meta)})}function H(L,M,N){ES(l,"forEach",true,function(O){var P=O.onBeforeContextStarted(L,M[O.getBeforeID()],L.meta);N[O.getBeforeID()]=P})}function I(L,M,N){ES(l,"forEach",true,function(O){var P=O.onAfterContextStarted(L,M[O.getBeforeID()],N[O.getBeforeID()],L.meta);N[O.getBeforeID()]=P})}function J(){__p&&__p();var L=C(),M=D(A),N=D(B);if(L==null||M==null||N==null){f.reportError(new Error("popped too many times off the timeslice stack"));p=false;return}f.applyWithGuard(G,null,[L,M,N]);p=!L.isRoot;z.pop();A.pop();B.pop()}var K={guard:function L(M,N,O){__p&&__p();typeof M==="function"||h(0);typeof N==="string"||h(0);if(M.__tsGuarded)return M;if(!O||!O.root)K.checkCoverage();var P=void 0;if(p)P=C();var Q={},R=0,S=function S(){__p&&__p();var T=j(),U=void 0,V=o++,W={contextID:V,name:N,isRoot:!p,executionNumber:R++,meta:O,absBeginTimeMs:T};E(W,Q);if(P!=null){var X=!!(O&&O.isContinuation);if(P.isRoot){W.indirectParentID=P.contextID;W.isEdgeContinuation=X}else{W.indirectParentID=P.indirectParentID;W.isEdgeContinuation=!!(X&&P.isEdgeContinuation)}}p=true;try{if(!W.isRoot)return M.apply(this,arguments);else{var Y="TimeSlice"+(N?": "+N:"");U=f.applyWithGuard(M,this,arguments,null,Y);return U}}finally{var Z=C();if(Z==null){f.reportError(new Error("timeslice stack misaligned, not logging the block"));p=false}else{var fa=Z.isRoot,ga=Z.contextID,ha=Z.indirectParentID,ia=Z.isEdgeContinuation,$=j();Z.absEndTimeMs=$;if(fa&&T!=null){w+=$-T;var ja=babelHelpers["extends"]({begin:T,end:$,id:ga,indirectParentID:ha,representsExecution:true,isEdgeContinuation:P&&ia,guard:N},O,M.__SMmeta);g.write("time_slice",ja)}J()}}};S=S;f.applyWithGuard(F,null,[Q,N,O,S]);S.__tsGuarded=true;return S},inGuard:function L(){return p},checkCoverage:function L(){__p&&__p();var M=void 0;if(t!==s&&!p){if(y){M=Error.stackTraceLimit;Error.stackTraceLimit=50}var N=new Error("Missing TimeSlice coverage");if(y)Error.stackTraceLimit=M;N.type="warn";if(t===r&&Math.random()<v)f.reportError(N);else if(t===q)i(u).write(N)}},setLogging:function L(M,N){__p&&__p();if(t!==q)return;v=N;if(M){t=r;ES(i(u).read(),"forEach",true,function(O){if(Math.random()<v)f.reportError(O)})}else t=s;i(u).clear();u=undefined},getContext:function L(){return C()},getTotalTime:function L(){return w},getGuardedContinuation:function L(M){return K.guard(function N(O){for(var P=arguments.length,Q=Array(P>1?P-1:0),R=1;R<P;R++)Q[R-1]=arguments[R];return O.apply(this,Q)},M,{isContinuation:true})},getGuardNameStack:function L(){return ES(z,"map",true,function(M){return M.name})},registerExecutionContextObserver:function L(M){__p&&__p();var N=false;for(var O=0;O<l.length;O++)if(l[O].getBeforeID()>M.getBeforeID()){l.splice(O,0,M);N=true;break}if(!N)l.push(M);for(var P=0;P<m.length;P++)if(m[P].getAfterID()>M.getAfterID()){m.splice(P,0,M);return}m.push(M)},catchUpOnDemandExecutionContextObservers:function L(M){for(var N=0;N<z.length;N++){var O=z[N],P=A[N],Q=B[N]||{},R=M.onBeforeContextStartedWhileEnabled(O,P[M.getBeforeID()],O.meta);Q[M.getBeforeID()]=R;B[N]=Q}}};if(e.sample_continuation_stacktraces)K.registerExecutionContextObserver(c);k.setWrapper(K.guard,"entry");a.TimeSlice=K;b.exports=K}),3);
/**
 * License: https://www.facebook.com/legal/license/mgL-nhsiotL/
 */
__d("ImmediateImplementation",[],(function a(b,c,d,e,f,g){__p&&__p();(function(b,h){"use strict";__p&&__p();var i=1,j={},k={},l=k,m=false,n=b.document,o=void 0;function p(x){var y=x[0];x=Array.prototype.slice.call(x,1);j[i]=function(){y.apply(h,x)};l=l.next={handle:i++};return l.handle}function q(){__p&&__p();var x=void 0,y=void 0;while(!m&&(x=k.next)){k=x;if(y=j[x.handle]){m=true;try{y();m=false}finally{r(x.handle);if(m){m=false;if(k.next)o(q)}}}}}function r(x){delete j[x]}function s(){__p&&__p();var x;if(b.postMessage&&!b.importScripts){var x=function(){__p&&__p();var y=true,z=function z(){y=false;if(b.removeEventListener)b.removeEventListener("message",z,false);else b.detachEvent("onmessage",z)};if(b.addEventListener)b.addEventListener("message",z,false);else if(b.attachEvent)b.attachEvent("onmessage",z);else return{v:false};b.postMessage("","*");return{v:y}}();if(typeof x==="object")return x.v}}function t(){__p&&__p();var x="setImmediate$"+Math.random()+"$",y=function y(event){if(event.source===b&&typeof event.data==="string"&&ES(event.data,"indexOf",true,x)===0)q()};if(b.addEventListener)b.addEventListener("message",y,false);else b.attachEvent("onmessage",y);o=function o(){var z=p(arguments);b.postMessage(x+z,"*");return z}}function u(){var x=new MessageChannel();x.port1.onmessage=q;o=function o(){var y=p(arguments);x.port2.postMessage(y);return y}}function v(){__p&&__p();var x=n.documentElement;o=function o(){var y=p(arguments),z=n.createElement("script");z.onreadystatechange=function(){z.onreadystatechange=null;x.removeChild(z);z=null;q()};x.appendChild(z);return y}}function w(){o=function o(){setTimeout(q,0);return p(arguments)}}if(s())t();else if(b.MessageChannel)u();else if(n&&n.createElement&&"onreadystatechange"in n.createElement("script"))v();else w();g.setImmediate=o;g.clearImmediate=r})(Function("return this")())}),null);
__d("setImmediatePolyfill",["PromiseUsePolyfillSetImmediateGK","invariant","ImmediateImplementation"],(function a(b,c,d,e,f,g,h,i){__p&&__p();var j=b.setImmediate;if(h.www_always_use_polyfill_setimmediate||!j){var k=c("ImmediateImplementation");j=k.setImmediate}function l(m){typeof m==="function"||i(0);for(var n=arguments.length,o=Array(n>1?n-1:0),p=1;p<n;p++)o[p-1]=arguments[p];return j.apply(undefined,[m].concat(o))}f.exports=l}),null);
__d("setImmediateAcrossTransitions",["TimeSlice","setImmediatePolyfill"],(function a(b,c,d,e,f,g,h,i){function j(k){var l=h.guard(k,"setImmediate",{isContinuation:true});for(var m=arguments.length,n=Array(m>1?m-1:0),o=1;o<m;o++)n[o-1]=arguments[o];return i.apply(undefined,[l].concat(n))}f.exports=j}),null);
__d("OnDemandExecutionContextObserver",["TimeSlice"],(function a(b,c,d,e,f,g,h){"use strict";__p&&__p();function i(){this.$OnDemandExecutionContextObserver5=false;this.$OnDemandExecutionContextObserver4=false;this.$OnDemandExecutionContextObserver1=0;this.$OnDemandExecutionContextObserver2={};this.$OnDemandExecutionContextObserver3=0}i.prototype.onNewContextCreatedWhileEnabled=function(j,k,l,m){throw Error("unimplemented abstract method")};i.prototype.onNewContextCreatedWhileDisabled=function(j,k,l,m){};i.prototype.onBeforeContextStartedWhileEnabled=function(j,k,l){throw Error("unimplemented abstract method")};i.prototype.onBeforeContextStartedWhileDisabled=function(j,k,l){};i.prototype.onAfterContextStartedWhileEnabled=function(j,k,l,m){throw Error("unimplemented abstract method")};i.prototype.onAfterContextStartedWhileDisabled=function(j,k,l,m){};i.prototype.onAfterContextEndedWhileEnabled=function(j,k,l,m){throw Error("unimplemented abstract method")};i.prototype.onAfterContextEndedWhileDisabled=function(j,k,l,m){};i.prototype.onNewContextCreated=function(j,k,l,m){if(this.isEnabled())return this.onNewContextCreatedWhileEnabled(j,k,l,m);else{this.onNewContextCreatedWhileDisabled(j,k,l,m);return null}};i.prototype.onBeforeContextStarted=function(j,k,l){if(this.isEnabled())return this.onBeforeContextStartedWhileEnabled(j,k,l);else{this.onBeforeContextStartedWhileDisabled(j,k,l);return null}};i.prototype.onAfterContextStarted=function(j,k,l,m){var n=l;if(this.isEnabled())return this.onAfterContextStartedWhileEnabled(j,k,n,m);else{this.onAfterContextStartedWhileDisabled(j,k,n,m);return null}};i.prototype.onAfterContextEnded=function(j,k,l,m){if(this.isEnabled()){var n=l;this.onAfterContextEndedWhileEnabled(j,k,n,m)}else this.onAfterContextEndedWhileDisabled(j,k,l,m);if(this.$OnDemandExecutionContextObserver4&&!this.$OnDemandExecutionContextObserver5&&j.isRoot){this.onDisable();this.$OnDemandExecutionContextObserver4=false}};i.prototype.onDisable=function(){};i.prototype.onEnable=function(){};i.prototype.getBeforeID=function(){throw Error("unimplemented abstract method")};i.prototype.getAfterID=function(){throw Error("unimplemented abstract method")};i.prototype.isEnabled=function(){return this.$OnDemandExecutionContextObserver4};i.prototype.__getExpiryCallback=function(){__p&&__p();var j=++this.$OnDemandExecutionContextObserver1;this.$OnDemandExecutionContextObserver2[j]=true;this.$OnDemandExecutionContextObserver3++;return ES(function(){if(this.$OnDemandExecutionContextObserver2[j]){delete this.$OnDemandExecutionContextObserver2[j];this.$OnDemandExecutionContextObserver3--;if(this.$OnDemandExecutionContextObserver3===0)this.$OnDemandExecutionContextObserver5=false}},"bind",true,this)};i.prototype.expressInterest=function(){var j=this.__getExpiryCallback();if(!this.isEnabled()){this.onEnable();h.catchUpOnDemandExecutionContextObservers(this)}this.$OnDemandExecutionContextObserver4=true;this.$OnDemandExecutionContextObserver5=true;return j};f.exports=i}),null);
__d("IntervalTrackingBoundedBuffer",["CircularBuffer","ErrorUtils"],(function a(b,c,d,e,f,g,h,i){"use strict";__p&&__p();var j=5e3;function k(l){__p&&__p();this.$IntervalTrackingBoundedBuffer6=0;if(l!=null){if(l<=0)throw new Error("Size for a buffer must be greater than zero.")}else l=j;this.$IntervalTrackingBoundedBuffer4=l;this.$IntervalTrackingBoundedBuffer1=new h(l);this.$IntervalTrackingBoundedBuffer1.onEvict(ES(function(){return this.$IntervalTrackingBoundedBuffer6++},"bind",true,this));this.$IntervalTrackingBoundedBuffer2=[];this.$IntervalTrackingBoundedBuffer3=1;this.$IntervalTrackingBoundedBuffer5=0}k.prototype.open=function(){__p&&__p();var l=this.$IntervalTrackingBoundedBuffer3++,m=false,n=void 0,o=this.$IntervalTrackingBoundedBuffer5,p={id:l,startIdx:o,hasOverflown:ES(function(){return n!=null?n:this.$IntervalTrackingBoundedBuffer6>o},"bind",true,this),close:ES(function(){if(m)return[];else{m=true;n=this.$IntervalTrackingBoundedBuffer6>o;return this.$IntervalTrackingBoundedBuffer7(l)}},"bind",true,this)};this.$IntervalTrackingBoundedBuffer2.push(p);return p};k.prototype.pushElement=function(l){if(this.$IntervalTrackingBoundedBuffer2.length>0){this.$IntervalTrackingBoundedBuffer1.write(l);this.$IntervalTrackingBoundedBuffer5++}return this};k.prototype.isActive=function(){return this.$IntervalTrackingBoundedBuffer2.length>0};k.prototype.$IntervalTrackingBoundedBuffer8=function(l){return Math.max(l-this.$IntervalTrackingBoundedBuffer6,0)};k.prototype.$IntervalTrackingBoundedBuffer7=function(l){__p&&__p();var m=void 0,n=void 0,o=void 0,p=void 0;for(var q=0;q<this.$IntervalTrackingBoundedBuffer2.length;q++){var r=this.$IntervalTrackingBoundedBuffer2[q],s=r.startIdx,t=r.id;if(t===l){o=q;p=s}else if(n==null||s<n)n=s;if(m==null||s<m)m=s}if(o==null||m==null||p==null){i.reportError(new Error("messed up state inside IntervalTrackingBoundedBuffer"));return[]}this.$IntervalTrackingBoundedBuffer2.splice(o,1);var u=this.$IntervalTrackingBoundedBuffer8(p),v=this.$IntervalTrackingBoundedBuffer1.read().slice(u),w=this.$IntervalTrackingBoundedBuffer8(n==null?this.$IntervalTrackingBoundedBuffer5:n)-this.$IntervalTrackingBoundedBuffer8(m);if(w>0){this.$IntervalTrackingBoundedBuffer1.dropFirst(w);this.$IntervalTrackingBoundedBuffer6+=w}return v};f.exports=k}),18);
__d("ProfilingCountersStore",["IntervalTrackingBoundedBuffer"],(function a(b,c,d,e,f,g,h){"use strict";__p&&__p();var i=new h(),j={getInstance:function k(){return i},toMap:function k(l){var m={};ES(l,"forEach",true,function(n){return m[n.getTimeSliceContextID()]=n});return m},getNestedTotals:function k(l){return j._accumulateOverNestedActiveCounters(l,function(m,n){j._addOnto(n,m.getActiveCounters().getTotals());return n},{})},_accumulateOverNestedActiveCounters:function k(l,m,n){__p&&__p();var o=n;if(l.hasActiveCounters())o=m(l,o);if(l.processedNestedContexts!=null)for(var p=l.processedNestedContexts,q=ES("Array","isArray",false,p),r=0,p=q?p:p[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var s;if(q){if(r>=p.length)break;s=p[r++]}else{r=p.next();if(r.done)break;s=r.value}var t=s;o=j._accumulateOverNestedActiveCounters(t,m,o)}return o},_getMaximumAttribution:function k(l,m){__p&&__p();if(l.length===0)return null;for(var n=l,o=ES("Array","isArray",false,n),p=0,n=o?n:n[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var q;if(o){if(p>=n.length)break;q=n[p++]}else{p=n.next();if(p.done)break;q=p.value}var r=q;if(m.propagatedAttributions&&m.propagatedAttributions[r]!=null)return r}var s=null,t=null;for(var u=l,v=ES("Array","isArray",false,u),w=0,u=v?u:u[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var x;if(v){if(w>=u.length)break;x=u[w++]}else{w=u.next();if(w.done)break;x=w.value}var y=x;if(m.newAttributions&&m.newAttributions[y]!=null){var z=m.newAttributions[y].newCounterIdx;if(t==null||z<t){s=y;t=z}}}return s},getNestedTotalsByAttributions:function k(l,m){__p&&__p();return j._accumulateOverNestedActiveCounters(l,function(n,o){__p&&__p();var p=j._getMaximumAttribution(m,n);if(p){var q=j._getAttributedAndUnattributedForThisContext(p,n),r=q.attributed,s=q.unattributed;if(r!=null)j._addOnto(o.attributed,r);if(s!=null)j._addOnto(o.unattributed,s)}else j._addOnto(o.unattributed,n.getActiveCounters().getTotals());return o},{attributed:{},unattributed:{}})},_getAttributedAndUnattributedForThisContext:function k(l,m){__p&&__p();var n=m.getActiveCounters().getTotals();if(m.propagatedAttributions!=null&&m.propagatedAttributions[l]!=null)return{attributed:n,unattributed:null};else if(m.newAttributions!=null&&m.newAttributions[l]!=null){var o=m.newAttributions[l].snapshotAtStart;if(o!=null){var p=ES("Object","entries",false,o);for(var q=0;q<p.length;q++){var r=p[q],s=r[0],t=r[1],u=n[s]-t;if(u===0)delete n[s];else n[s]=u}return{attributed:n,unattributed:o}}else return{attributed:n,unattributed:null}}else return{attributed:null,unattributed:n}},_addOnto:function k(l,m){__p&&__p();for(var n=ES("Object","entries",false,m),o=ES("Array","isArray",false,n),p=0,n=o?n:n[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var q;if(o){if(p>=n.length)break;q=n[p++]}else{p=n.next();if(p.done)break;q=p.value}var r=q,s=r[0],t=r[1];l[s]=(l[s]||0)+t}}};f.exports=j}),18);
__d("ProfilingCounters",["ErrorUtils","ExecutionContextObservers","OnDemandExecutionContextObserver","ProfilingCountersStore","TimeSlice","TimeSliceInteractionSV","performanceAbsoluteNow"],(function a(b,c,d,e,f,g,h,i,j,k,l,m,n){__p&&__p();var o,p;n();var q={ALL:"ALL",ONLY_ON_CONTINUATIONS_AND_FIRST_EXEC:"ONLY_ON_CONTINUATIONS_AND_FIRST_EXEC"},r=100,s=[];o=babelHelpers.inherits(t,j);p=o&&o.prototype;t.prototype.onNewContextCreatedWhileEnabled=function(x,y,z,A){"use strict";return u.currentContext().getPropagatedContextForChild(!!(A&&A.isContinuation))};t.prototype.onBeforeContextStartedWhileEnabled=function(x,y,z){"use strict";__p&&__p();var A=z&&z.propagateCounterAttribution,B=null;if(x.executionNumber>0&&y)for(var C=ES("Object","entries",false,y),D=ES("Array","isArray",false,C),E=0,C=D?C:C[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var F;if(D){if(E>=C.length)break;F=C[E++]}else{E=C.next();if(E.done)break;F=E.value}var G=F,H=G[0],I=G[1],J=I.propagationType;if(J!=="ONLY_ON_CONTINUATIONS_AND_FIRST_EXEC"){B=B||{};B[H]=I}}else B=y;var K=u.currentContext().getExecutionContext(!!(z&&z.isContinuation),B),L=new u(false,K,x.contextID);if(A!=null)L.addAttribution(A,q.ALL);u.nestContext(L);return null};t.prototype.onAfterContextStartedWhileEnabled=function(x,y,z,A){"use strict";return null};t.prototype.onAfterContextEndedWhileEnabled=function(x,y,z,A){"use strict";var B=u.unnestContext();if(x.isRoot)k.getInstance().pushElement(B)};t.prototype.getBeforeID=function(){"use strict";return i.beforeIDs.PROFILING_COUNTERS};t.prototype.getAfterID=function(){"use strict";return i.afterIDs.PROFILING_COUNTERS};t.prototype.onDisable=function(){"use strict";u.resetState()};function t(){"use strict";o.apply(this,arguments)}u.getObserver=function(){"use strict";if(!u.$ProfilingCounters2)u.$ProfilingCounters2=new t();return u.$ProfilingCounters2};u.wrapInSingleContext=function(x){"use strict";var y=new u(false,null,0);ES(x,"forEach",true,function(z){return y.$ProfilingCounters3(z,false)});return y};u.startTimingInContext=function(x,y){"use strict";__p&&__p();if(!u.getObserver().isEnabled())return null;for(var z=s,A=ES("Array","isArray",false,z),B=0,z=A?z:z[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var C;if(A){if(B>=z.length)break;C=z[B++]}else{B=z.next();if(B.done)break;C=B.value}var D=C;if(D.getTimeSliceContextID()===y)return D.getActiveCounters().startTiming(x)}return null};u.stopTimingInContext=function(x,y){"use strict";__p&&__p();if(!u.getObserver().isEnabled())return;for(var z=s,A=ES("Array","isArray",false,z),B=0,z=A?z:z[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var C;if(A){if(B>=z.length)break;C=z[B++]}else{B=z.next();if(B.done)break;C=B.value}var D=C;if(D.getTimeSliceContextID()===y){D.getActiveCounters().stopTiming(x);return}}return};u.startTiming=function(x){"use strict";return u.currentContext().getActiveCounters().startTiming(x)};u.stopTiming=function(x){"use strict";return u.currentContext().getActiveCounters().stopTiming(x)};u.incrementCounter=function(x,y){"use strict";u.currentContext().getActiveCounters().incrementCounter(x,y)};u.currentContext=function(){"use strict";return s[s.length-1]};function u(x,y,z){"use strict";this.isGlobal=x;this.propagatedAttributions=y;this.newAttributions=null;this.active=null;this.processedNestedContexts=null;this.newAttributionsCount=0;this.$ProfilingCounters1=z}u.prototype.addAttribution=function(x,y){"use strict";if(!this.$ProfilingCounters4(x)){if(this.newAttributions==null)this.newAttributions={};this.newAttributions[x]={newCounterIdx:this.newAttributionsCount,propagationType:y,snapshotAtStart:this.hasActiveCounters()?this.getActiveCounters().getTotals():null};this.newAttributionsCount++}return this};u.prototype.$ProfilingCounters5=function(x,y){"use strict";return y!=null&&y[x]!=null};u.prototype.$ProfilingCounters4=function(x){"use strict";return this.$ProfilingCounters5(x,this.propagatedAttributions)||this.$ProfilingCounters5(x,this.newAttributions)};u.$ProfilingCounters6=function(x,y,z){"use strict";for(var A=0;A<z.length;A++){var B=z[A],C=B[0],D=B[1],E=D.propagationType;if(E===q.ALL||y)x[C]=D}};u.prototype.getPropagatedContextForChild=function(x){"use strict";__p&&__p();var y=void 0;if(this.newAttributions==null)if(this.propagatedAttributions==null||x)return this.propagatedAttributions;else{y=ES("Object","entries",false,this.propagatedAttributions);var z=true;for(var A=0;A<y.length;A++){var B=y[A],C=B[0],D=B[1];if(D.propagationType===q.ONLY_ON_CONTINUATIONS_AND_FIRST_EXEC){z=false;break}}if(z)return this.propagatedAttributions}var E={};if(this.propagatedAttributions!=null)u.$ProfilingCounters6(E,x,y||ES("Object","entries",false,this.propagatedAttributions));if(this.newAttributions!=null)u.$ProfilingCounters6(E,x,ES("Object","entries",false,this.newAttributions));return E};u.prototype.getExecutionContext=function(x,y){"use strict";var z=m.ref_counting_fix&&x?this.getPropagatedContextForChild(x)||{}:{};if(y)u.$ProfilingCounters6(z,x,ES("Object","entries",false,y));return z};u.prototype.getActiveCounters=function(){"use strict";if(this.active==null)this.active=new v();return this.active};u.prototype.$ProfilingCounters7=function(){"use strict";return this.isGlobal};u.prototype.hasActiveCounters=function(){"use strict";return this.active!=null};u.nestContext=function(x){"use strict";s.push(x)};u.unnestContext=function(){"use strict";if(s.length===1)throw new Error("popping off the global context");var x=s.pop();if(x.hasActiveCounters())var y=x.getActiveCounters();if(x.hasActiveCounters()||x.processedNestedContexts!=null)u.currentContext().$ProfilingCounters3(x);return x};u.prototype.$ProfilingCounters3=function(x){var y=arguments.length<=1||arguments[1]===undefined?true:arguments[1];"use strict";if(this.$ProfilingCounters7())return;else if(!(y&&this.processedNestedContexts!=null&&this.processedNestedContexts.length>=r)){this.processedNestedContexts=this.processedNestedContexts||[];this.processedNestedContexts.push(x)}};u.prototype.getTimeSliceContextID=function(){"use strict";return this.$ProfilingCounters1};u.resetState=function(){"use strict";s=[new u(true,null,0)]};u.getHandle=function(){"use strict";return w};u.AttributionPropagation=q;function v(){"use strict";this.$SingleProfilingCounters1=null;this.$SingleProfilingCounters2=null;this.$SingleProfilingCounters3=null;this.$SingleProfilingCounters4=null}v.prototype.startTiming=function(x){"use strict";__p&&__p();var y=v.$SingleProfilingCounters5++,z={value:0,counter:x,id:y,lastStartTime:0},A=this.$SingleProfilingCounters1||[];this.$SingleProfilingCounters2=this.$SingleProfilingCounters2||{};this.$SingleProfilingCounters2[y]=A.length;A.push(z);var B=n();z.lastStartTime=B;if(A.length>1){var C=A[A.length-2];C.value+=B-C.lastStartTime}this.$SingleProfilingCounters1=A;return y};v.prototype.stopTiming=function(x){"use strict";__p&&__p();var y=n(),z=this.$SingleProfilingCounters2,A=this.$SingleProfilingCounters1;if(z==null||A==null){h.reportError(new Error("token does not match the counter context"));return 0}var B=z[x];delete z[x];if(B==null||A[B]==null)return 0;var C=null,D=0;while(A.length-1>B){var E=A.pop();D+=E.value;delete z[E.id];if(C==null&&E.lastStartTime!=null)C=E.lastStartTime}var F=A.pop();F.value+=y-(C||F.lastStartTime);F.value+=D;var G=this.$SingleProfilingCounters4||{};G[F.counter]=G[F.counter]||0;G[F.counter]+=F.value;if(A.length>0)A[A.length-1].lastStartTime=y;this.$SingleProfilingCounters1=A;this.$SingleProfilingCounters4=G;this.$SingleProfilingCounters2=z;return F.value};v.prototype.incrementCounter=function(x,y){"use strict";var z=this.$SingleProfilingCounters3||{};z[x]=z[x]||0;z[x]+=y;this.$SingleProfilingCounters3=z};v.prototype.getTotals=function(){"use strict";return babelHelpers["extends"]({},this.$SingleProfilingCounters4||{},this.$SingleProfilingCounters3||{})};v.prototype.openCounterCount=function(){"use strict";return this.$SingleProfilingCounters1!=null?this.$SingleProfilingCounters1.length:0};v.$SingleProfilingCounters5=1;s.push(new u(true,null,0));l.registerExecutionContextObserver(u.getObserver());var w=u.getObserver().expressInterest();b.ProfilingCounters=u;f.exports=u}),3);
__d("performanceNow",["performance"],(function a(b,c,d,e,f,g,h){var i;if(h.now)i=function i(){return h.now()};else i=function i(){return ES("Date","now",false)};f.exports=i}),null);
__d("emptyFunction",[],(function a(b,c,d,e,f,g){__p&&__p();function h(j){return function(){return j}}var i=function i(){};i.thatReturns=h;i.thatReturnsFalse=h(false);i.thatReturnsTrue=h(true);i.thatReturnsNull=h(null);i.thatReturnsThis=function(){return this};i.thatReturnsArgument=function(j){return j};f.exports=i}),null);
__d("nativeRequestAnimationFrame",[],(function a(b,c,d,e,f,g){var h=b.requestAnimationFrame&&b.requestAnimationFrame.nativeBackup||b.requestAnimationFrame||b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame||b.oRequestAnimationFrame||b.msRequestAnimationFrame;f.exports=h}),18);
__d("requestAnimationFramePolyfill",["emptyFunction","nativeRequestAnimationFrame"],(function a(b,c,d,e,f,g,h,i){var j=0,k=i||function(l){var m=ES("Date","now",false),n=Math.max(0,16-(m-j));j=m+n;return b.setTimeout(function(){l(ES("Date","now",false))},n)};k(h);f.exports=k}),18);
__d("IdleCallbackImplementation",["performanceNow","requestAnimationFramePolyfill"],(function a(b,c,d,e,f,g,h,i){__p&&__p();var j=[],k=0,l=0,m=-1,n=false,o=1e3/60,p=2;function q(C){return C}function r(C){return C}function s(C,D){var E,F=l++;j[F]=C;u();if(D!=null&&D.timeout>0)(function(){var G=q(F);b.setTimeout(function(){return A(G)},D.timeout)})();return q(F)}function t(C){var D=r(C);j[D]=null}function u(){if(!n){n=true;i(function(C){n=false;w(h()-C)})}}function v(C){var D=o-p;if(C<D)return D-C;var E=C%o;if(E>D||E<p)return 0;else return D-E}function w(C){__p&&__p();var D=h();if(D>m){var E=v(C);if(E>0){var F=D+E;z(F);m=F}}if(x())u()}function x(){return k<j.length}function y(){while(x()){var C=j[k];k++;if(C)return C}}function z(C){var D=void 0;while(h()<C&&(D=y()))D(new B(C))}function A(C){var D=r(C),E=j[D];if(E){t(C);E(new B(null))}}function B(C){"use strict";this.didTimeout=C==null;this.$IdleCallbackDeadline1=C}B.prototype.timeRemaining=function(){"use strict";var C=this.$IdleCallbackDeadline1;if(C!=null){var D=h();if(D<C)return C-D}return 0};f.exports={requestIdleCallback:s,cancelIdleCallback:t}}),null);
__d("requestIdleCallbackAcrossTransitions",["IdleCallbackImplementation","TimeSlice"],(function a(b,c,d,e,f,g,h,i){var j=b.requestIdleCallback||h.requestIdleCallback;f.exports=function k(l,m){return j.call(b,i.guard(l,"requestIdleCallback",{isContinuation:true}),m)}}),null);
__d("TimeSliceReferenceCounting",["ErrorUtils","ExecutionContextObservers","OnDemandExecutionContextObserver","ProfilingCounters","TimeSlice","TimeSliceInteractionSV","requestIdleCallbackAcrossTransitions"],(function a(b,c,d,e,f,g,h,i,j,k,l,m,n){__p&&__p();var o,p,q=[],r=[],s=null,t=null,u=1,v={},w={};function x(E,F,G,H){__p&&__p();if(E==null||E.length===0)return;var I=0,J=0,K=[];while(J<E.length){var L=E[J],M=true;if(!(H!==null&&H!==L.getRootContextID()&&F)){L.openReferenceCount--;if(L.openReferenceCount===0){K.push(L);M=false}}if(M){E[I]=L;I++}J++}E.splice(I,J-I);if(K.length>0)n(l.guard(function(){return ES(K,"forEach",true,function(L){return L.finish()})},"invoking onAllChildrenFinished callbacks",{isContinuation:false}))}function y(E,F){"use strict";this.$ReferenceCounter2=y.$ReferenceCounter1++;this.$ReferenceCounter3=E;this.$ReferenceCounter4=[];this.$ReferenceCounter5=false;this.$ReferenceCounter6=F;this.openReferenceCount=1;this.timeslices=[E]}y.prototype.isProfiling=function(){"use strict";return this.$ReferenceCounter6};y.prototype.addCallback=function(E){"use strict";if(!this.$ReferenceCounter5)this.$ReferenceCounter4.push(E);else E();return this};y.prototype.finish=function(){"use strict";if(!this.$ReferenceCounter5){this.$ReferenceCounter5=true;ES(this.$ReferenceCounter4,"forEach",true,function(E){return E()});delete this.$ReferenceCounter4}};y.prototype.getContinuationExecutionCounterID=function(){"use strict";return this.$ReferenceCounter2};y.prototype.isInsideContinuationExecution=function(){"use strict";var E=l.getContext();if(E==null)return false;else if(E.executionNumber>0&&E.id!==this.$ReferenceCounter3)return false;else return ES(q,"indexOf",true,this)!==-1||ES(r,"indexOf",true,this)!==-1};y.prototype.getTimeSliceContextsThisCounted=function(){"use strict";return this.timeslices};y.prototype.getRootContextID=function(){"use strict";return this.$ReferenceCounter3};y.$ReferenceCounter1=1;function z(E){}function A(E,F){ES(E,"forEach",true,function(G){var H=G.getContinuationExecutionCounterID(),I=F.find(function(J){return J.getContinuationExecutionCounterID()===H});if(!I)F.push(G)})}o=babelHelpers.inherits(B,j);p=o&&o.prototype;B.prototype.onNewContextCreatedWhileEnabled=function(E,F,G,H){"use strict";__p&&__p();var I=H&&H.isContinuation,J=void 0;if(E!=null&&I&&q.length>0){if(E.executionNumber>0)q=ES(q,"filter",true,function(M){return M.getRootContextID()===E.contextID});if(r.length!=0&&m.ref_counting_fix){ES(r,"forEach",true,function(M){return M.openReferenceCount++});J=r}else{ES(q,"forEach",true,function(M){return M.openReferenceCount++});J=q}}var K=u++,L={hasBeenInvoked:false,hasExecutionBeenCounted:false,parentReferenceCounters:J,creationID:K};G.__creationID=K;G.__cancelCallback=function(){if(L.parentReferenceCounters!=null&&!L.hasBeenInvoked){x(L.parentReferenceCounters,L.hasBeenInvoked,F,null);L.hasBeenInvoked=true}};return L};B.prototype.onBeforeContextStartedWhileEnabled=function(E,F,G){"use strict";__p&&__p();var H=r.slice();if(F&&F.parentReferenceCounters)A(F.parentReferenceCounters,r);var I={callerProfilingCounterID:t,callerReferenceCounters:q,callerExecutionCounters:H},J=F||{hasBeenInvoked:false,creationID:-1};J.hasBeenInvoked=true;var K=J.creationID,L=w[K];if(L){delete v[L];delete w[K]}q=J.parentReferenceCounters||[];var M=G&&G.isContinuation;if(!M&&m.ref_counting_cont_fix)r=[];if(m.ref_counting_cont_fix)ES(r,"forEach",true,function(N){return N.timeslices.push(E.contextID)});else ES(q,"forEach",true,function(N){return N.timeslices.push(E.contextID)});if(ES(q,"filter",true,function(N){return N.isProfiling()}).length>0&&E.executionNumber===0)t=k.startTimingInContext("REF_COUNTED_TIMESLICE_TIME",E.contextID);else t=null;return I};B.prototype.onDisable=function(){"use strict";t=null;q=[];r=[]};B.prototype.onAfterContextStartedWhileEnabled=function(E,F,G,H){"use strict";return G};B.prototype.onAfterContextEndedWhileEnabled=function(E,F,G,H){"use strict";__p&&__p();var I=E.executionNumber,J=E.name,K=E.contextID,L=F!=null?F.parentReferenceCounters:null;if(t!=null){k.stopTimingInContext(t,K);t=null}var M=s!=null&&s.getRootContextID()===E.contextID;if(L!=null||M)x(q,I>0,J,K);q=G.callerReferenceCounters;r=G.callerExecutionCounters;t=G.callerProfilingCounterID};B.prototype.getBeforeID=function(){"use strict";return i.beforeIDs.REFERENCE_COUNTING};B.prototype.getAfterID=function(){"use strict";return i.afterIDs.REFERENCE_COUNTING};function B(){"use strict";o.apply(this,arguments)}var C={onAllChildrenFinished:function E(F,G){var H=C.getObserver().expressInterest();return C.onAllChildrenFinishedWithoutAutoTurningObserverOn(F,H,G)},onAllChildrenFinishedWithoutAutoTurningObserverOn:function E(F,G,H){__p&&__p();var I=l.getContext();if(I==null){G();return null}var J=I.contextID;s=new y(J,H);s.addCallback(G);if(F)s.addCallback(F);q=q.slice();q.push(s);if(t==null&&s.isProfiling())t=k.startTimingInContext("REF_COUNTED_TIMESLICE_TIME",J);return s},registerForCancelling:function E(F,G){if(!D.isEnabled())return;if(!(v[F]!=null))if(!!F)if(typeof G.__cancelCallback==="function"&&G.__creationID!=null){v[F]=G;w[G.__creationID]=F}},cancelTimeSlice:function E(F){var G=v[F];if(G){delete v[F];delete w[G.__creationID];G.__cancelCallback()}},isValidCancellationToken:function E(F){return v[F]!=null},getObserver:function E(){return D}},D=new B();l.registerExecutionContextObserver(D);f.exports=C}),18);
__d("TimerStorage",[],(function a(b,c,d,e,f,g){var h={ANIMATION_FRAME:"ANIMATION_FRAME",IDLE_CALLBACK:"IDLE_CALLBACK",IMMEDIATE:"IMMEDIATE",INTERVAL:"INTERVAL",TIMEOUT:"TIMEOUT"},i={};ES(ES("Object","keys",false,h),"forEach",true,function(k){return i[k]={}});var j=babelHelpers["extends"]({},h,{set:function k(l,m){i[l][m]=true},unset:function k(l,m){delete i[l][m]},clearAll:function k(l,m){ES(ES("Object","keys",false,i[l]),"forEach",true,m);i[l]={}}});f.exports=j}),18);
__d("setTimeoutAcrossTransitions",["TimerStorage","TimeSlice","TimeSliceReferenceCounting"],(function a(b,c,d,e,f,g,h,i,j){var k=b.setTimeout.nativeBackup||b.setTimeout,l=h.TIMEOUT;function m(n,o){var p=i.guard(n,"setTimeout",{isContinuation:true});for(var q=arguments.length,r=Array(q>2?q-2:0),s=2;s<q;s++)r[s-2]=arguments[s];var t=Function.prototype.apply.call(k,b,[p,o].concat(r)),u=l+t;j.registerForCancelling(u,p);return t}f.exports=m}),18);
__d("Promise",["TimeSlice","invariant","setImmediateAcrossTransitions","setTimeoutAcrossTransitions"],(function a(b,c,d,e,f,g,h,i,j,k){"use strict";__p&&__p();function l(){}var m=null,n={};function o(G){try{return G.then}catch(H){m=H;return n}}function p(G,H){try{return G(H)}catch(I){m=I;return n}}function q(G,H,I){try{G(H,I)}catch(J){m=J;return n}}function r(G){__p&&__p();if(typeof this!=="object")throw new TypeError("Promises must be constructed via new");if(typeof G!=="function")throw new TypeError("not a function");this._state=0;this._value=null;this._deferreds=[];if(G===l)return;y(G,this)}r._noop=l;r.prototype.then=function(G,H){if(this.constructor!==r)return s(this,G,H);var I=new r(l);t(this,new x(G,H,I));return I};function s(G,H,I){return new G.constructor(function(u,v){var J=new r(l);J.then(u,v);t(G,new x(H,I,J))})}function t(G,H){__p&&__p();while(G._state===3)G=G._value;if(G._state===0){G._deferreds.push(H);return}j(function I(){__p&&__p();var J=G._state===1?H.onFulfilled:H.onRejected;if(J===null){H.continuation(function(){});if(G._state===1)u(H.promise,G._value);else v(H.promise,G._value);return}var K=p(ES(H.continuation,"bind",true,null,J),G._value);if(K===n)v(H.promise,m);else u(H.promise,K)})}function u(G,H){__p&&__p();if(H===G)return v(G,new TypeError("A promise cannot be resolved with itself."));if(H&&(typeof H==="object"||typeof H==="function")){var I=o(H);if(I===n)return v(G,m);if(I===G.then&&H instanceof r){G._state=3;G._value=H;w(G);return}else if(typeof I==="function"){y(ES(I,"bind",true,H),G);return}}G._state=1;G._value=H;w(G)}function v(G,H){G._state=2;G._value=H;w(G)}function w(G){for(var H=0;H<G._deferreds.length;H++)t(G,G._deferreds[H]);G._deferreds=null}function x(G,H,I){this.onFulfilled=typeof G==="function"?G:null;this.onRejected=typeof H==="function"?H:null;this.continuation=h.getGuardedContinuation("Promise Handler");this.promise=I}function y(G,H){__p&&__p();var I=false,J=q(G,function(K){if(I)return;I=true;u(H,K)},function(K){if(I)return;I=true;v(H,K)});if(!I&&J===n){I=true;v(H,m)}}r.prototype.done=function(G,H){var I=arguments.length?this.then.apply(this,arguments):this;I.then(null,function(J){k(function(){throw J},0)})};var z=F(true),A=F(false),B=F(null),C=F(undefined),D=F(0),E=F("");function F(G){var H=new r(r._noop);H._state=1;H._value=G;return H}r.resolve=function(G){__p&&__p();if(G instanceof r)return G;if(G===null)return B;if(G===undefined)return C;if(G===true)return z;if(G===false)return A;if(G===0)return D;if(G==="")return E;if(typeof G==="object"||typeof G==="function")try{var H=G.then;if(typeof H==="function")return new r(ES(H,"bind",true,G))}catch(I){return new r(function(u,v){v(I)})}return F(G)};r.all=function(G){__p&&__p();if(!ES("Array","isArray",false,G))G=[new r(function(){throw new TypeError("Promise.all must be passed an iterable.")})];var H=Array.prototype.slice.call(G);return new r(function(u,v){__p&&__p();if(H.length===0)return u([]);var I=H.length;function J(K,L){__p&&__p();if(L&&(typeof L==="object"||typeof L==="function"))if(L instanceof r&&L.then===r.prototype.then){while(L._state===3)L=L._value;if(L._state===1)return J(K,L._value);if(L._state===2)v(L._value);L.then(function(L){J(K,L)},v);return}else{var M=L.then;if(typeof M==="function"){var N=new r(ES(M,"bind",true,L));N.then(function(L){J(K,L)},v);return}}H[K]=L;if(--I===0)u(H)}for(var K=0;K<H.length;K++)J(K,H[K])})};r.reject=function(G){return new r(function(u,v){v(G)})};r.race=function(G){return new r(function(u,v){ES(G,"forEach",true,function(H){r.resolve(H).then(u,v)})})};r.prototype["catch"]=function(G){return this.then(null,G)};f.exports=r}),null);
__d("fbinstant/common/consoleLogger",[],(function a(b,c,d,e,f,g){"use strict";__p&&__p();var h={init:function i(j){if(!j)return;window.addEventListener("error",function(k){var l={type:"error",message:k&&k.message||null,filename:k&&k.filename||null,lineno:k&&k.lineno||null,colno:k&&k.colno||null,stack:k&&k.error&&k.error.stack||null};try{l.print=JSON.stringify(l)}catch(m){l.print=l.message}j(l)})}};f.exports=h}),null);
__d("InstantGamesErrorCode",[],(function a(b,c,d,e,f,g){f.exports=Object.freeze({ANALYTICS_POST_EXCEPTION:"ANALYTICS_POST_EXCEPTION",CLIENT_REQUIRES_UPDATE:"CLIENT_REQUIRES_UPDATE",CLIENT_UNSUPPORTED_OPERATION:"CLIENT_UNSUPPORTED_OPERATION",INVALID_OPERATION:"INVALID_OPERATION",INVALID_PARAM:"INVALID_PARAM",NETWORK_FAILURE:"NETWORK_FAILURE",PENDING_REQUEST:"PENDING_REQUEST",SAME_CONTEXT:"SAME_CONTEXT",UNKNOWN:"UNKNOWN",USER_INPUT:"USER_INPUT",ADS_FREQUENT_LOAD:"ADS_FREQUENT_LOAD",ADS_NO_FILL:"ADS_NO_FILL",ADS_NOT_LOADED:"ADS_NOT_LOADED",ADS_TOO_MANY_INSTANCES:"ADS_TOO_MANY_INSTANCES",PAYMENTS_USER_CANCELLED:"PAYMENTS_USER_CANCELLED",PAYMENTS_INVALID:"PAYMENTS_INVALID",PAYMENTS_NOT_ALLOWED:"PAYMENTS_NOT_ALLOWED",PAYMENTS_NOT_INITIALIZED:"PAYMENTS_NOT_INITIALIZED",PAYMENTS_PURCHASE_CREATION_FAILED:"PAYMENTS_PURCHASE_CREATION_FAILED"})}),null);
__d("fbinstant/common/errorCode",["InstantGamesErrorCode"],(function a(b,c,d,e,f,g,h){"use strict";var i=h;f.exports=i}),null);
__d("fbinstant/common/event",[],(function a(b,c,d,e,f,g){"use strict";__p&&__p();function h(){this.$Event1=[]}h.prototype.on=function(i){this.$Event1.push(i)};h.prototype.off=function(i){for(var j=0;j<this.$Event1.length;j++)if(this.$Event1[j]===i){this.$Event1.splice(j,1);return}};h.prototype.unbind=function(){this.$Event1=[]};h.prototype.triggerSubscribers=function(i){for(var j=0;j<this.$Event1.length;j++)this.$Event1[j](i)};f.exports=h}),null);
__d("fbinstant/common/requestAnimationFrameListener",["fbinstant/common/event"],(function a(b,c,d,e,f,g,h){"use strict";__p&&__p();var i=["requestAnimationFrame","webkitRequestAnimationFrame","mozRequestAnimationFrame","msRequestAnimationFrame"];function j(){this.$requestAnimationFrameListener1=new h()}j.prototype.init=function(){__p&&__p();for(var k=i,l=Array.isArray(k),m=0,k=l?k:k[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var n;if(l){if(m>=k.length)break;n=k[m++]}else{m=k.next();if(m.done)break;n=m.value}var o=n;this.$requestAnimationFrameListener2(o)}};j.prototype.on=function(k){this.$requestAnimationFrameListener1.on(k)};j.prototype.$requestAnimationFrameListener2=function(k){var l=window[k];if(l)window[k]=function(m){l(function(n){m(n);this.$requestAnimationFrameListener1.triggerSubscribers(n)}.bind(this))}.bind(this)};f.exports=new j()}),null);
__d("fbinstant/common/performanceTracker",["InstantGamesSDKMessages","fbinstant/common/requestAnimationFrameListener"],(function a(b,c,d,e,f,g,h,i){"use strict";__p&&__p();var j=1.5;(function(){var l;if(!window.performance)window.performance={};if(!window.performance.now)(function(){var m=Date.now();window.performance.now=function(){return Date.now()-m}})()})();function k(){this.$PerformanceTracker1=0;this.$PerformanceTracker2=0;this.$PerformanceTracker3=0;this.$PerformanceTracker4=0}k.prototype.init=function(l){__p&&__p();this.$PerformanceTracker5=l;i.init();this.$PerformanceTracker1=window.performance.now();i.on(function(m){var n=m-this.$PerformanceTracker1;if(this.$PerformanceTracker4&&n>j*this.$PerformanceTracker4)this.$PerformanceTracker5.send(h.ON_FRAME_DROP,n);this.$PerformanceTracker2+=n;this.$PerformanceTracker3++;this.$PerformanceTracker1=m}.bind(this));window.setInterval(function(){if(this.$PerformanceTracker3){var m=this.$PerformanceTracker2/this.$PerformanceTracker3;this.$PerformanceTracker4=m;this.$PerformanceTracker5.send(h.AVERAGE_FRAME_TIME,m)}this.$PerformanceTracker2=0;this.$PerformanceTracker3=0}.bind(this),1e3)};f.exports=new k()}),null);
__d("fbinstant/common/platform",[],(function a(b,c,d,e,f,g){"use strict";f.exports={IOS:"IOS",ANDROID:"ANDROID",WEB:"WEB",MOBILE_WEB:"MOBILE_WEB"}}),null);
__d("Set",[],(function a(b,c,d,e,f,g){"use strict";f.exports=function(b){return b.Set}(b)}),null);
__d("fbinstant/common/supportedFeaturesManager",["Set"],(function a(b,c,d,e,f,g,h){"use strict";__p&&__p();function i(){this.$SupportedFeaturesManager1=new h()}i.prototype.setSupported=function(j){this.$SupportedFeaturesManager1=new h(j)};i.prototype.isSupported=function(j){if(this.$SupportedFeaturesManager1.has(j))return true;return false};f.exports=new i()}),null);
__d("fbinstant/common/validator",["Promise","fbinstant/common/errorCode"],(function a(b,c,d,e,f,g,h,i){"use strict";__p&&__p();var j,k,l,m,n,o,p,q,r,s,t,u,v,w;x.prototype.validate=function(G,H){return H.validate(G)["catch"](function(I){var J={code:i.INVALID_PARAM,message:I.message};throw J})};x.prototype.object=function(){return new z()};x.prototype.array=function(){return new A()};x.prototype.string=function(){return new B()};x.prototype.number=function(){return new C()};x.prototype.integer=function(){return new D()};x.prototype["boolean"]=function(){return new E()};x.prototype.union=function(G){return new F(G)};function x(){}function y(){this.errors=[];this.isOptional=false;this.type="Any"}y.prototype.validate=function(G){this.validator(G);return new h(function(H,I){if(this.errors.length>0)return I(new Error(this.errors.map(function(J){return J.message}).join("\n")));return H(G)}.bind(this))};y.prototype.validator=function(G){return};y.prototype.optional=function(){this.isOptional=true;return this};y.prototype.addError=function(G,H){if(H){this.errors.push(new Error(H));return}this.errors.push(new Error("Expected a value of type "+this.type+", received: "+String(G)))};y.prototype.getErrors=function(){return this.errors};y.prototype.getType=function(){return this.type};j=babelHelpers.inherits(z,y);k=j&&j.prototype;function z(){k.constructor.call(this);this.$ObjectSchema1={};this.$ObjectSchema2=null;this.$ObjectSchema3=null;this.type="Object"}z.prototype.keys=function(G){this.$ObjectSchema1=G;return this};z.prototype.maxSize=function(G){this.$ObjectSchema2=G;return this};z.prototype.minSize=function(G){this.$ObjectSchema3=G;return this};z.prototype.validator=function(G){__p&&__p();if(G==null&&this.isOptional)return;if(typeof G!=="object"||Array.isArray(G))this.addError(G);this.$ObjectSchema4(G);for(var H in this.$ObjectSchema1){var I=G[H],J=this.$ObjectSchema1[H];if(!J.validator){this.addError(I,"Bad/missing validator for key: "+H);return}J.validator(I);var K=J.getErrors();if(K.length>0){var L="For key "+H+": ";for(var M=K,N=Array.isArray(M),O=0,M=N?M:M[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var P;if(N){if(O>=M.length)break;P=M[O++]}else{O=M.next();if(O.done)break;P=O.value}var Q=P;L+="["+Q.message+"],"}this.addError(I,L)}}};z.prototype.$ObjectSchema4=function(G){if(this.$ObjectSchema2||this.$ObjectSchema3){var H=JSON.stringify(G).length;if(this.$ObjectSchema2&&H>this.$ObjectSchema2)this.errors.push(new Error("Object must be at most "+String(this.$ObjectSchema2)+" characters when stringified, was "+String(H)));if(this.$ObjectSchema3&&H<this.$ObjectSchema3)this.errors.push(new Error("Object must be at least "+String(this.$ObjectSchema3)+" characters when stringified, was "+String(H)))}};l=babelHelpers.inherits(A,y);m=l&&l.prototype;function A(){m.constructor.call(this);this.$ArraySchema1=new y();this.$ArraySchema2=null;this.type="Array"}A.prototype.schemaType=function(G){this.$ArraySchema1=G;return this};A.prototype.length=function(G){this.$ArraySchema2=G;return this};A.prototype.validator=function(G){__p&&__p();if(G==null&&this.isOptional)return;if(!Array.isArray(G)){this.addError(G);return}if(this.$ArraySchema2&&G.length!==this.$ArraySchema2){this.addError(G,"Received an array of length "+String(G.length)+", expected an array of length "+String(this.$ArraySchema2));return}for(var H=G,I=Array.isArray(H),J=0,H=I?H:H[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var K;if(I){if(J>=H.length)break;K=H[J++]}else{J=H.next();if(J.done)break;K=J.value}var L=K;if(!this.$ArraySchema1.validator){this.addError(L,"Bad/missing validator for Array");return}this.$ArraySchema1.validator(L);var M=this.$ArraySchema1.getErrors();if(M.length>0){var N=this.$ArraySchema1.getType(),O="Array of type "+N+" contained a value of another type: "+String(L);this.addError(L,O);return}}};n=babelHelpers.inherits(B,y);o=n&&n.prototype;function B(){o.constructor.call(this);this.type="String"}B.prototype.validator=function(G){if(G==null&&this.isOptional)return;if(typeof G!=="string")this.addError(G)};p=babelHelpers.inherits(C,y);q=p&&p.prototype;function C(){q.constructor.call(this);this.type="Number"}C.prototype.validator=function(G){if(G==null&&this.isOptional)return;var H=typeof G==="number"&&!isNaN(G);if(!H)this.addError(G)};r=babelHelpers.inherits(D,C);s=r&&r.prototype;function D(){s.constructor.call(this);this.type="Integer"}D.prototype.validator=function(G){if(G==null&&this.isOptional)return;if(!Number.isInteger(G))this.addError(G)};t=babelHelpers.inherits(E,y);u=t&&t.prototype;function E(){u.constructor.call(this);this.type="Boolean"}E.prototype.validator=function(G){if(G==null&&this.isOptional)return;if(typeof G!=="boolean")this.addError(G)};v=babelHelpers.inherits(F,y);w=v&&v.prototype;function F(G){__p&&__p();w.constructor.call(this);this.$UnionSchema1=G;var H=" or ",I="";for(var J=G,K=Array.isArray(J),L=0,J=K?J:J[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var M;if(K){if(L>=J.length)break;M=J[L++]}else{L=J.next();if(L.done)break;M=L.value}var N=M;I+=N.type+H}this.type=I.substring(0,I.length-H.length)}F.prototype.validator=function(G){__p&&__p();if(G==null&&this.isOptional)return;var H=[];for(var I=this.$UnionSchema1,J=Array.isArray(I),K=0,I=J?I:I[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var L;if(J){if(K>=I.length)break;L=I[K++]}else{K=I.next();if(K.done)break;L=K.value}var M=L;M.validator(G);var N=M.getErrors();if(N.length===0)return;H.concat(N)}this.addError(G);for(var O=H,P=Array.isArray(O),Q=0,O=P?O:O[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var R;if(P){if(Q>=O.length)break;R=O[Q++]}else{Q=O.next();if(Q.done)break;R=Q.value}var S=R;this.errors.push(S)}};f.exports=new x()}),null);
__d("AppCustomEventType",[],(function a(b,c,d,e,f,g){f.exports={FB_MOBILE_ACTIVATE_APP:"fb_mobile_activate_app",FB_MOBILE_COMPLETE_REGISTRATION:"fb_mobile_complete_registration",FB_MOBILE_CONTENT_VIEW:"fb_mobile_content_view",FB_MOBILE_SEARCH:"fb_mobile_search",FB_MOBILE_RATE:"fb_mobile_rate",FB_MOBILE_TUTORIAL_COMPLETION:"fb_mobile_tutorial_completion",FB_MOBILE_ADD_TO_CART:"fb_mobile_add_to_cart",FB_MOBILE_ADD_TO_WISHLIST:"fb_mobile_add_to_wishlist",FB_MOBILE_INITIATED_CHECKOUT:"fb_mobile_initiated_checkout",FB_MOBILE_ADD_PAYMENT_INFO:"fb_mobile_add_payment_info",FB_MOBILE_PURCHASE:"fb_mobile_purchase",FB_MOBILE_LEVEL_ACHIEVED:"fb_mobile_level_achieved",FB_MOBILE_ACHIEVEMENT_UNLOCKED:"fb_mobile_achievement_unlocked",FB_MOBILE_SPENT_CREDITS:"fb_mobile_spent_credits",FB_DIRECT_INSTALL_SUCCESS:"fb_direct_install_success",APPMANAGER_CRASH_REPORT:"appmanager_crash_report",FB_PAGE_VIEW:"fb_page_view",FB_WEB_NEW_USER:"fb_web_new_user",FB_OTHER:"fb_other",FB_MESSENGER_BOT_NEW_USER:"fb_messenger_bot_new_user",FB_MESSENGER_BOT_MESSAGE_SENT:"fb_messenger_bot_message_sent",FB_MESSENGER_BOT_MESSAGE_RECEIVED:"fb_messenger_bot_message_received",FB_MESSENGER_BOT_THREAD_DELETED:"fb_messenger_bot_thread_deleted",FB_MESSENGER_BOT_STOPPED:"fb_messenger_bot_stopped",FB_MESSENGER_BOT_STARTED:"fb_messenger_bot_started",FB_MESSENGER_BOT_POSTBACK_CALLED:"fb_messenger_bot_postback_called",FB_INSTANT_EXPERIENCES_LAUNCH:"fb_instant_experiences_launch",FB_INSTANT_EXPERIENCES_NEW_USER:"fb_instant_experiences_new_user",FB_INSTANT_ARTICLES_CTA_SIGN_UP:"fb_instant_articles_cta_sign_up",FB_INSTANT_ARTICLES_CTA_IMPRESSION:"fb_instant_articles_cta_impression",FB_INSTANT_ARTICLES_NEW_USER:"fb_instant_articles_new_user",FB_INSTANT_ARTICLES_CLICK:"fb_instant_articles_click",FB_INSTANT_GAMES_NEW_USER:"fb_instant_games_new_user",FB_INSTANT_GAMES_LAUNCH:"fb_instant_games_launch",FB_INSTANT_GAMES_UPDATE_SENT:"fb_instant_games_update_sent",FB_INSTANT_GAMES_UPDATE_CLICK:"fb_instant_games_update_click",FB_INSTANT_GAMES_BOT_MESSAGE_SEND:"fb_instant_games_bot_message_sent",FB_INSTANT_GAMES_BOT_MESSAGE_CLICK:"fb_instant_games_bot_message_click",FB_INSTANT_GAMES_SESSION_PLAY:"fb_instant_games_session_play",FB_INSTANT_GAMES_PLATFORM_EVENT:"fb_instant_games_platform_event",FB_OFFLINE_PURCHASE:"fb_offline_purchase",FB_OFFLINE_NEW_USER:"fb_offline_new_user",FB_OFFLINE_LEAD:"fb_offline_lead",FB_PAGES_POST_REACTION:"fb_pages_post_reaction",FB_PAGES_POST_COMMENT:"fb_pages_post_comment",FB_PAGES_POST_SHARE:"fb_pages_post_share",FB_PAGES_POST_ANSWER:"fb_pages_post_answer",FB_PAGES_POST_RSVP:"fb_pages_post_rsvp",FB_PAGES_PAGE_CHECKIN:"fb_pages_page_checkin",FB_PAGES_MESSAGING_THREAD_READ:"fb_pages_messaging_thread_read",FB_PAGES_MESSAGING_MESSAGE_RECEIVED:"fb_pages_messaging_message_received",FB_PAGES_MESSAGING_MESSAGE_SENT:"fb_pages_messaging_message_sent",FB_PAGES_MESSAGING_BLOCK:"fb_pages_messaging_block",FB_PAGES_MESSAGING_DELETE_THREAD:"fb_pages_messaging_delete_thread",FB_PAGES_MESSAGING_MARK_SPAM:"fb_pages_messaging_mark_spam",FB_PAGES_MESSAGING_LABEL_ADDED:"fb_pages_messaging_label_added",FB_PAGES_MESSAGING_LABEL_REMOVED:"fb_pages_messaging_label_removed",FB_PAGES_MESSAGING_NEW_CONVERSATION:"fb_pages_messaging_new_conversation",FB_PAGES_POST_VIDEO_PLAY_CLICK:"fb_pages_post_video_play_click",FB_PAGES_POST_PHOTO_VIEW_CLICK:"fb_pages_post_photo_view_click",FB_PAGES_NEW_USER:"fb_pages_new_user",FB_CAMERA_EFFECT_OPENED:"fb_camera_effect_opened",FB_CAMERA_EFFECT_SHARED:"fb_camera_effect_shared",FB_CAMERA_EFFECT_SHARE_IMPRESSION:"fb_camera_effect_share_impression",FB_CAMERA_EFFECT_TIME_SPENT:"fb_camera_effect_time_spent",FB_CAMERA_EFFECT_POST_IMPRESSION:"fb_camera_effect_post_impression",FB_CAMERA_EFFECT_CAMERA_CAPTURE:"fb_camera_effect_camera_capture",FB_VIDEO_ASSET_VIDEO_VIEW:"fb_video_asset_video_view",FB_VIDEO_ASSET_IMPRESSION:"fb_video_asset_impression",FB_VIDEO_ASSET_REACTION:"fb_video_asset_reaction",FB_VIDEO_ASSET_COMMENT:"fb_video_asset_comment",FB_VIDEO_ASSET_SHARE:"fb_video_asset_share",FB_VIDEO_POST_VIDEO_VIEW:"fb_video_post_video_view",FB_VIDEO_POST_IMPRESSION:"fb_video_post_impression",FB_VIDEO_POST_REACTION:"fb_video_post_reaction",FB_VIDEO_POST_COMMENT:"fb_video_post_comment",FB_VIDEO_POST_SHARE:"fb_video_post_share",FB_MOBILE_INSTALL:"fb_mobile_first_app_launch",FB_MOBILE_DEACTIVATE_APP:"fb_mobile_deactivate_app",FB_BASE_EVENT:"fb_base_event",FB_NEW_USER:"fb_new_user",FB_PURCHASE:"fb_purchase",FB_PAGE_MESSAGING_ACTIVE_CONVERSATION:"fb_pages_messaging_active_conversation"}}),null);
__d("AppEventField",[],(function a(b,c,d,e,f,g){f.exports={ANALYTICS_PARTNER_APP_ID:"_analyticsPartnerAppid",APP_USER_ID:"_app_user_id",APP_VERSION:"_appVersion",EVENT_NAME:"_eventName",EVENT_NAME_MD5:"_eventName_md5",IMPLICITLY_LOGGED:"_implicitlyLogged",IS_TIMED_EVENT:"_isTimedEvent",LOG_TIME:"_logTime",ORDER_ID:"fb_order_id",SESSION_ID:"_session_id",UI:"_ui",VALUE_TO_SUM:"_valueToSum",COUNT:"$aggr.count"}}),null);
__d("FBEventsParamList",[],(function a(b,c,d,e,f,g){"use strict";__p&&__p();var h="deep",i="shallow";function j(){this.list=[]}j.prototype={append:function l(m,n){this._append(encodeURIComponent(m),n,h)},_append:function l(m,n,o){if(Object(n)!==n)this._appendPrimitive(m,n);else if(o===h)this._appendObject(m,n);else this._appendPrimitive(m,k(n))},_appendPrimitive:function l(m,n){if(n!=null)this.list.push([m,n])},_appendObject:function l(m,n){for(var o in n)if(Object.prototype.hasOwnProperty.call(n,o)){var p=m+"["+encodeURIComponent(o)+"]";this._append(p,n[o],i)}},each:function l(m){var n=this.list;for(var o=0,p=n.length;o<p;o++)m(n[o][0],n[o][1])},toQueryString:function l(){var m=[];this.each(function(n,o){m.push(n+"="+encodeURIComponent(o))});return m.join("&")}};function k(l){if(typeof JSON==="undefined"||JSON===null||!ES("JSON","stringify",false))return Object.prototype.toString.call(l);else return ES("JSON","stringify",false,l)}f.exports=j}),null);
__d("GraphApplicationActivitiesUserIDType",[],(function a(b,c,d,e,f,g){f.exports=Object.freeze({INSTANT_GAMES_PLAYER_ID:"INSTANT_GAMES_PLAYER_ID"})}),null);
__d("fbinstant/common/postEvent",[],(function a(b,c,d,e,f,g){"use strict";var h=function h(i,j){var k=new XMLHttpRequest();k.open("POST",i);k.setRequestHeader("Content-type","application/x-www-form-urlencoded");k.send(j.toQueryString())};f.exports=h}),null);
__d("fbinstant/common/analytics",["AppCustomEventType","AppEventField","FBEventsParamList","GraphApplicationActivitiesUserIDType","Set","fbinstant/common/errorCode","fbinstant/common/postEvent"],(function a(b,c,d,e,f,g,h,i,j,k,l,m,n){"use strict";__p&&__p();var o=h.FB_INSTANT_GAMES_LAUNCH,p=k.INSTANT_GAMES_PLAYER_ID;function q(){this.$Analytics1="WAITING";this.$Analytics6=[];this.$Analytics2=null;this.$Analytics3=/^apps-(\d+)\..*\.fbsbx\.com$/i;this.$Analytics4=new l()}q.prototype.init=function(r,s){__p&&__p();this.$Analytics2=r;this.$Analytics5=s;if(!this.$Analytics2)this.$Analytics2=this.$Analytics7();if(!this.$Analytics2){this.$Analytics1="FAILED";return}this.$Analytics8();this.$Analytics1="DONE"};q.prototype.logActive=function(){return this.logEvent(o)};q.prototype.logEvent=function(r,s,t){var event={eventName:r,valueToSum:s,parameters:t};if(this.$Analytics1==="WAITING"){this.$Analytics6.push(event);return null}else if(this.$Analytics1==="DONE")return this.$Analytics9([event]);else return{code:m.ANALYTICS_POST_EXCEPTION,message:"Failed to log analytics event"}};q.prototype.logAPICall=function(r){if(this.$Analytics4.has(r))return{code:m.ANALYTICS_POST_EXCEPTION,message:"Already logged this API event"};var s=this.logEvent("_FBInstant",null,{name:r});if(!s)this.$Analytics4.add(r);return s};q.prototype.logBeginAsyncAPICall=function(r){return this.logEvent("_FBInstant",null,{name:r,action:"begin"})};q.prototype.logResolveAsyncAPICall=function(r){return this.logEvent("_FBInstant",null,{name:r,action:"resolve"})};q.prototype.logRejectAsyncAPICall=function(r,s){return this.logEvent("_FBInstant",null,{name:r,action:"reject",code:s||null})};q.prototype.$Analytics10=function(){if(!this.$Analytics2)return null;return"https://graph.facebook.com/"+this.$Analytics2+"/activities"};q.prototype.$Analytics11=function(event){var r=babelHelpers["extends"]({},event.parameters,{app_id:this.$Analytics2});r[i.EVENT_NAME]=event.eventName;r[i.VALUE_TO_SUM]=event.valueToSum;return JSON.stringify(r)};q.prototype.$Analytics9=function(r){__p&&__p();if(!this.$Analytics2)return{code:m.ANALYTICS_POST_EXCEPTION,message:"Analytics failed to resolve the application ID."};try{var s=r.map(function(event){return this.$Analytics11(event)}.bind(this)),t=new j();t.append("event","CUSTOM_APP_EVENTS");t.append("extinfo",["ig1"]);t.append("user_id",this.$Analytics5);t.append("user_id_type",p);t.append("advertiser_tracking_enabled",1);t.append("application_tracking_enabled",1);t.append("custom_events",s);var u=this.$Analytics10();if(!u)return{code:m.ANALYTICS_POST_EXCEPTION,message:"Unable to use the analytics endpoint"};n(u,t)}catch(v){return{code:m.ANALYTICS_POST_EXCEPTION,message:v.message}}return null};q.prototype.$Analytics8=function(){if(this.$Analytics6.length===0)return null;this.$Analytics9(this.$Analytics6);this.$Analytics6=[]};q.prototype.$Analytics7=function(){var r=window.location.hostname;if(r){var s=this.$Analytics3.exec(r);if(s&&s.length&&s.length>1&&s[1])return s[1]}return null};f.exports=q}),null);
__d("fbinstant/common/supportedMessagesManager",["InstantGamesSDKMessages","Set"],(function a(b,c,d,e,f,g,h,i){"use strict";__p&&__p();var j=new i([h.INITIALIZE_ASYNC,h.ON_BEGIN_LOAD,h.ON_CONSOLE,h.ON_PROGRESS_LOAD,h.ON_GAME_READY,h.ON_SCORE,h.ON_SCREENSHOT,h.ON_PICTURE,h.ON_END_GAME,h.GET_PLAYER_DATA_ASYNC,h.SET_PLAYER_DATA_ASYNC]);function k(){this.$SupportedMessagesManager1=new i()}k.prototype.setSupported=function(l){this.$SupportedMessagesManager1=new i(l)};k.prototype.isSupported=function(l){if(j.has(l))return true;return this.$SupportedMessagesManager1.has(l)};f.exports=new k()}),null);
__d("fbinstant/releases/5.0/contextType",[],(function a(b,c,d,e,f,g){"use strict";f.exports={GROUP:"GROUP",POST:"POST",SOLO:"SOLO",THREAD:"THREAD"}}),null);
__d("fbinstant/releases/5.0/gameContext",["fbinstant/releases/5.0/contextType"],(function a(b,c,d,e,f,g,h){"use strict";__p&&__p();function i(j){__p&&__p();this.$GameContext4=null;var k=j.id,l=j.type,m=j.size;if(!k||!l||l===h.SOLO){this.$GameContext1=null;this.$GameContext2=null;this.$GameContext3=h.SOLO;return}this.$GameContext3=l;this.$GameContext1=k;this.$GameContext2=m||null}i.prototype.getID=function(){return this.$GameContext1};i.prototype.getType=function(){return this.$GameContext3};i.prototype.getSize=function(){return this.$GameContext2};i.prototype.getContextSizeResponse=function(){return this.$GameContext4};i.prototype.setContextSizeResponse=function(j){this.$GameContext4=j};f.exports=i}),null);
__d("fbinstant/common/eventBatcher",[],(function a(b,c,d,e,f,g){"use strict";__p&&__p();var h=5e3;function i(j){this.$EventBatcher4=function(){this.$EventBatcher3(this.$EventBatcher2);this.$EventBatcher2=[]}.bind(this);this.$EventBatcher3=j;this.$EventBatcher2=[];this.$EventBatcher1=null}i.prototype.startInterval=function(){var j=arguments.length<=0||arguments[0]===undefined?h:arguments[0];if(this.$EventBatcher1!==null)this.stopInterval();this.$EventBatcher1=setInterval(this.$EventBatcher4,j)};i.prototype.stopInterval=function(){if(!this.$EventBatcher1)return;clearInterval(this.$EventBatcher1);this.$EventBatcher1=null};i.prototype.logEvent=function(event){this.$EventBatcher2.push(event)};f.exports=i}),null);
/**
 * License: https://www.facebook.com/legal/license/IOrG1U-MQVN/
 */
__d("Alea",[],(function a(b,c,d,e,f,g){__p&&__p();function h(){__p&&__p();var j=4022871197,k=function k(l){__p&&__p();l=l.toString();for(var m=0;m<l.length;m++){j+=l.charCodeAt(m);var n=.02519603282416938*j;j=n>>>0;n-=j;n*=j;j=n>>>0;n-=j;j+=n*4294967296}return(j>>>0)*23283064365386963e-26};k.version="Mash 0.9";return k}function i(){__p&&__p();return function(j){__p&&__p();var k=0,l=0,m=0,n=1;if(j.length===0)j=[new Date()];var o=new h();k=o(" ");l=o(" ");m=o(" ");for(var p=0;p<j.length;p++){k-=o(j[p]);if(k<0)k+=1;l-=o(j[p]);if(l<0)l+=1;m-=o(j[p]);if(m<0)m+=1}o=null;var q=function q(){var r=2091639*k+n*23283064365386963e-26;k=l;l=m;m=r-(n=r|0);return m};q.version="Alea 0.9";q.args=j;return q}(Array.prototype.slice.call(arguments))}f.exports=i}),null);
__d("Random",["Alea","ServerNonce"],(function a(b,c,d,e,f,g,h){"use strict";__p&&__p();var i=4294967296,j=c("ServerNonce").ServerNonce,k=h(j),l={random:function m(){if(typeof window!=="undefined"&&typeof Uint32Array!=="undefined"){var n=new Uint32Array(1);if(window.crypto&&window.crypto.getRandomValues)return window.crypto.getRandomValues(n)[0]/i;else if(window.msCrypto&&window.msCrypto.getRandomValues)return window.msCrypto.getRandomValues(n)[0]/i}return k()},uint32:function m(){return Math.floor(this.random()*i)},coinflip:function m(n){if(n===0)return false;if(n<=1)return true;return l.random()*n<=1}};f.exports=l}),null);
__d("Map",[],(function a(b,c,d,e,f,g){"use strict";f.exports=function(b){return b.Map}(b)}),null);
__d("fbinstant/common/messageLocksMap",["InstantGamesSDKMessages"],(function a(b,c,d,e,f,g,h){"use strict";var i=[h.CONTEXT_CHOOSE_ASYNC,h.CONTEXT_CREATE_ASYNC,h.CONTEXT_SWITCH_ASYNC,h.SHARE_ASYNC],j=[h.FLUSH_PLAYER_DATA_ASYNC,h.SET_PLAYER_DATA_ASYNC],k={};k[h.SHARE_ASYNC]=i;k[h.CONTEXT_CHOOSE_ASYNC]=i;k[h.CONTEXT_CREATE_ASYNC]=i;k[h.CONTEXT_SWITCH_ASYNC]=i;k[h.FLUSH_PLAYER_DATA_ASYNC]=j;k[h.CONTEXT_MATCH_CREATE_ASYNC]=[h.CONTEXT_MATCH_CREATE_ASYNC];f.exports=k}),null);
__d("fbinstant/common/exclusiveMessageManager",["Promise","InstantGamesErrorCode","Map","fbinstant/common/messageLocksMap","invariant"],(function a(b,c,d,e,f,g,h,i,j,k,l){"use strict";__p&&__p();function m(){this.$ExclusiveMessageManager1=new j()}m.prototype.isLocked=function(n){return this.$ExclusiveMessageManager1.has(n)};m.prototype.lockOrThrow=function(n){__p&&__p();if(this.isLocked(n)){var o=this.$ExclusiveMessageManager1.get(n);return this.$ExclusiveMessageManager2(String(o))}var p=k[n];if(!p)return h.resolve();for(var q=p,r=Array.isArray(q),s=0,q=r?q:q[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var t;if(r){if(s>=q.length)break;t=q[s++]}else{s=q.next();if(s.done)break;t=s.value}var u=t;if(this.$ExclusiveMessageManager1.has(u)){var v=this.$ExclusiveMessageManager1.get(u);v!==undefined||l(0);return this.$ExclusiveMessageManager2(v)}}for(var w=p,x=Array.isArray(w),y=0,w=x?w:w[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var z;if(x){if(y>=w.length)break;z=w[y++]}else{y=w.next();if(y.done)break;z=y.value}var A=z;this.$ExclusiveMessageManager1.set(A,n)}return h.resolve()};m.prototype.release=function(n){__p&&__p();var o=k[n];if(!o)return;for(var p=o,q=Array.isArray(p),r=0,p=q?p:p[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var s;if(q){if(r>=p.length)break;s=p[r++]}else{r=p.next();if(r.done)break;s=r.value}var t=s;this.$ExclusiveMessageManager1["delete"](t)}};m.prototype.reset_TESTINGONLY=function(){this.$ExclusiveMessageManager1=new j()};m.prototype.$ExclusiveMessageManager2=function(n){return h.reject({code:i.PENDING_REQUEST,message:"There is currently a pending request for locking message: "+n})};f.exports=new m()}),null);
__d("fbinstant/releases/5.0/apiError",["fbinstant/common/errorCode"],(function a(b,c,d,e,f,g,h){"use strict";function i(j){this.code=j.code||h.UNKNOWN;this.message=j.message;if(this.code===h.CLIENT_REQUIRES_UPDATE)this.code=h.CLIENT_UNSUPPORTED_OPERATION}f.exports=i}),null);
__d("fbinstant/releases/5.0/messageSender",["Promise","InstantGamesSDKMessages","Random","fbinstant/common/errorCode","fbinstant/common/event","fbinstant/common/exclusiveMessageManager","fbinstant/common/supportedMessagesManager","fbinstant/releases/5.0/apiError"],(function a(b,c,d,e,f,g,h,i,j,k,l,m,n,o){"use strict";__p&&__p();function p(q){this.$MessageSender4=q;this.$MessageSender1={};this.$MessageSender2=new l();this.$MessageSender3=new l()}p.prototype.initialize=function(q){__p&&__p();this.$MessageSender6=q.source;this.$MessageSender5=q.sender;this.$MessageSender2.on(function(t){this.$MessageSender7(t,true)}.bind(this));this.$MessageSender3.on(function(t){this.$MessageSender7(t,false)}.bind(this));var r=new RegExp("[?&]IsMobileWeb(=([^&#]*)|&|#|$)","i"),s=r.exec(window.location.href);if(!s||!s[2])return;window.IsMobileWeb=parseInt(s[2],10)===1};p.prototype.getResolvePromiseEvent=function(){return this.$MessageSender2};p.prototype.getRejectPromiseEvent=function(){return this.$MessageSender3};p.prototype.send=function(q,r){if(!this.$MessageSender6||!this.$MessageSender5||!n.isSupported(q))return;this.$MessageSender5.postMessage(this.$MessageSender8({type:q,content:r,destination:this.$MessageSender6}),"*")};p.prototype.sendAsync=function(q,r){if(!n.isSupported(q))return h.reject(new o({code:k.CLIENT_UNSUPPORTED_OPERATION,message:"Client does not support the message: "+q}));return m.lockOrThrow(q).then(function(){return this.$MessageSender9(q,r).then(function(s){m.release(q);return s})["catch"](function(s){m.release(q);throw s})}.bind(this))["catch"](function(s){throw new o(s)})};p.prototype.sendPassThroughAsync=function(q,r){var s=JSON.stringify(r||{}),t={data:s,request:q,sdkVersion:this.$MessageSender4};return this.sendAsync(i.SEND_PASS_THROUGH_ASYNC,t).then(function(u){if(!u)return h.reject(new o({code:k.UNKNOWN,message:"No response data provided"}));var v=JSON.parse(u),w=v.data,x=v.errorCode,y=v.errorMessage;if(x)return h.reject(new o({code:x,message:y||""}));return w})};p.prototype.$MessageSender8=function(q){switch(this.$MessageSender6){case"Android":case"quicksilver-rn":return JSON.stringify(q)}return q};p.prototype.$MessageSender10=function(q){return q+"_"+j.uint32().toString()};p.prototype.$MessageSender11=function(q,r,s){this.$MessageSender1[q]={resolve:r,reject:s}};p.prototype.$MessageSender7=function(q,r){__p&&__p();var s=q.promiseID;if(!s||!this.$MessageSender1[s])return;var t=this.$MessageSender1[s];if(r&&t.resolve)t.resolve(q.data);else if(!r&&t.reject){var u=q.data;if(!u)u=new o({message:""});else u=new o({code:u.code||k.UNKNOWN,message:u.message||""});t.reject(u)}delete this.$MessageSender1[s]};p.prototype.$MessageSender9=function(q,r){return new h(function(s,t){var u=this.$MessageSender10(q);this.$MessageSender11(u,s,t);var v=r||{};v.promiseID=u;this.send(q,v)}.bind(this))};f.exports=p}),null);
__d("fbinstant/releases/5.0/internalEventLogger",["InstantGamesPassThroughRequestType","fbinstant/common/eventBatcher","fbinstant/releases/5.0/messageSender"],(function a(b,c,d,e,f,g,h,i,j){"use strict";__p&&__p();function k(){this.$InternalEventLogger3=function(l){if(!this.$InternalEventLogger2)return;if(l.length<=0)return;this.$InternalEventLogger2.sendPassThroughAsync(h.SDK_EVENT,{events:l})}.bind(this);this.$InternalEventLogger1=new i(this.$InternalEventLogger3)}k.prototype.initialize=function(l){this.$InternalEventLogger2=l;this.$InternalEventLogger1.startInterval()};k.prototype.logEvent=function(l,m,n){this.$InternalEventLogger1.logEvent({type:l,data:babelHelpers["extends"]({},n,{contextID:m.getContext().getID()})})};f.exports=k}),null);
__d("fbinstant/releases/5.0/paymentsState",["Promise","fbinstant/common/event"],(function a(b,c,d,e,f,g,h,i){"use strict";__p&&__p();function j(){this.$PaymentsState3=false;this.$PaymentsState1=new i();this.$PaymentsState2=new h(function(k,l){this.$PaymentsState1.on(function(){this.$PaymentsState3=true;k();this.$PaymentsState1.unbind()}.bind(this))}.bind(this))}j.prototype.getPaymentsInitializedEvent=function(){return this.$PaymentsState1};j.prototype.isClientReady=function(){return this.$PaymentsState3};j.prototype.onInitialized=function(k){this.$PaymentsState2.done(k)};f.exports=j}),null);
__d("fbinstant/releases/5.0/internalStates",["InstantGamesGameState","fbinstant/common/analytics","fbinstant/common/event","fbinstant/common/supportedFeaturesManager","fbinstant/common/supportedMessagesManager","fbinstant/releases/5.0/contextType","fbinstant/releases/5.0/gameContext","fbinstant/releases/5.0/internalEventLogger","fbinstant/releases/5.0/messageSender","fbinstant/releases/5.0/paymentsState"],(function a(b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){"use strict";__p&&__p();function r(){__p&&__p();this.$InternalStates24="fbinstant.5.0".substring("fbinstant.".length);this.$InternalStates15=new p(this.$InternalStates24);this.$InternalStates1=new i();this.$InternalStates2=new j();this.$InternalStates3=null;this.$InternalStates4=null;this.$InternalStates5=new n({type:m.SOLO});this.$InternalStates6=null;this.$InternalStates7=0;this.$InternalStates9=null;this.$InternalStates8=null;this.$InternalStates10=h.LOADING;this.$InternalStates11=new j();this.$InternalStates12=false;this.$InternalStates13=new o();this.$InternalStates14=null;this.$InternalStates17=new q();this.$InternalStates18=null;this.$InternalStates19=null;this.$InternalStates20=null;this.$InternalStates21=null;this.$InternalStates22=null;this.$InternalStates23=new j();this.$InternalStates16=new j()}r.prototype.initialize=function(s){__p&&__p();if(s.appID)this.setAppID(s.appID);this.setLocale(s.locale);this.setPlayerID(s.playerID);this.setPlayerName(s.playerName);this.setPlayerPhoto(s.playerPhoto);if(s.supportedMessages&&Array.isArray(s.supportedMessages))l.setSupported(s.supportedMessages);if(s.supportedFeatures&&Array.isArray(s.supportedFeatures))k.setSupported(s.supportedFeatures);if(s.entryPointData)try{this.setEntryPointData(JSON.parse(s.entryPointData))}catch(t){}if(s.entryPoint)this.setRawSource(s.entryPoint);this.updateContext(s);this.setInitialized();this.getAnalytics().init(this.getAppID(),this.getPlayerID());this.getAnalyticsLogEvent().on(function(event){var u=event.eventName,v=event.valueToSum,w=event.parameters;if(!u)return;this.getAnalytics().logEvent(u,v!=null?v:null,w||null)}.bind(this));this.getInternalEventLogger().initialize(this.getMessageSender())};r.prototype.updateContext=function(s){if(!s.contextType)return;this.setContextPlayersPromise(null);this.$InternalStates5=new n({id:s.contextID,size:s.contextSize,type:s.contextType.toUpperCase()})};r.prototype.setAppID=function(s){this.$InternalStates3=s};r.prototype.setLocale=function(s){this.$InternalStates14=s};r.prototype.setPlayerID=function(s){this.$InternalStates19=s};r.prototype.setPlayerName=function(s){this.$InternalStates20=s};r.prototype.setPlayerPhoto=function(s){this.$InternalStates21=s};r.prototype.setRawSource=function(s){this.$InternalStates22=s};r.prototype.setEntryPoint=function(s){this.$InternalStates9=s};r.prototype.setEntryPointData=function(s){this.$InternalStates8=s};r.prototype.setInitialized=function(){this.$InternalStates12=true};r.prototype.setPlatform=function(s){this.$InternalStates18=s};r.prototype.setLoadingProgress=function(s){this.$InternalStates7=s};r.prototype.setGameState=function(s){this.$InternalStates10=s};r.prototype.setConnectedPlayersPromise=function(s){this.$InternalStates4=s};r.prototype.setContextPlayersPromise=function(s){this.$InternalStates6=s};r.prototype.getAnalytics=function(){return this.$InternalStates1};r.prototype.getAppID=function(){return this.$InternalStates3};r.prototype.getConnectedPlayersPromise=function(){return this.$InternalStates4};r.prototype.getContext=function(){return this.$InternalStates5};r.prototype.getContextPlayersPromise=function(){return this.$InternalStates6};r.prototype.getLoadingProgress=function(){return this.$InternalStates7};r.prototype.getEntryPoint=function(){return this.$InternalStates9};r.prototype.getEntryPointData=function(){return this.$InternalStates8};r.prototype.getGameState=function(){return this.$InternalStates10};r.prototype.getGameStartEvent=function(){return this.$InternalStates11};r.prototype.isInitialized=function(){return this.$InternalStates12};r.prototype.getInternalEventLogger=function(){return this.$InternalStates13};r.prototype.getLocale=function(){return this.$InternalStates14};r.prototype.getMessageSender=function(){return this.$InternalStates15};r.prototype.getPaymentsState=function(){return this.$InternalStates17};r.prototype.getPlatform=function(){return this.$InternalStates18};r.prototype.getPlayerID=function(){return this.$InternalStates19};r.prototype.getPlayerName=function(){return this.$InternalStates20};r.prototype.getPlayerPhoto=function(){return this.$InternalStates21};r.prototype.getRestartEvent=function(){return this.$InternalStates23};r.prototype.getPauseEvent=function(){return this.$InternalStates16};r.prototype.getAnalyticsLogEvent=function(){return this.$InternalStates2};r.prototype.getSdkVersion=function(){return this.$InternalStates24};r.prototype.getRawSource=function(){return this.$InternalStates22};f.exports=new r()}),null);
__d("InstantGamesSDKEventType",[],(function a(b,c,d,e,f,g){f.exports=Object.freeze({API_CALL:"api_call",API_BEGIN_ASYNC:"api_begin_async",API_REJECT_ASYNC:"api_reject_async",API_RESOLVE_ASYNC:"api_resolve_async"})}),null);
__d("InstantGamesSDKEvents",[],(function a(b,c,d,e,f,g){f.exports=Object.freeze({API:"API"})}),null);
__d("fbinstant/releases/5.0/logger",["InstantGamesSDKEvents","InstantGamesSDKEventType","fbinstant/releases/5.0/internalStates"],(function a(b,c,d,e,f,g,h,i,j){"use strict";__p&&__p();function k(q,r){return q.then(function(s){o(r);return s})["catch"](function(s){var t=s&&s.code||null;n(r,t);throw s})}function l(q){var r=j.getAnalytics();r.logAPICall(q);p(h.API,{type:i.API_CALL,name:q})}function m(q){var r=j.getAnalytics();r.logBeginAsyncAPICall(q);p(h.API,{type:i.API_BEGIN_ASYNC,name:q})}function n(q,r){var s=j.getAnalytics();s.logRejectAsyncAPICall(q,r);p(h.API,{type:i.API_REJECT_ASYNC,name:q,code:r})}function o(q){var r=j.getAnalytics();r.logResolveAsyncAPICall(q);p(h.API,{type:i.API_RESOLVE_ASYNC,name:q})}function p(q,r){j.getInternalEventLogger().logEvent(q,j,r)}f.exports={logAPICall:l,logBeginAsync:m,logAsyncResult:k,logReject:n,logResolve:o}}),null);
__d("fbinstant/releases/5.0/ads",["InstantGamesSDKMessages","fbinstant/common/validator","fbinstant/releases/5.0/internalStates","fbinstant/releases/5.0/logger"],(function a(b,c,d,e,f,g,h,i,j,k){"use strict";__p&&__p();function l(m){this.$AdInstance1=m}l.prototype.getPlacementID=function(){return this.$AdInstance1.placementID};l.prototype.loadAsync=function(){var m="AdInstance_loadAsync";k.logBeginAsync(m);var n=j.getMessageSender().sendAsync(h.LOAD_AD_ASYNC,{adInstanceID:this.$AdInstance1.adInstanceID});return k.logAsyncResult(n,m).then(function(){})};l.prototype.showAsync=function(){var m="AdInstance_showAsync";k.logBeginAsync(m);var n=j.getMessageSender().sendAsync(h.SHOW_AD_ASYNC,{adInstanceID:this.$AdInstance1.adInstanceID});return k.logAsyncResult(n,m).then(function(){})};f.exports={AdInstance:l,getInterstitialAdAsync:function m(n){return i.validate(n,i.string()).then(function(){return j.getMessageSender().sendAsync(h.GET_INTERSTITIAL_AD_ASYNC,{placementID:n})}).then(function(o){return new l(o)})},getRewardedVideoAsync:function m(n){return i.validate(n,i.string()).then(function(){return j.getMessageSender().sendAsync(h.GET_REWARDED_VIDEO_ASYNC,{placementID:n})}).then(function(o){return new l(o)})}}}),null);
__d("InstantGamesChallengePickerFilter",[],(function a(b,c,d,e,f,g){f.exports=Object.freeze({NEW_CONTEXT_ONLY:"NEW_CONTEXT_ONLY",INCLUDE_EXISTING_CHALLENGES:"INCLUDE_EXISTING_CHALLENGES",NEW_PLAYERS_ONLY:"NEW_PLAYERS_ONLY"})}),null);
__d("InstantGamesContextMatchStatus",[],(function a(b,c,d,e,f,g){f.exports=Object.freeze({ACTIVE:"ACTIVE",ENDED:"ENDED"})}),null);
__d("fbinstant/releases/5.0/activityStore",["Promise","InstantGamesContextMatchStatus","InstantGamesSDKMessages","fbinstant/common/errorCode","fbinstant/common/validator","fbinstant/releases/5.0/apiError","fbinstant/releases/5.0/internalStates","fbinstant/releases/5.0/logger"],(function a(b,c,d,e,f,g,h,i,j,k,l,m,n,o){"use strict";__p&&__p();var p=64,q=2048;function r(s){var t=s.id,u=s.contextID,v=s.status;if(!t||!u||!v)throw new m({code:k.UNKNOWN,message:"Context activity store has an invalid configuration"});this.$ActivityStore1=s;this.$ActivityStore1.name=this.$ActivityStore1.name!=null?this.$ActivityStore1.name:null;this.$ActivityStore2=false}r.prototype.getID=function(){o.logAPICall("activityStore_getID");return this.$ActivityStore1.id};r.prototype.getContextID=function(){o.logAPICall("activityStore_getContextID");return this.$ActivityStore1.contextID};r.prototype.getName=function(){o.logAPICall("activityStore_getName");return this.$ActivityStore1.name};r.prototype.getStatus=function(){o.logAPICall("activityStore_getStatus");return this.$ActivityStore1.status};r.prototype.endAsync=function(){__p&&__p();var s="activityStore_endAsync";o.logBeginAsync(s);var t=this.$ActivityStore3().then(function(){return n.getMessageSender().sendAsync(j.CONTEXT_MATCH_END_ASYNC,{contextID:this.$ActivityStore1.contextID,matchID:this.$ActivityStore1.id}).then(function(u){return this.$ActivityStore4().then(function(){return u})}.bind(this))["catch"](function(u){return this.$ActivityStore4().then(function(){throw u})}.bind(this))}.bind(this)).then(function(u){this.$ActivityStore1=u;return this}.bind(this));return o.logAsyncResult(t,s)};r.prototype.getDataAsync=function(s){var t="activityStore_getDataAsync";o.logBeginAsync(t);var u=l.validate(s,l.array().schemaType(l.string())).then(function(){return n.getMessageSender().sendAsync(j.CONTEXT_MATCH_DATA_FETCH_ASYNC,{contextID:this.$ActivityStore1.contextID,keys:s,matchID:this.$ActivityStore1.id})}.bind(this)).then(this.$ActivityStore5);return o.logAsyncResult(u,t)};r.prototype.saveDataAsync=function(s){__p&&__p();var t="activityStore_saveDataAsync";o.logBeginAsync(t);var u=this.$ActivityStore3().then(function(){return l.validate(s,l.object()).then(this.$ActivityStore6).then(function(v){return n.getMessageSender().sendAsync(j.CONTEXT_MATCH_DATA_SAVE_ASYNC,{contextID:this.$ActivityStore1.contextID,matchID:this.$ActivityStore1.id,data:v})}.bind(this)).then(function(){return this.$ActivityStore4().then(function(){return})}.bind(this))["catch"](function(v){return this.$ActivityStore4().then(function(){throw v})}.bind(this))}.bind(this));return o.logAsyncResult(u,t)};r.prototype.incrementDataAsync=function(s){__p&&__p();var t="activityStore_incrementDataAsync";o.logBeginAsync(t);var u=l.validate(s,l.object()).then(function(){for(var v in s)if(!Number.isInteger(s[v]))return h.reject(new m({code:k.INVALID_PARAM,message:'Provided key "'+v+'" contained a non-integer value: '+String(s[v])}));return h.resolve(JSON.stringify(s))}).then(function(){return this.$ActivityStore3()}.bind(this)).then(function(){return n.getMessageSender().sendAsync(j.CONTEXT_MATCH_DATA_INC_ASYNC,{contextID:this.$ActivityStore1.contextID,data:s,keys:Object.keys(s),matchID:this.$ActivityStore1.id}).then(function(v){return this.$ActivityStore4().then(function(){return v})}.bind(this))["catch"](function(v){return this.$ActivityStore4().then(function(){throw v})}.bind(this))}.bind(this)).then(this.$ActivityStore5);return o.logAsyncResult(u,t)};r.prototype.$ActivityStore3=function(){if(this.$ActivityStore2)return h.reject(new m({code:k.PENDING_REQUEST,message:"Cannot mutate a store that has a pending mutation."}));if(this.getStatus()===i.ENDED)return h.reject(new m({code:k.INVALID_OPERATION,message:"Cannot mutate a store that has ended."}));if(n.getContext().getID()!==this.$ActivityStore1.contextID)return h.reject(new m({code:k.INVALID_PARAM,message:"Cannot mutate a store in a context other than the current one."}));this.$ActivityStore2=true;return h.resolve()};r.prototype.$ActivityStore4=function(){this.$ActivityStore2=false;return h.resolve()};r.prototype.$ActivityStore6=function(s){__p&&__p();var t={};for(var u in s){if(new Blob([u]).size>p)return h.reject(new m({code:k.INVALID_PARAM,message:'Key "'+u+'" in provided data was greater than '+String(p)+" byte limit"}));var v=s[u],w=JSON.stringify(v);if(new Blob([w]).size>q)return h.reject(new m({code:k.INVALID_PARAM,message:'Value "'+w+'" in provided data was greater than '+String(q)+" byte limit"}));t[u]=w}return h.resolve(JSON.stringify(t))};r.prototype.$ActivityStore5=function(s){var t=JSON.parse(s),u={};for(var v in t){var w=t[v],x=JSON.parse(w);u[v]=x}return h.resolve(u)};f.exports=r}),null);
__d("fbinstant/releases/5.0/connectedPlayers",["InstantGamesSDKMessages","fbinstant/releases/5.0/internalStates"],(function a(b,c,d,e,f,g,h,i){"use strict";__p&&__p();function j(l){this.$ConnectedPlayer1=l}j.prototype.getID=function(){return this.$ConnectedPlayer1.id};j.prototype.getName=function(){return this.$ConnectedPlayer1.name||null};j.prototype.getPhoto=function(){return this.$ConnectedPlayer1.photo||null};var k={fetchAsync:function l(){return i.getMessageSender().sendAsync(h.GET_CONNECTED_PLAYERS_ASYNC,{}).then(function(m){return m.map(function(n){return new j(n)})})},ConnectedPlayer:j};f.exports=k}),null);
__d("fbinstant/releases/5.0/contextPlayers",["InstantGamesSDKMessages","fbinstant/releases/5.0/internalStates"],(function a(b,c,d,e,f,g,h,i){"use strict";__p&&__p();function j(l){this.$ContextPlayer1=l}j.prototype.getID=function(){return this.$ContextPlayer1.id};j.prototype.getName=function(){return this.$ContextPlayer1.name||null};j.prototype.getPhoto=function(){return this.$ContextPlayer1.photo||null};var k={fetchAsync:function l(){return i.getMessageSender().sendAsync(h.CONTEXT_PLAYERS_FETCH_ASYNC,{}).then(function(m){return m.map(function(n){return new j(n)})})},ContextPlayer:j};f.exports=k}),null);
__d("fbinstant/releases/5.0/context",["Promise","InstantGamesChallengePickerFilter","InstantGamesContextMatchStatus","InstantGamesSDKMessages","Set","fbinstant/common/errorCode","fbinstant/common/validator","fbinstant/releases/5.0/activityStore","fbinstant/releases/5.0/apiError","fbinstant/releases/5.0/connectedPlayers","fbinstant/releases/5.0/contextPlayers","fbinstant/releases/5.0/internalStates","fbinstant/releases/5.0/logger"],(function a(b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t){"use strict";__p&&__p();var u={getID:function v(){t.logAPICall("context_getID");return s.getContext().getID()},getType:function v(){t.logAPICall("context_getType");return s.getContext().getType()},isSizeBetween:function v(w,x){__p&&__p();t.logAPICall("context_isSizeBetween");var y=s.getContext().getContextSizeResponse();if(y)return y;var z=s.getContext().getSize();if(w!==null&&!Number.isInteger(w)||x!==null&&!Number.isInteger(x)||z==null)return null;var A=false;if((!w||z>=w)&&(!x||z<=x))A=true;var B={answer:A,minSize:w,maxSize:x};s.getContext().setContextSizeResponse(B);return B},switchAsync:function v(w){__p&&__p();var x="context_switchAsync";t.logBeginAsync(x);if(w===s.getContext().getID()){t.logReject(x,m.SAME_CONTEXT);return h.reject(new p({code:m.SAME_CONTEXT,message:"Must specify a context other than the current one."}))}var y=n.validate(w,n.string()).then(function(){return s.getMessageSender().sendAsync(k.CONTEXT_SWITCH_ASYNC,{id:w})}).then(function(z){s.updateContext(z);return});return t.logAsyncResult(y,x)},chooseAsync:function v(w){__p&&__p();var x="context_chooseAsync";t.logBeginAsync(x);var y=w||{};y.filters=y.filters||[];y.maxSize=y.maxSize||null;y.minSize=y.minSize||null;if(y.maxSize&&y.maxSize<2){t.logReject(x,m.INVALID_PARAM);return h.reject(new p({code:m.INVALID_PARAM,message:"The maximum context size must be at least 2"}))}else if(y.minSize&&y.minSize<2){t.logReject(x,m.INVALID_PARAM);return h.reject(new p({code:m.INVALID_PARAM,message:"The minimum context size must be at least 2"}))}else if(y.maxSize&&y.minSize&&y.minSize>y.maxSize){t.logReject(x,m.INVALID_PARAM);return h.reject(new p({code:m.INVALID_PARAM,message:"The min size cannot be greater than the max size"}))}for(var z=y.filters,A=Array.isArray(z),B=0,z=A?z:z[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var C;if(A){if(B>=z.length)break;C=z[B++]}else{B=z.next();if(B.done)break;C=B.value}var D=C;if(!Object.prototype.hasOwnProperty.call(i,D)){t.logReject(x,m.INVALID_PARAM);return h.reject(new p({code:m.INVALID_PARAM,message:'Filter "'+D+'" is not supported'}))}}var E=n.object().keys({filters:n.array().schemaType(n.string()),maxSize:n.number().optional(),minSize:n.number().optional()}),F=n.validate(y,E).then(function(){return s.getMessageSender().sendAsync(k.CONTEXT_CHOOSE_ASYNC,y)}).then(function(G){s.updateContext(G);return});return t.logAsyncResult(F,x)},createAsync:function v(w){__p&&__p();var x="context_createAsync";t.logBeginAsync(x);var y=[w];return n.validate(y,n.array().schemaType(n.string()).length(1)).then(function(){__p&&__p();var z=y.indexOf(s.getPlayerID()||"");if(z>-1)y.splice(z,1);if(y.length===0){t.logReject(x,m.INVALID_PARAM);return h.reject(new p({code:m.INVALID_PARAM,message:"At least one player id besides the current player'smust be provided."}))}var A=s.getConnectedPlayersPromise();if(A)return A;var B=q.fetchAsync();s.setConnectedPlayersPromise(B);return B}).then(function(z){__p&&__p();var A=new l(z.map(function(G){return G.getID()}));for(var B=y,C=Array.isArray(B),D=0,B=C?B:B[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var E;if(C){if(D>=B.length)break;E=B[D++]}else{D=B.next();if(D.done)break;E=D.value}var F=E;if(!A.has(F)){t.logReject(x,m.INVALID_PARAM);return h.reject(new p({code:m.INVALID_PARAM,message:"Provided ID "+String(F)+" is not a connected player of the current player."}))}}return s.getMessageSender().sendAsync(k.CONTEXT_CREATE_ASYNC,{playerIDs:y})}).then(function(z){s.updateContext(z);t.logResolve(x);return})["catch"](function(z){t.logReject(x);throw z})},createStoreAsync:function v(w){__p&&__p();var x="context_createStoreAsync";t.logBeginAsync(x);if(s.getContext().getID()===null){t.logReject(x,m.INVALID_OPERATION);return h.reject(new p({code:m.INVALID_OPERATION,message:"Cannot create a new activity store in a solo context"}))}return n.validate(w,n.string().optional()).then(function(){return s.getMessageSender().sendAsync(k.CONTEXT_MATCH_CREATE_ASYNC,{name:w||null})}).then(function(y){return new o(y)}).then(function(y){t.logResolve(x);return y})["catch"](function(y){t.logReject(x);throw y})},getStoresAsync:function v(w){__p&&__p();var x="context_getStoresAsync";t.logBeginAsync(x);var y={};y.contextID=w&&w.contextID||s.getContext().getID()||null;y.matches=w&&w.stores||null;y.status=w&&w.status||null;if(y.status!==null&&!Object.prototype.hasOwnProperty.call(j,y.status)){t.logReject(x,m.INVALID_PARAM);return h.reject(new p({code:m.INVALID_PARAM,message:'Value provided for property "status" was not a valid option'}))}var z=n.object().keys({contextID:n.string(),matches:n.array().optional().schemaType(n.string()),status:n.string().optional()});return n.validate(y,z).then(function(){return s.getMessageSender().sendAsync(k.CONTEXT_MATCH_FETCH_ASYNC,y)}).then(function(A){if(!A||!Array.isArray(A)){t.logReject(x,m.UNKNOWN);return h.reject(new p({code:m.UNKNOWN,message:"Response data was invalid."}))}return A.map(function(B){return new o(B)})}).then(function(A){t.logResolve(x);return A})["catch"](function(A){t.logReject(x);throw A})},getPlayersAsync:function v(){__p&&__p();var w="context_fetchPlayers",x=s.getContextPlayersPromise();if(x)return x;t.logBeginAsync(w);if(s.getContext().getID()===null){t.logReject(w,m.INVALID_OPERATION);return h.reject(new p({code:m.INVALID_OPERATION,message:"Cannot get context players in a solo context"}))}var y=r.fetchAsync().then(function(z){t.logResolve(w);return z})["catch"](function(z){t.logReject(w);s.setConnectedPlayersPromise(null);throw z});s.setContextPlayersPromise(y);return y}};f.exports=u}),null);
__d("InstantGameSDKCustomUpdateNotificationType",[],(function a(b,c,d,e,f,g){f.exports=Object.freeze({PUSH:"PUSH",NO_PUSH:"NO_PUSH"})}),null);
__d("InstantGameSDKEndAction",[],(function a(b,c,d,e,f,g){f.exports=Object.freeze({SCORE:"SCORE",CUSTOM:"CUSTOM",NONE:"NONE"})}),null);
__d("InstantGamesCustomUpdateDeliveryPolicy",[],(function a(b,c,d,e,f,g){f.exports={IMMEDIATE:"IMMEDIATE",LAST:"LAST",IMMEDIATE_CLEAR:"IMMEDIATE_CLEAR"}}),null);
__d("fbinstant/releases/5.0/endGamePayload",["Promise","InstantGamesCustomUpdateDeliveryPolicy","InstantGameSDKCustomUpdateNotificationType","InstantGameSDKEndAction","fbinstant/common/errorCode","fbinstant/common/validator","fbinstant/releases/5.0/apiError"],(function a(b,c,d,e,f,g,h,i,j,k,l,m,n){"use strict";__p&&__p();o.prototype.format=function(p){if(!p||!(p instanceof Object)||!p.action||p.action!==k.CUSTOM)return h.reject(new n({code:l.INVALID_PARAM,message:'Update action property must be "CUSTOM"'}));return this.$EndGamePayload1(p)};o.prototype.$EndGamePayload1=function(p){var q=p.strategy&&p.strategy in i?p.strategy:i.IMMEDIATE,r=p.notification&&p.notification in j?p.notification:j.NO_PUSH,s=babelHelpers["extends"]({},p,{strategy:q,notification:r}),t=m.object().keys({action:m.string(),template:m.string(),cta:m.union([m.string(),m.object()]).optional(),image:m.string(),text:m.union([m.string(),m.object()]),data:m.object().optional().maxSize(1e3),strategy:m.string(),notification:m.string()});return this.$EndGamePayload2(s,t,["action","cta","image","text","data","strategy"],["data"])};o.prototype.$EndGamePayload2=function(p,q,r){var s=arguments.length<=3||arguments[3]===undefined?[]:arguments[3];return m.validate(p,q).then(function(t){return h.resolve(this.$EndGamePayload3(t,r,s))}.bind(this))};o.prototype.$EndGamePayload3=function(p,q){__p&&__p();var r=arguments.length<=2||arguments[2]===undefined?[]:arguments[2],s=this.$EndGamePayload4(p),t=babelHelpers["extends"]({},p,s),u={};for(var v in t)if(r.indexOf(v)!==-1)try{t[v]=JSON.stringify(t[v])}catch(w){}for(var x in t)if(q.indexOf(x)===-1){u[x]=t[x];delete t[x]}t.extra=JSON.stringify(u);return t};o.prototype.$EndGamePayload4=function(p){__p&&__p();var q={},r=p.text,s=p.cta;if(typeof r!=="string"){q.text_localizations=r.localizations;p.text=r["default"]}if(s!=null&&typeof s!=="string"){q.cta_localizations=s.localizations;p.cta=s["default"]}return q};function o(){}f.exports=new o()}),null);
__d("InstantGamesHeartbeatAction",[],(function a(b,c,d,e,f,g){f.exports=Object.freeze({START:"start",UPDATE:"update",END:"end"})}),null);
__d("fbinstant/releases/5.0/heartbeat",["InstantGamesHeartbeatAction","InstantGamesPassThroughRequestType","fbinstant/releases/5.0/internalStates"],(function a(b,c,d,e,f,g,h,i,j){"use strict";__p&&__p();var k=6e4,l={_heartbeatInterval:null,startHeartbeat:function m(){if(this._heartbeatInterval)this.stopHeartbeat();this.sendHeartbeat(h.START);this._heartbeatInterval=setInterval(function(){this.sendHeartbeat(h.UPDATE)}.bind(this),k)},stopHeartbeat:function m(){clearInterval(this._heartbeatInterval);this._heartbeatInterval=null;this.sendHeartbeat(h.END)},sendHeartbeat:function m(n){j.getMessageSender().sendPassThroughAsync(i.HEARTBEAT,{action:n,contextID:j.getContext().getID()})}};f.exports=l}),null);
__d("fbinstant/releases/5.0/messageConfig",[],(function a(b,c,d,e,f,g){"use strict";var h={getConfig:function i(){if(window.QuicksilverAndroid)return{sender:window.QuicksilverAndroid,source:"Android"};else if(window.webkit&&window.webkit.messageHandlers)return{sender:window.webkit.messageHandlers.quicksilver||parent,source:"iOS"};var j=new RegExp("[?&]source(=([^&#]*)|&|#|$)","i"),k=j.exec(window.location.href);return{sender:parent,source:k&&k[2]&&decodeURIComponent(k[2].replace(/\+/g," "))}}};f.exports=h}),null);
__d("fbinstant/releases/5.0/messageReceiver",[],(function a(b,c,d,e,f,g){"use strict";__p&&__p();function h(){this.$MessageReceiver1=null}h.prototype.$MessageReceiver2=function(i){if(!i.data||!i.data.source)return;var j=i.data.type;if(!j)return;var k=this.$MessageReceiver1&&this.$MessageReceiver1[j];if(!k)return;k(i.data.content)};h.prototype.init=function(){this.$MessageReceiver1={};window.addEventListener("message",this.$MessageReceiver2.bind(this))};h.prototype.registerMessageHandler=function(i,j,k){var l=this.$MessageReceiver1;if(!l)return;if(k)l[i]=j.triggerSubscribers.bind(j,k);else l[i]=j.triggerSubscribers.bind(j)};f.exports=new h()}),null);
__d("fbinstant/releases/5.0/auth",["InstantGamesSDKMessages","fbinstant/releases/5.0/internalStates"],(function a(b,c,d,e,f,g,h,i){"use strict";__p&&__p();function j(k){this.$SignedPlayerInfo1=k}j.prototype.getPlayerID=function(){return this.$SignedPlayerInfo1.playerID};j.prototype.getSignature=function(){return this.$SignedPlayerInfo1.signature};f.exports={SignedPlayerInfo:j,getSignedPlayerInfoAsync:function k(l){return i.getMessageSender().sendAsync(h.GET_SIGNED_PLAYER_INFO_ASYNC,{requestPayload:l||null}).then(function(m){return new j(m)})}}}),null);
__d("fbinstant/releases/5.0/playerStats",["Promise","InstantGamesPassThroughRequestType","fbinstant/common/errorCode","fbinstant/common/validator","fbinstant/releases/5.0/apiError","fbinstant/releases/5.0/internalStates"],(function a(b,c,d,e,f,g,h,i,j,k,l,m){"use strict";__p&&__p();function n(){this.$PlayerStats1=false}n.prototype.getAsync=function(o){if(!o)return m.getMessageSender().sendPassThroughAsync(i.GET_PLAYER_STATS,{});var p=k.array().schemaType(k.string());return k.validate(o,p).then(function(){this.$PlayerStats2();return m.getMessageSender().sendPassThroughAsync(i.GET_PLAYER_STATS,{stat_keys:o})}.bind(this))};n.prototype.setAsync=function(o){return k.validate(o,k.object()).then(function(p){return h.all(Object.keys(o).map(function(q){return k.validate(o[q],k.integer())}))}).then(function(p){this.$PlayerStats3();return m.getMessageSender().sendPassThroughAsync(i.SET_PLAYER_STATS,{stats:o}).then(function(q){this.$PlayerStats4();return q}.bind(this))["catch"](function(q){this.$PlayerStats4();throw q}.bind(this))}.bind(this))};n.prototype.incrementAsync=function(o){return k.validate(o,k.object()).then(function(p){return h.all(Object.keys(o).map(function(q){return k.validate(o[q],k.integer())}))}).then(function(p){this.$PlayerStats3();return m.getMessageSender().sendPassThroughAsync(i.INCREMENT_PLAYER_STATS,{increments:o}).then(function(q){this.$PlayerStats4();return q}.bind(this))["catch"](function(q){this.$PlayerStats4();throw q}.bind(this))}.bind(this))};n.prototype.$PlayerStats2=function(){if(this.$PlayerStats1)throw new l({code:j.PENDING_REQUEST,message:"A set or increment stats request is pending, please wait for it to resolve or reject before making another stats request."})};n.prototype.$PlayerStats3=function(){this.$PlayerStats2();this.$PlayerStats1=true};n.prototype.$PlayerStats4=function(){this.$PlayerStats1=false};f.exports=new n()}),null);
__d("fbinstant/releases/5.0/player",["Promise","InstantGamesSDKMessages","fbinstant/common/errorCode","fbinstant/common/validator","fbinstant/releases/5.0/apiError","fbinstant/releases/5.0/auth","fbinstant/releases/5.0/connectedPlayers","fbinstant/releases/5.0/internalStates","fbinstant/releases/5.0/logger","fbinstant/releases/5.0/playerStats"],(function a(b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){"use strict";__p&&__p();var r={getID:function s(){p.logAPICall("player_getID");return o.getPlayerID()},getSignedPlayerInfoAsync:function s(t){var u="player_getSignedPlayerInfoAsync";p.logBeginAsync(u);var v=k.string().optional(),w=k.validate(t,v).then(function(){return m.getSignedPlayerInfoAsync(t)});return p.logAsyncResult(w,u)},getName:function s(){p.logAPICall("player_getName");return o.getPlayerName()},getPhoto:function s(){p.logAPICall("player_getPhoto");return o.getPlayerPhoto()},getDataAsync:function s(t){var u="player_getDataAsync";p.logBeginAsync(u);var v=k.array().schemaType(k.string()),w=k.validate(t,v).then(function(){return o.getMessageSender().sendAsync(i.GET_PLAYER_DATA_ASYNC,{keys:t})});return p.logAsyncResult(w,u)},setDataAsync:function s(t){__p&&__p();var u="player_setDataAsync";p.logBeginAsync(u);var v=function v(y){__p&&__p();for(var z=Object.keys(y),A=Array.isArray(z),B=0,z=A?z:z[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var C;if(A){if(B>=z.length)break;C=z[B++]}else{B=z.next();if(B.done)break;C=B.value}var D=C,E=y[D];if(typeof E==="function")return true}return false},w=function w(y){try{JSON.stringify(y);return false}catch(z){return true}},x=k.validate(t,k.object()).then(function(y){if(v(y)||w(y)){p.logReject(u,j.INVALID_PARAM);return h.reject(new l({code:j.INVALID_PARAM,message:"Object is not serializable"}))}return y}).then(function(y){return o.getMessageSender().sendAsync(i.SET_PLAYER_DATA_ASYNC,{data:t})});return p.logAsyncResult(x,u).then(function(){})},flushDataAsync:function s(){var t="player_flushDataAsync";p.logBeginAsync(t);var u=o.getMessageSender().sendAsync(i.FLUSH_PLAYER_DATA_ASYNC,null);return p.logAsyncResult(u,t).then(function(){})},getStatsAsync:function s(t){var u="player_getStatsAsync";p.logBeginAsync(u);var v=q.getAsync(t);return p.logAsyncResult(v,u)},setStatsAsync:function s(t){var u="player_setStatsAsync";p.logBeginAsync(u);var v=q.setAsync(t);return p.logAsyncResult(v,u).then(function(){})},incrementStatsAsync:function s(t){var u="player_incrementStatsAsync";p.logBeginAsync(u);var v=q.incrementAsync(t);return p.logAsyncResult(v,u)},getConnectedPlayersAsync:function s(){var t="player_getConnectedPlayers",u=o.getConnectedPlayersPromise();if(u)return u;p.logBeginAsync(t);var v=p.logAsyncResult(n.fetchAsync(),t)["catch"](function(w){o.setConnectedPlayersPromise(null);throw w});o.setConnectedPlayersPromise(v);return v}};f.exports=r}),null);
__d("ES6Array",[],(function a(b,c,d,e,f,g){"use strict";__p&&__p();var h={from:function i(j){__p&&__p();if(j==null)throw new TypeError("Object is null or undefined");var k=arguments[1],l=arguments[2],m=this,n=Object(j),o=typeof Symbol==="function"?typeof Symbol==="function"?Symbol.iterator:"@@iterator":"@@iterator",p=typeof k==="function",q=typeof n[o]==="function",r=0,s=void 0,t=void 0;if(q){s=typeof m==="function"?new m():[];var u=n[o](),v=void 0;while(!(v=u.next()).done){t=v.value;if(p)t=k.call(l,t,r);s[r]=t;r+=1}s.length=r;return s}var w=n.length;if(isNaN(w)||w<0)w=0;s=typeof m==="function"?new m(w):new Array(w);while(r<w){t=n[r];if(p)t=k.call(l,t,r);s[r]=t;r+=1}s.length=r;return s}};f.exports=h}),null);
__d("fbinstant/releases/5.0/supportedFunctions",["ES6Array","InstantGamesSDKFeatures","InstantGamesSDKMessages","Set","fbinstant/common/supportedFeaturesManager","fbinstant/common/supportedMessagesManager"],(function a(b,c,d,e,f,g,h,i,j,k,l,m){"use strict";__p&&__p();var n=new k(["getLocale","getPlatform","getSDKVersion","getSupportedAPIs","getEntryPointData","player.getID","player.getName","player.getPhoto","context.getID","context.getType","context.isSizeBetween","logEvent","onPause"]),o={initializeAsync:j.INITIALIZE_ASYNC,setLoadingProgress:j.ON_PROGRESS_LOAD,setSessionData:j.SET_SESSION_DATA,startGameAsync:j.ON_GAME_READY,"player.flushDataAsync":j.FLUSH_PLAYER_DATA_ASYNC,"player.getDataAsync":j.GET_PLAYER_DATA_ASYNC,"player.setDataAsync":j.SET_PLAYER_DATA_ASYNC,"player.getConnectedPlayersAsync":j.GET_CONNECTED_PLAYERS_ASYNC,"player.getSignedPlayerInfoAsync":j.GET_SIGNED_PLAYER_INFO_ASYNC,"context.switchAsync":j.CONTEXT_SWITCH_ASYNC,"context.chooseAsync":j.CONTEXT_CHOOSE_ASYNC,"context.createAsync":j.CONTEXT_CREATE_ASYNC,"context.getPlayersAsync":j.CONTEXT_PLAYERS_FETCH_ASYNC,getInterstitialAdAsync:j.GET_INTERSTITIAL_AD_ASYNC,getRewardedVideoAsync:j.GET_REWARDED_VIDEO_ASYNC,shareAsync:j.SHARE_ASYNC,quit:j.QUIT},p=new k(["getEntryPointAsync","player.getStatsAsync","player.setStatsAsync","player.incrementStatsAsync"]),q={updateAsync:function w(){return l.isSupported(i.FLEXIBLE)}};function r(){var w=s(),x=t(),y=u();return h.from(n).concat(w).concat(x).concat(y)}function s(){var w=new k();for(var x in o){var y=o[x];if(m.isSupported(y))w.add(x)}return h.from(w)}function t(){return m.isSupported(j.SEND_PASS_THROUGH_ASYNC)?h.from(p):[]}function u(){var w=new k();for(var x in q){var y=q[x]();if(y)w.add(x)}return h.from(w)}var v={getSupported:r};f.exports=v}),null);
__d("fbinstant/releases/5.0",["Promise","InstantGamesGameState","InstantGamesPassThroughRequestType","InstantGamesSDKFeatures","InstantGamesSDKMessages","fbinstant/common/consoleLogger","fbinstant/common/errorCode","fbinstant/common/performanceTracker","fbinstant/common/platform","fbinstant/common/supportedFeaturesManager","fbinstant/common/validator","fbinstant/releases/5.0/ads","fbinstant/releases/5.0/apiError","fbinstant/releases/5.0/context","fbinstant/releases/5.0/endGamePayload","fbinstant/releases/5.0/heartbeat","fbinstant/releases/5.0/internalStates","fbinstant/releases/5.0/logger","fbinstant/releases/5.0/messageConfig","fbinstant/releases/5.0/messageReceiver","fbinstant/releases/5.0/player","fbinstant/releases/5.0/supportedFunctions"],(function a(b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C){"use strict";__p&&__p();var D={getLocale:function E(){y.logAPICall("getLocale");return x.getLocale()},getPlatform:function E(){y.logAPICall("getPlatform");return x.getPlatform()},getSDKVersion:function E(){y.logAPICall("getSDKVersion");return x.getSdkVersion()},initializeAsync:function E(){__p&&__p();var F="initializeAsync";if(x.isInitialized())return h.reject(new t({code:n.INVALID_OPERATION,message:"Game has already been initialized."}));var G=this;return new h(function(H,I){__p&&__p();y.logBeginAsync(F);var J=x.getMessageSender();J.initialize(z.getConfig());J.send(l.ON_BEGIN_LOAD,100);m.init(function(L){J.send(l.ON_CONSOLE,L)});A.init();A.registerMessageHandler(l.RESTART,x.getRestartEvent(),null);A.registerMessageHandler(l.RESOLVE_PROMISE,J.getResolvePromiseEvent(),null);A.registerMessageHandler(l.REJECT_PROMISE,J.getRejectPromiseEvent(),null);A.registerMessageHandler(l.PAUSE,x.getPauseEvent(),null);A.registerMessageHandler(l.ANALYTICS_LOG_EVENT,x.getAnalyticsLogEvent(),null);x.getGameStartEvent().on(function(){x.setGameState(i.PLAYING)});A.registerMessageHandler(l.GAME_START,x.getGameStartEvent(),null);A.registerMessageHandler(l.PAYMENTS_INITIALIZED,x.getPaymentsState().getPaymentsInitializedEvent(),null);G._populatePlatform();var K=J.sendAsync(l.INITIALIZE_ASYNC,{sdkVersion:G.sdkVersion});y.logAsyncResult(K,F).then(function(L){if(!x.isInitialized())x.initialize(L);H()})["catch"](function(L){I(L)}).done()})},_populatePlatform:function E(){if(window.IsQuicksilverReactNativeIOS||window.webkit)x.setPlatform(p.IOS);else if(window.IsQuicksilverReactNativeAndroid||window.QuicksilverAndroid)x.setPlatform(p.ANDROID);else if(window.IsMobileWeb)x.setPlatform(p.MOBILE_WEB);else x.setPlatform(p.WEB)},setLoadingProgress:function E(F){if(F>=0&&F<=100&&F>x.getLoadingProgress()){x.getMessageSender().send(l.ON_PROGRESS_LOAD,F);x.setLoadingProgress(F)}else{var G="FbInstant::setLoadingProgress(",H=") is invalid. The progress must be";if(!(F<0||F>100))F<=x.getLoadingProgress()}},getSupportedAPIs:function E(){return C.getSupported()},getEntryPointData:function E(){y.logAPICall("getEntryPointData");return x.getEntryPointData()},getEntryPointAsync:function E(){var F="getEntryPointAsync";y.logBeginAsync(F);var G=x.getEntryPoint();if(G!=null)return h.resolve(G);var H=x.getMessageSender().sendPassThroughAsync(j.GET_ENTRY_POINT,{source:x.getRawSource()});return y.logAsyncResult(H,F).then(function(I){x.setEntryPoint(I.entry_point);return h.resolve(I.entry_point)})},setSessionData:function E(F){y.logAPICall("setSessionData");var G=F;r.validate(G,r.object().maxSize(1e3)).done(function(){x.getMessageSender().send(l.SET_SESSION_DATA,JSON.stringify(G))})},startGameAsync:function E(){__p&&__p();var F="startGameAsync";return new h(function(G,H){__p&&__p();var I,J=x.getAnalytics();y.logBeginAsync(F);if(x.getGameState()===i.PLAYING){y.logResolve(F);G()}else(function(){__p&&__p();var K=x.getMessageSender();o.init(K);K.send(l.ON_GAME_READY);var L=function L(M){__p&&__p();x.getGameStartEvent().off(L);x.setGameState(i.PLAYING);J.logActive();if(M)x.updateContext(M);if(!q.isSupported(k.FLEXIBLE)){y.logReject(F,n.CLIENT_UNSUPPORTED_OPERATION);H(new t({code:n.CLIENT_UNSUPPORTED_OPERATION,message:"Client does not support the flexible platform."}));return}y.logResolve(F);G()};x.getGameStartEvent().on(L)})();w.startHeartbeat()})},player:B,context:u,shareAsync:function E(F){var G="shareAsync",H=r.object().keys({intent:r.string(),image:r.string(),text:r.string(),data:r.object().optional().maxSize(1e3)});y.logBeginAsync(G);var I=r.validate(F,H).then(function(){var J=babelHelpers["extends"]({},F);if(F.data)J.data=JSON.stringify(F.data);return x.getMessageSender().sendAsync(l.SHARE_ASYNC,J)});return y.logAsyncResult(I,G).then(function(){})},sendImageAsync:function E(F,G){var H="sendImageAsync",I=r.object().keys({image:r.string(),data:r.object().optional().maxSize(1e3)}),J={image:F,data:G};y.logBeginAsync(H);var K=r.validate(J,I).then(function(){var L={};L.image=J.image;if(J.data)L.data=JSON.stringify(J.data);return x.getMessageSender().sendAsync(l.MEDIA_SEND_IMAGE_ASYNC,L)});return y.logAsyncResult(K,H).then(function(){})},updateAsync:function E(F){__p&&__p();var G="updateAsync";return new h(function(H,I){__p&&__p();v.format(F).then(function(J){__p&&__p();y.logBeginAsync(G);x.getMessageSender().send(l.ON_END_GAME,J);x.getRestartEvent().on(function(K){__p&&__p();if(K&&K.error){y.logReject(G);I(new t({message:K.error.message}));return}if(K&&K.contextType)x.updateContext(K);y.logResolve(G);H();x.getRestartEvent().unbind()})})["catch"](function(J){I(J)})})},quit:function E(){y.logAPICall("quit");x.getMessageSender().send(l.QUIT,{});w.stopHeartbeat()},logEvent:function E(F,G,H){var I=x.getAnalytics().logEvent(F,G,H);if(!I)return null;return new t({code:I.code,message:I.message})},onPause:function E(F){y.logAPICall("onPause");x.getPauseEvent().on(F)},getInterstitialAdAsync:function E(F){var G="getInterstitialAdAsync";y.logBeginAsync(G);var H=r.string(),I=r.validate(F,H).then(function(){return s.getInterstitialAdAsync(F)});return y.logAsyncResult(I,G)},getRewardedVideoAsync:function E(F){var G="getRewardedVideoAsync";y.logBeginAsync(G);var H=r.string(),I=r.validate(F,H).then(function(){return s.getRewardedVideoAsync(F)});return y.logAsyncResult(I,G)},matchPlayerAsync:function E(F){__p&&__p();var G="matchPlayerAsync",H=x.getAnalytics();H.logBeginAsyncAPICall(G);var I={};I.matchTag=F||null;var J=/^[a-zA-Z0-9_]+$/;if(I.matchTag&&I.matchTag.search(J)===-1)return h.reject(new t({code:n.INVALID_PARAM,message:"Match Tag must only include letters, numbers and underscores."}));if(I.matchTag&&I.matchTag.length>100)return h.reject(new t({code:n.INVALID_PARAM,message:"Match Tag must be 100 characters or less."}));var K=r.object().keys({matchTag:r.string().optional()});return r.validate(I,K).then(function(L){return x.getMessageSender().sendPassThroughAsync(j.CAN_PLAYER_MATCH,{contextID:x.getContext().getID()})}).then(function(L){if(!L.can_match)throw new t({code:n.INVALID_OPERATION,message:"The player is not currently eligible to match."});I.dialogTitle=L.dialog_title;I.dialogTextLineOne=L.dialog_text_line_one;I.dialogTextLineTwo=L.dialog_text_line_two;I.dialogButtonText=L.dialog_button_text;return x.getMessageSender().sendAsync(l.MATCH_PLAYER_ASYNC,I)}).then(function(L){x.updateContext(L);H.logResolveAsyncAPICall(G);return})["catch"](function(L){H.logRejectAsyncAPICall(G);throw L})},checkCanPlayerMatchAsync:function E(){var F="checkCanPlayerMatchAsync",G=x.getAnalytics();G.logBeginAsyncAPICall(F);return new h(function(H,I){x.getMessageSender().sendPassThroughAsync(j.CAN_PLAYER_MATCH,{contextID:x.getContext().getID()}).then(function(J){G.logResolveAsyncAPICall(F);H(J.can_match)})["catch"](function(J){G.logRejectAsyncAPICall(F);I(J)})})}};f.exports=D}),null);
__d("legacy:fbinstant.5.0.all",["fbinstant/releases/5.0"],(function a(b,c,d,e,f,g){"use strict";window.FBInstant=c("fbinstant/releases/5.0")}),3);
    }  }).call(global);})(window.inDapIF ? parent.window : window, window);} catch (e) {new Image().src="https:\/\/www.facebook.com\/" + 'common/scribe_endpoint.php?c=jssdk_error&m='+encodeURIComponent('{"error":"LOAD", "extra": {"name":"'+e.name+'","line":"'+(e.lineNumber||e.line)+'","script":"'+(e.fileName||e.sourceURL||e.script)+'","stack":"'+(e.stackTrace||e.stack)+'","revision":"3523568","namespace":"FB","message":"'+e.message+'"}}');}var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var egretfb;
(function (egretfb) {
    /**
     * 游戏好友的信息
     */
    var EgretConnectedPlayer = (function () {
        function EgretConnectedPlayer(player) {
            this._fbContextPlayer = player;
        }
        /**
         * 关联用户的ID
         */
        EgretConnectedPlayer.prototype.getID = function () {
            var id = this._fbContextPlayer.getID();
            egretfb.Net.push("ConnectedPlayerGetID", "id", id);
            return id;
        };
        /**
         * 关联用户的名字
         */
        EgretConnectedPlayer.prototype.getName = function () {
            var name = this._fbContextPlayer.getName();
            egretfb.Net.push("ConnectedPlayerGetName", "name", name);
            return name;
        };
        /**
         * 关联用户的头像 url 地址
         */
        EgretConnectedPlayer.prototype.getPhoto = function () {
            var photo = this._fbContextPlayer.getPhoto();
            egretfb.Net.push("ConnectedPlayerGetPhoto", "photo", photo);
            return photo;
        };
        return EgretConnectedPlayer;
    }());
    egretfb.EgretConnectedPlayer = EgretConnectedPlayer;
    __reflect(EgretConnectedPlayer.prototype, "egretfb.EgretConnectedPlayer");
})(egretfb || (egretfb = {}));
var egretfb;
(function (egretfb) {
    /**
     * 当前游戏的来源信息
     */
    var EgretContext = (function () {
        function EgretContext(_EgretContext) {
            this._fbContext = _EgretContext;
        }
        /**
         * 当前游戏来源的唯一id
         */
        EgretContext.prototype.getID = function () {
            var id = this._fbContext.getID();
            egretfb.Net.push("ContextGetID", "id", id);
            return id;
        };
        /**
         * 游戏的来源类型："POST" | "THREAD" | "GROUP" | "SOLO"
         */
        EgretContext.prototype.getType = function () {
            var type = this._fbContext.getType();
            egretfb.Net.push("ContextGetType", "type", type);
            return type;
        };
        /**
         * 用这个方法来判断当前游戏环境中游戏参与者的数量是否介于指定的最小值和最大值之间。
         * @param minSize
         * @param maxSize
         */
        EgretContext.prototype.isSizeBetween = function (minSize, maxSize) {
            var ans = this._fbContext.isSizeBetween(minSize, maxSize);
            egretfb.Net.push("ContextisSizeBetween", "ans", ans);
            return ans;
        };
        /**
         * 切换游戏场景
         * @param id
         */
        EgretContext.prototype.switchAsync = function (id) {
            egretfb.Net.push("ContextSwitchAsync", "id", id);
            return this._fbContext.switchAsync(id);
        };
        /**
         * 选择游戏场景
         * @param options
         */
        EgretContext.prototype.chooseAsync = function (options) {
            egretfb.Net.push("ContextChooseAsync", "options", options);
            return this._fbContext.chooseAsync(options);
        };
        /**
         * 创建游戏场景
         * @param playerID
         */
        EgretContext.prototype.createAsync = function (playerID) {
            egretfb.Net.push("ContextCreateAsync", "playerID", playerID);
            return this._fbContext.createAsync(playerID);
        };
        /**
         * 获取当前环境中正在玩游戏的玩家列表，它可能包含当前玩家的信息。
         */
        EgretContext.prototype.getPlayersAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            egretfb.Net.push("ContextGetPlayersAsync", "", "");
                            return [4 /*yield*/, this._fbContext.getPlayersAsync()];
                        case 1:
                            cps = _a.sent();
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    var rel = [];
                                    cps.forEach(function (element) {
                                        rel.push(new egretfb.EgretContextPlayer(element));
                                    });
                                    resolve(rel);
                                })];
                    }
                });
            });
        };
        return EgretContext;
    }());
    egretfb.EgretContext = EgretContext;
    __reflect(EgretContext.prototype, "egretfb.EgretContext");
})(egretfb || (egretfb = {}));
var egretfb;
(function (egretfb) {
    /**
     * 游戏环境中的玩家
     */
    var EgretContextPlayer = (function () {
        function EgretContextPlayer(player) {
            this._fbContextPlayer = player;
        }
        /**
         * 关联用户的ID
         */
        EgretContextPlayer.prototype.getID = function () {
            var id = this._fbContextPlayer.getID();
            egretfb.Net.push("ContextPlayerGetID", "id", id);
            return id;
        };
        /**
         * 关联用户的名字
         */
        EgretContextPlayer.prototype.getName = function () {
            var name = this._fbContextPlayer.getName();
            egretfb.Net.push("ConnectedPlayerGetName", "name", name);
            return name;
        };
        /**
         * 关联用户的头像 ulr 地址
         */
        EgretContextPlayer.prototype.getPhoto = function () {
            var photo = this._fbContextPlayer.getPhoto();
            egretfb.Net.push("ConnectedPlayerGetPhoto", "photo", photo);
            return photo;
        };
        return EgretContextPlayer;
    }());
    egretfb.EgretContextPlayer = EgretContextPlayer;
    __reflect(EgretContextPlayer.prototype, "egretfb.EgretContextPlayer");
})(egretfb || (egretfb = {}));
var egretfb;
(function (egretfb) {
    /**
     * 自定义更新内容
     */
    var EgretCustomUpdatePayload = (function () {
        function EgretCustomUpdatePayload() {
            this._action = "";
            this._template = "";
            this._image = "";
            this._data = null;
            this._strategy = "";
            this._notification = "";
        }
        Object.defineProperty(EgretCustomUpdatePayload.prototype, "action", {
            /**
             * 对于自定义更新来说，该值应该为 'CUSTOM'.
             */
            get: function () {
                egretfb.Net.push("CustomUpdatePayloadGetAction", "action", this._action);
                return this._action;
            },
            set: function (value) {
                egretfb.Net.push("CustomUpdatePayloadSetAction", "action", value);
                this._action = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretCustomUpdatePayload.prototype, "template", {
            /**
             * 自定义更新使用的模板的ID，模板应该在 fbapp-config.json 中预定义。
             * 查看配置文件说明：https://developers.facebook.com/docs/games/instant-games/bundle-config
             */
            get: function () {
                egretfb.Net.push("CustomUpdatePayloadGetTemplate", "template", this._template);
                return this._template;
            },
            set: function (value) {
                egretfb.Net.push("CustomUpdatePayloadSetTemplate", "template", value);
                this._template = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretCustomUpdatePayload.prototype, "cta", {
            /**
             * 可选，按钮文字。默认情况下，我们本地化的 'Play' 作为按钮文字。
             */
            get: function () {
                egretfb.Net.push("CustomUpdatePayloadGetcta", "cta", this._cta);
                return this._cta;
            },
            set: function (value) {
                egretfb.Net.push("CustomUpdatePayloadSetcta", "cta", value);
                this._cta = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretCustomUpdatePayload.prototype, "image", {
            /**
             * base64 编码的图像信息
             */
            get: function () {
                egretfb.Net.push("CustomUpdatePayloadGetImage", "image", this._image);
                return this._image;
            },
            set: function (value) {
                egretfb.Net.push("CustomUpdatePayloadSetImage", "image", value);
                this._image = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretCustomUpdatePayload.prototype, "text", {
            /**
             * 文本信息
             */
            get: function () {
                egretfb.Net.push("CustomUpdatePayloadGetText", "text", this._text);
                return this._text;
            },
            set: function (value) {
                egretfb.Net.push("CustomUpdatePayloadSetText", "text", value);
                this._text = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretCustomUpdatePayload.prototype, "data", {
            /**
             * 附加到更新上的数据。当游戏通过分享启动时，可以通过 EgretFBInstant.getEntryPointData() 方法获取。
             * 该数据必须少于1000个字符。
             */
            get: function () {
                egretfb.Net.push("CustomUpdatePayloadGetData", "data", this._data);
                return this._data;
            },
            set: function (value) {
                egretfb.Net.push("CustomUpdatePayloadSetData", "data", value);
                this._data = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretCustomUpdatePayload.prototype, "strategy", {
            /**
             * 指定更新的方式。
             * 'IMMEDIATE' - 默认值，立即发布更新
             * 'LAST' - 当游戏结束时，发布更新
             * 'IMMEDIATE_CLEAR' - 立即发布更新，并清除任何其他正在等待的更新
             */
            get: function () {
                egretfb.Net.push("CustomUpdatePayloadGetStrategy", "strategy", this._strategy);
                return this._strategy;
            },
            set: function (value) {
                egretfb.Net.push("CustomUpdatePayloadSetStrategy", "strategy", value);
                this._strategy = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretCustomUpdatePayload.prototype, "notification", {
            /**
             * 指定自定义更新的通知设置。可以是“NO_PUSH”或“PUSH”，默认为“NO_PUSH”。
             */
            get: function () {
                egretfb.Net.push("CustomUpdatePayloadGetNotification", "notification", this._notification);
                return this._notification;
            },
            set: function (value) {
                egretfb.Net.push("CustomUpdatePayloadSetNotification", "notification", value);
                this._notification = value;
            },
            enumerable: true,
            configurable: true
        });
        return EgretCustomUpdatePayload;
    }());
    egretfb.EgretCustomUpdatePayload = EgretCustomUpdatePayload;
    __reflect(EgretCustomUpdatePayload.prototype, "egretfb.EgretCustomUpdatePayload", ["CustomUpdatePayload"]);
})(egretfb || (egretfb = {}));
var egretfb;
(function (egretfb) {
    var EgretLocalizableContent = (function () {
        function EgretLocalizableContent() {
        }
        return EgretLocalizableContent;
    }());
    egretfb.EgretLocalizableContent = EgretLocalizableContent;
    __reflect(EgretLocalizableContent.prototype, "egretfb.EgretLocalizableContent", ["LocalizableContent"]);
})(egretfb || (egretfb = {}));
var egretfb;
(function (egretfb) {
    //Copyright (c) 2014-present, Egret Technology.
    //for EgretFBInstant.4.1.js
    var EgretFBInstant = (function () {
        function EgretFBInstant() {
        }
        Object.defineProperty(EgretFBInstant, "player", {
            //public static Platform: "IOS" | "ANDROID" | "WEB" | "MOBILE_WEB";
            /**
             * 获取用户信息
             */
            get: function () {
                egretfb.Net.push("FBInstantGetPlayer", "", "");
                return new egretfb.EgretFBPlayer(FBInstant.player);
            },
            enumerable: true,
            configurable: true
        });
        EgretFBInstant.getNetID = function () {
            return FBInstant.player.getID();
        };
        Object.defineProperty(EgretFBInstant, "context", {
            /**
             * 当前游戏的来源信息
             */
            get: function () {
                egretfb.Net.push("FBInstantGetEgretContext", "", "");
                return new egretfb.EgretContext(FBInstant.context);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取用户的地域信息，例如:zh_CN en_US
         */
        EgretFBInstant.getLocale = function () {
            var locale = FBInstant.getLocale();
            egretfb.Net.push("FBInstantGetLocale", "locale", locale);
            return locale;
        };
        /**
         * 获取运行的平台信息: IOS | ANDROID | WEB | MOBILE_WEB
         */
        EgretFBInstant.getPlatform = function () {
            var platform = FBInstant.getPlatform();
            egretfb.Net.push("FBInstantGetPlatform", "platform", platform);
            return platform;
        };
        /**
         * SDK 的版本号，例如: '4.1'
         */
        EgretFBInstant.getSDKVersion = function () {
            var sdkversion = FBInstant.getSDKVersion();
            egretfb.Net.push("FBInstantGetSDKVersion", "sdkversion", sdkversion);
            return sdkversion;
        };
        /**
         * SDK 初始化结束会返回一个 Promise 方法
         * 应当在其他 API 使用前调用
         */
        EgretFBInstant.initializeAsync = function () {
            return FBInstant.initializeAsync();
        };
        /**
         * 通知平台资源加载的百分比
         * @param percentage 0-100
         */
        EgretFBInstant.setLoadingProgress = function (percentage) {
            return FBInstant.setLoadingProgress(percentage);
        };
        /**
         * 获取平台支持的 api 列表
         */
        EgretFBInstant.getSupportedAPIs = function () {
            var apis = FBInstant.getSupportedAPIs();
            egretfb.Net.push("FBInstantGetSupportedAPIs", "apis", apis);
            return apis;
        };
        /**
         * 获取入口点数据
         */
        EgretFBInstant.getEntryPointData = function () {
            var data = FBInstant.getEntryPointData();
            egretfb.Net.push("FBInstantGetEntryPointData", "data", data);
            return data;
        };
        /**
         * 设置会话数据
         */
        EgretFBInstant.setSessionData = function (sessionData) {
            egretfb.Net.push("FBInstantSetSessionData", "sessionData", sessionData);
            return FBInstant.setSessionData(sessionData);
        };
        /**
         * 游戏已完成加载资源，用户点击了开始游戏的按钮
         * 返回一个 Promise 方法
         */
        EgretFBInstant.startGameAsync = function () {
            egretfb.Net.push("FBInstantStartGame", "", "");
            return FBInstant.startGameAsync();
        };
        /**
         * 分享游戏
         */
        EgretFBInstant.shareAsync = function (payload) {
            egretfb.Net.push("FBInstantShareAsync", "", "");
            return FBInstant.shareAsync(payload);
        };
        /**
         * 通知 Facebook 在游戏中发生的更新
         */
        EgretFBInstant.updateAsync = function (payload) {
            egretfb.Net.push("FBInstantUpdateAsync", "", "");
            return FBInstant.updateAsync(payload);
        };
        /**
         * 退出游戏
         */
        EgretFBInstant.quit = function () {
            egretfb.Net.push("FBInstantQuit", "", "");
            return FBInstant.quit();
        };
        /**
         * 使用 Facebook 的分析功能来分析应用。
         * @param eventName 要分析的事件名称
         * @param valueToSum 可选，FB分析可以计算它。
         * @param parameters 可选，它可以包含多达25个 key-value，以记录事件。key 必须是2-40个字符，只能包含'_', '-', ' '和字母数字的字符。 Value 必须少于100个字符。
         */
        EgretFBInstant.logEvent = function (eventName, valueToSum, parameters) {
            egretfb.Net.pushlog(eventName, valueToSum, parameters);
            return FBInstant.logEvent(eventName, valueToSum, parameters);
        };
        /**
         * 设置一个暂停触发的方法
         */
        EgretFBInstant.onPause = function (func) {
            return FBInstant.onPause(func);
        };
        /**
         * 返回游戏的启动入口点
         */
        EgretFBInstant.getEntryPointAsync = function () {
            var str = FBInstant.getEntryPointAsync();
            egretfb.Net.push("FBInstantGetEntryPointAsync", "str", "str");
            return str;
        };
        /**
         * 获取 facebook 广告对象
         * @param placementID
         */
        EgretFBInstant.getInterstitialAdAsync = function (placementID) {
            return FBInstant.getInterstitialAdAsync(placementID);
        };
        /**
         * 获取 facebook 视频广告对象
         * @param placementID
         */
        EgretFBInstant.getRewardedVideoAsync = function (placementID) {
            return FBInstant.getRewardedVideoAsync(placementID);
        };
        return EgretFBInstant;
    }());
    egretfb.EgretFBInstant = EgretFBInstant;
    __reflect(EgretFBInstant.prototype, "egretfb.EgretFBInstant");
})(egretfb || (egretfb = {}));
var egretfb;
(function (egretfb) {
    var EgretFBPlayer = (function () {
        function EgretFBPlayer(_player) {
            this._FBPlayer = _player;
        }
        /**
         * 玩家的唯一标识ID
         */
        EgretFBPlayer.prototype.getID = function () {
            var id = this._FBPlayer.getID();
            egretfb.Net.push("FBPlayerGetID", "id", id);
            return id;
        };
        /**
         * 获取玩家的唯一ID和一个签名，签名用来验证该 ID 来自 Facebook ，没有被篡改。
         */
        EgretFBPlayer.prototype.getSignedPlayerInfoAsync = function (requestPayload) {
            return __awaiter(this, void 0, void 0, function () {
                var spis;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._FBPlayer.getSignedPlayerInfoAsync(requestPayload)];
                        case 1:
                            spis = _a.sent();
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    var rel = new egretfb.EgretSignedPlayerInfo(spis);
                                    resolve(rel);
                                })];
                    }
                });
            });
        };
        /**
         * 获取用户在Facebook上的的名字，使用用户的语言种类显示
         */
        EgretFBPlayer.prototype.getName = function () {
            var name = this._FBPlayer.getName();
            egretfb.Net.push("FBPlayerGetName", "name", name);
            return name;
        };
        /**
         * 获取用户在Facebook上的头像的url，头像为正方形，最小尺寸为200x200
         */
        EgretFBPlayer.prototype.getPhoto = function () {
            var photo = this._FBPlayer.getPhoto();
            egretfb.Net.push("FBPlayerGetPhoto", "photo", photo);
            return photo;
        };
        /**
         * 取回在FB平台储存的当前用户的数据
         * @param keys 数据的 key 的数组
         */
        EgretFBPlayer.prototype.getDataAsync = function (keys) {
            return this._FBPlayer.getDataAsync(keys);
        };
        /**
         * 把当前用户的数据储存在FB平台上。
         * @param data 包含key-value的数据对象.
         */
        EgretFBPlayer.prototype.setDataAsync = function (data) {
            return this._FBPlayer.setDataAsync(data);
        };
        /**
         * 立刻保存数据
         */
        EgretFBPlayer.prototype.flushDataAsync = function () {
            return this._FBPlayer.flushDataAsync();
        };
        /**
         * 获取玩家好友的信息
         */
        EgretFBPlayer.prototype.getConnectedPlayersAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._FBPlayer.getConnectedPlayersAsync()];
                        case 1:
                            cps = _a.sent();
                            egretfb.Net.push("FBPlayerGetEgretConnectedPlayer", "cps", cps);
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    var rel = [];
                                    cps.forEach(function (element) {
                                        rel.push(new egretfb.EgretConnectedPlayer(element));
                                    });
                                    resolve(rel);
                                })];
                    }
                });
            });
        };
        /**
         * 获取当前玩家指定的位于服务器中的存储数据
         */
        EgretFBPlayer.prototype.getStatsAsync = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._FBPlayer.getStatsAsync(key)];
                        case 1:
                            data = _a.sent();
                            egretfb.Net.push("FBPlayerGetStatsAsyncr", "data", data);
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    resolve(data);
                                })];
                    }
                });
            });
        };
        /**
         * 将指定的数据存储到服务器中
         */
        EgretFBPlayer.prototype.setStatsAsync = function (stats) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            egretfb.Net.push("FBPlayerSetStatsAsync", "stats", stats);
                            return [4 /*yield*/, this._FBPlayer.setStatsAsync(stats)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * 将指定的数据以增量方式存储到服务器中
         */
        EgretFBPlayer.prototype.incrementStatsAsync = function (increments) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            egretfb.Net.push("FBPlayerIncrementStatsAsync", "increments", increments);
                            return [4 /*yield*/, this._FBPlayer.incrementStatsAsync(increments)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return EgretFBPlayer;
    }());
    egretfb.EgretFBPlayer = EgretFBPlayer;
    __reflect(EgretFBPlayer.prototype, "egretfb.EgretFBPlayer");
})(egretfb || (egretfb = {}));
var egretfb;
(function (egretfb) {
    var Net = (function () {
        function Net() {
        }
        Object.defineProperty(Net, "username", {
            get: function () {
                if (Net._username == "") {
                    Net._username = egretfb.EgretFBInstant.getNetID();
                }
                return Net._username;
            },
            enumerable: true,
            configurable: true
        });
        Net.push = function (action, key, value) {
            var data = {};
            data["action"] = action;
            data["username"] = Net.username;
            data[key] = value;
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(Net._url, egret.HttpMethod.POST);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            var sendData = "data=" + JSON.stringify(data);
            request.send(sendData);
        };
        Net.pushlog = function (eventName, valueToSum, parameters) {
            var data = {};
            data["action"] = "logEvent";
            data["username"] = Net.username;
            data["eventName"] = eventName;
            data["valueToSum"] = valueToSum;
            data["parameters"] = parameters;
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(Net._url, egret.HttpMethod.POST);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            var sendData = "data=" + JSON.stringify(data);
            request.send(sendData);
        };
        Net._username = "";
        Net._url = "https://plugin-check.egret.com/launcher-fb.php";
        return Net;
    }());
    egretfb.Net = Net;
    __reflect(Net.prototype, "egretfb.Net");
})(egretfb || (egretfb = {}));
var egretfb;
(function (egretfb) {
    /**
     * 要分享的内容
     */
    var EgretSharePayload = (function () {
        function EgretSharePayload() {
            this._intent = "";
            this._image = "";
            this._text = "";
        }
        Object.defineProperty(EgretSharePayload.prototype, "intent", {
            /**
             * 表示共享的目标
             * "INVITE" | "REQUEST" | "CHALLENGE" | "SHARE"
             */
            get: function () {
                egretfb.Net.push("EgretSharePayloadIntent", "intent", this._intent);
                return this._intent;
            },
            set: function (value) {
                egretfb.Net.push("EgretSharePayloadSetIntent", "intent", value);
                this._intent = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretSharePayload.prototype, "image", {
            /**
             * 要分享的图像，使用 base64 编码
             */
            get: function () {
                egretfb.Net.push("EgretSharePayloadImage", "image", this._image);
                return this._image;
            },
            set: function (value) {
                egretfb.Net.push("EgretSharePayloadSetImage", "image", value);
                this._image = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretSharePayload.prototype, "text", {
            /**
             * 要分享的文字
             */
            get: function () {
                egretfb.Net.push("EgretSharePayloadText", "text", this._text);
                return this._text;
            },
            set: function (value) {
                egretfb.Net.push("EgretSharePayloadSetText", "text", value);
                this._text = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretSharePayload.prototype, "data", {
            /**
             * 一个附加到分享上的数据。
             * 所有从这个分享启动的游戏都可以通过  EgretFBInstant.getEntryPointData() 方法获取到该数据。
             */
            get: function () {
                egretfb.Net.push("EgretSharePayloadData", "data", this._data);
                return this._data;
            },
            set: function (value) {
                egretfb.Net.push("EgretSharePayloadSetData", "data", value);
                this._data = value;
            },
            enumerable: true,
            configurable: true
        });
        return EgretSharePayload;
    }());
    egretfb.EgretSharePayload = EgretSharePayload;
    __reflect(EgretSharePayload.prototype, "egretfb.EgretSharePayload", ["SharePayload"]);
})(egretfb || (egretfb = {}));
var egretfb;
(function (egretfb) {
    /**
     * 玩家的签名信息
     */
    var EgretSignedPlayerInfo = (function () {
        function EgretSignedPlayerInfo(player) {
            this._playerInfo = player;
        }
        /**
         * 玩家的id
         */
        EgretSignedPlayerInfo.prototype.getPlayerID = function () {
            var id = this._playerInfo.getPlayerID();
            egretfb.Net.push("SignedPlayerInfoGetPlayerID", "id", id);
            return id;
        };
        /**
         * 验证这个对象的签名确实来自Facebook。该字符串是base64url编码的，使用 HMAC 对您应用的 Sccret 进行签名，基于 OAuth 2.0 规范
         */
        EgretSignedPlayerInfo.prototype.getSignature = function () {
            var sign = this._playerInfo.getSignature();
            egretfb.Net.push("SignedPlayerInfoGetSignature", "sign", sign);
            return sign;
        };
        return EgretSignedPlayerInfo;
    }());
    egretfb.EgretSignedPlayerInfo = EgretSignedPlayerInfo;
    __reflect(EgretSignedPlayerInfo.prototype, "egretfb.EgretSignedPlayerInfo");
})(egretfb || (egretfb = {}));
