(function(t){function e(e){for(var a,s,i=e[0],u=e[1],c=e[2],l=0,d=[];l<i.length;l++)s=i[l],Object.prototype.hasOwnProperty.call(n,s)&&n[s]&&d.push(n[s][0]),n[s]=0;for(a in u)Object.prototype.hasOwnProperty.call(u,a)&&(t[a]=u[a]);p&&p(e);while(d.length)d.shift()();return o.push.apply(o,c||[]),r()}function r(){for(var t,e=0;e<o.length;e++){for(var r=o[e],a=!0,s=1;s<r.length;s++){var i=r[s];0!==n[i]&&(a=!1)}a&&(o.splice(e--,1),t=u(u.s=r[0]))}return t}var a={},s={app:0},n={app:0},o=[];function i(t){return u.p+"js/"+({about:"about"}[t]||t)+"."+{about:"ac06ddfd"}[t]+".js"}function u(e){if(a[e])return a[e].exports;var r=a[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,u),r.l=!0,r.exports}u.e=function(t){var e=[],r={about:1};s[t]?e.push(s[t]):0!==s[t]&&r[t]&&e.push(s[t]=new Promise((function(e,r){for(var a="css/"+({about:"about"}[t]||t)+"."+{about:"2183ded4"}[t]+".css",n=u.p+a,o=document.getElementsByTagName("link"),i=0;i<o.length;i++){var c=o[i],l=c.getAttribute("data-href")||c.getAttribute("href");if("stylesheet"===c.rel&&(l===a||l===n))return e()}var d=document.getElementsByTagName("style");for(i=0;i<d.length;i++){c=d[i],l=c.getAttribute("data-href");if(l===a||l===n)return e()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=e,p.onerror=function(e){var a=e&&e.target&&e.target.src||n,o=new Error("Loading CSS chunk "+t+" failed.\n("+a+")");o.code="CSS_CHUNK_LOAD_FAILED",o.request=a,delete s[t],p.parentNode.removeChild(p),r(o)},p.href=n;var b=document.getElementsByTagName("head")[0];b.appendChild(p)})).then((function(){s[t]=0})));var a=n[t];if(0!==a)if(a)e.push(a[2]);else{var o=new Promise((function(e,r){a=n[t]=[e,r]}));e.push(a[2]=o);var c,l=document.createElement("script");l.charset="utf-8",l.timeout=120,u.nc&&l.setAttribute("nonce",u.nc),l.src=i(t);var d=new Error;c=function(e){l.onerror=l.onload=null,clearTimeout(p);var r=n[t];if(0!==r){if(r){var a=e&&("load"===e.type?"missing":e.type),s=e&&e.target&&e.target.src;d.message="Loading chunk "+t+" failed.\n("+a+": "+s+")",d.name="ChunkLoadError",d.type=a,d.request=s,r[1](d)}n[t]=void 0}};var p=setTimeout((function(){c({type:"timeout",target:l})}),12e4);l.onerror=l.onload=c,document.head.appendChild(l)}return Promise.all(e)},u.m=t,u.c=a,u.d=function(t,e,r){u.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},u.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},u.t=function(t,e){if(1&e&&(t=u(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(u.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)u.d(r,a,function(e){return t[e]}.bind(null,a));return r},u.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return u.d(e,"a",e),e},u.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},u.p="/",u.oe=function(t){throw console.error(t),t};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],l=c.push.bind(c);c.push=e,c=c.slice();for(var d=0;d<c.length;d++)e(c[d]);var p=l;o.push([0,"chunk-vendors"]),r()})({0:function(t,e,r){t.exports=r("6afe")},"1ddd":function(t,e){function r(t){const e={status:"ERROR"};return e["message"]="Invalid Parameter(s)! "+t,e["resultset"]=[],e}function a(t){const e={status:"ERROR"};return e["message"]=t,e["resultset"]=[],e}function s(t,e=[]){const r={status:"SUCCESS"};return r["message"]=t,r["resultset"]=e,r}t.exports={buildJsonInvalidParameters:r,buildJsonErrorMessage:a,buildJsonSuccessMessage:s}},4147:function(t,e,r){},"4d8f":function(t,e,r){"use strict";r("65eb")},"65eb":function(t,e,r){},"6afe":function(t,e,r){"use strict";r.r(e);var a=r("2b0e"),s=function(){var t=this,e=t._self._c;return e("div",{attrs:{id:"app"}},[e("b-navbar",{staticClass:"pr-3",attrs:{toggleable:"md",type:"dark",variant:"info"}},[e("b-navbar-brand",{staticClass:"m-3",attrs:{to:"/"}},[e("img",{attrs:{src:"/images/8bitgpu.jpeg"}}),t._v(" GPUs 4 All ")]),e("b-navbar-toggle",{attrs:{target:"nav-collapse"}}),e("b-collapse",{attrs:{id:"nav-collapse","is-nav":""}},[e("b-navbar-nav",[e("b-nav-item",{attrs:{to:"/"}},[t._v("Home")]),e("b-nav-item",{attrs:{to:"/about"}},[t._v("About")]),e("b-nav-item",{attrs:{to:"/about"}},[t._v("Specials")]),e("b-nav-item",{attrs:{to:"/about"}},[t._v("Top Sellers")]),e("b-nav-item",{attrs:{to:"/about"}},[t._v("Open box")]),e("b-nav-item",{attrs:{to:"/about"}},[t._v("Upcoming")])],1),e("b-navbar-nav",{staticClass:"ml-auto"},[e("b-nav-form",{staticClass:"mr-3"},[e("b-form-input",{staticClass:"mr-sm-2",attrs:{size:"sm",placeholder:"Search"}}),e("b-button",{staticClass:"my-2 my-sm-0",attrs:{size:"sm",type:"submit"}},[t._v("Search")])],1)],1),t.loggedIn?e("b-navbar-nav",{staticClass:"align-items-center"},[e("b-icon",{attrs:{icon:"person-circle",variant:"white"}}),e("b-nav-item-dropdown",{attrs:{text:"Thuc Nguyen",variant:"danger",right:""}},[e("b-dropdown-item",{attrs:{to:"/user"}},[t._v("Account")]),e("b-dropdown-item",{attrs:{to:"/"}},[t._v("Cart")]),e("b-dropdown-item",{attrs:{to:"/wishlist"}},[t._v("Wishlist")]),e("b-dropdown-item",{attrs:{to:"/"}},[t._v("Orders")]),e("b-dropdown-item",{attrs:{to:"/"}},[t._v("Transactions")]),e("b-dropdown-item",{attrs:{to:"/"}},[t._v("Settings")]),e("b-dropdown-item",{on:{click:t.performLogOut}},[t._v("Log Out")])],1)],1):e("b-navbar-nav",{staticClass:"ml-5 mr-5"},[e("b-nav-item",{staticClass:"mr-3"},[t._v("Log In")]),e("b-button",{attrs:{to:"/signup"}},[t._v("Sign Up")])],1)],1)],1),e("router-view",{attrs:{id:"routerview"}}),e("div",{staticClass:"mt-5 pt-5 pb-5",attrs:{id:"footer"}},[e("b-container",{staticClass:"text-left"},[e("b-row",[e("b-col",{attrs:{sm:"6"}},[e("h5",{staticClass:"title"},[t._v("Footer Content")]),e("p",[t._v("Here you can use rows and columns here to organize your footer content.")])]),e("b-col",{attrs:{sm:"6"}},[e("h5",{staticClass:"title"},[t._v("Links")]),e("ul",[e("li",{staticClass:"list-unstyled"},[e("a",{attrs:{href:"#!"}},[t._v("Link 1")])]),e("li",{staticClass:"list-unstyled"},[e("a",{attrs:{href:"#!"}},[t._v("Link 2")])]),e("li",{staticClass:"list-unstyled"},[e("a",{attrs:{href:"#!"}},[t._v("Link 3")])]),e("li",{staticClass:"list-unstyled"},[e("a",{attrs:{href:"#!"}},[t._v("Link 4")])])])])],1)],1),e("div",{staticClass:"footer-copyright text-center py-3"},[e("b-container",{attrs:{fluid:""}},[t._v(" © 2020 Copyright: "),e("a",{attrs:{href:"https://www.bootstrap.com"}},[t._v(" bootstrap.com ")])])],1)],1)],1)},n=[],o={data:function(){return{loggedIn:!0}},methods:{performLogOut(){this.loggedIn=!1}}},i=o,u=(r("4d8f"),r("2877")),c=Object(u["a"])(i,s,n,!1,null,"7f7fd610",null),l=c.exports,d=r("8c4f"),p=function(){var t=this,e=t._self._c;return e("div",{staticClass:"home mb-5 pb-5"},[e("div",{attrs:{"mb-5":"","pb-5":""}},[e("b-card",{attrs:{overlay:"","img-src":"https://cdn.mos.cms.futurecdn.net/3NRtQtTj5aUZ5aevhwyGAh-970-80.jpg.webp","img-alt":"Card Image","text-variant":"white",title:"Image Overlay","sub-title":"Subtitle"}},[e("b-card-text",[t._v(" Some quick example text to build on the card and make up the bulk of the card's content. ")])],1)],1),e("div",{staticClass:"animated fadeIn mt-5 pt-5 mb-5 pb-5"},[e("b-card-group",{attrs:{deck:""}},t._l(t.currentPageClubs,(function(r,a){return e("b-card",{key:a,attrs:{"img-src":"https://snpi.dell.com/snp/images2/300/en-us~490-BGUS_V1/490-BGUS_V1.JPG","img-alt":"Img","img-top":""}},[e("h4",{staticClass:"card-title"},[t._v(" "+t._s(r.description)+" ")]),e("p",{staticClass:"card-text"},[t._v(" "+t._s(r.price)+" ")]),e("p",{staticClass:"card-text"},[t._v(" "+t._s(r.country)+" ")]),e("div",{attrs:{slot:"footer"},slot:"footer"},[e("b-btn",{attrs:{variant:"primary",block:""}},[t._v("Add")])],1)])})),1),e("div",{staticClass:"card-pagination"},t._l(t.nbPages,(function(r){return e("div",{key:r,staticClass:"page-index",class:{active:t.currentPage(r)},on:{click:function(e){return t.goto(r)}}})})),0)],1),e("div",{staticClass:"mt-5 pt-5 mb-5"},[e("b-card-group",{attrs:{deck:""}},[e("b-card",{staticClass:"text-center",attrs:{"bg-variant":"info","text-variant":"white",header:"Info"}},[e("br"),e("br"),e("br"),e("br"),e("b-card-text",[t._v("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")]),e("br"),e("br"),e("br"),e("br")],1),e("b-card",{staticClass:"text-center",attrs:{"bg-variant":"warning","text-variant":"white",header:"Warning"}},[e("br"),e("br"),e("br"),e("br"),e("b-card-text",[t._v("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")]),e("br"),e("br"),e("br"),e("br")],1),e("b-card",{staticClass:"text-center",attrs:{"bg-variant":"danger","text-variant":"white",header:"Danger"}},[e("br"),e("br"),e("br"),e("br"),e("b-card-text",[t._v("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")]),e("br"),e("br"),e("br"),e("br")],1)],1)],1)])},b=[],m=(r("13d5"),{name:"Home",components:{},data(){return{clubs:[{id:1,description:"chelsea is the best club in the world and chelsea has a great player",price:1e3,country:"england"},{id:2,description:"liverpool has salah",price:900,country:"england"},{id:3,description:"mu fans",price:800,country:"england"},{id:4,description:"city has a great coach. Thas is guardiola",price:700,country:"england"},{id:5,description:"arsenal player",price:600,country:"england"},{id:6,description:"tottenham in london",price:500,country:"england"},{id:7,description:"juventus stadium",price:400,country:"italy"},{id:8,description:"madrid sell ronaldo",price:300,country:"spain"},{id:9,description:"barcelona in the spain",price:200,country:"spain"},{id:10,description:"psg buys neymar at a fantastic price",price:100,country:"france"}],paginatedClubs:[],nbPages:0,nbRowPerPage:4,currentPageIndex:0}},computed:{formattedClubs(){return this.clubs.reduce((t,e,r)=>(r%4===0&&t.push([]),t[t.length-1].push(e),t),[])},currentPageClubs(){return this.createPages(),this.paginatedClubs[this.currentPageIndex]}},methods:{currentPage(t){return t-1===this.currentPageIndex},createPages(){let t=Object.keys(this.clubs).length;this.nbPages=0;for(let e=0;e<t;e+=this.nbRowPerPage)this.paginatedClubs[this.nbPages]=this.clubs.slice(e,e+this.nbRowPerPage),this.nbPages++},goto(t){this.currentPageIndex=t-1}}}),f=m,g=(r("ed09"),Object(u["a"])(f,p,b,!1,null,null,null)),h=g.exports;a["default"].use(d["a"]);const v=[{path:"/",name:"Home",component:h},{path:"/about",name:"About",component:()=>r.e("about").then(r.bind(null,"f9e2"))},{path:"/user",name:"User",component:()=>r.e("about").then(r.bind(null,"502a"))},{path:"/wishlist",name:"Wishlist",component:()=>r.e("about").then(r.bind(null,"988b"))},{path:"/product-description",name:"Product Description",component:()=>r.e("about").then(r.bind(null,"6ea4"))},{path:"/signup",name:"SignUp",component:()=>r.e("about").then(r.bind(null,"d51b"))}],y=new d["a"]({mode:"history",base:"/",routes:v});var w=y,_=r("2f62");a["default"].use(_["a"]);var C=new _["a"].Store({state:{},mutations:{},actions:{},modules:{}}),P=r("5f5b"),x=r("b1e0"),R=(r("f9e3"),r("2dd8"),r("caad"),r("9755")),E=r.n(R),S=r("bc3a"),O=r.n(S),T={methods:{performHttpRequest:async function(t,e,r){if(0==/^\//.test(t))return E.a.buildJsonErrorMessage("ERROR: apiEndpoint format is invalid");if("string"!=typeof r)return E.a.buildJsonErrorMessage("ERROR: method is an invalid datatype");if(e&&"object"!=typeof e)return E.a.buildJsonErrorMessage("ERROR: params is an invalid datatype");const a=r.trim().toUpperCase(),s=["GET","POST","PUT"];if(!s.includes(a))return E.a.buildJsonErrorMessage("ERROR: method is not allowed");const n=O.a.create({baseURL:"http://localhost:3000/apis",timeout:1e4});let o=null;if("GET"===a)try{o=await n.get(t)}catch(c){return E.a.buildJsonErrorMessage(c)}else if("POST"===a)try{o=await n.post(t,e)}catch(c){return E.a.buildJsonErrorMessage(c)}else if("PUT"===a)try{o=await n.put(t,e)}catch(c){return E.a.buildJsonErrorMessage(c)}if(!o["status"])return E.a.buildJsonErrorMessage("ERROR: http response status does not exist");if(!o["data"])return E.a.buildJsonErrorMessage("ERROR: http response data does not exist");const i=o["status"],u=o["data"];return i<200||i>299?E.a.buildJsonErrorMessage("ERROR: The http request failed"):u},performGetHttpRequest:async function(t){return console.log(t),this.performHttpRequest(t,null,"GET")},performPostHttpRequest:async function(t,e){return console.log(t),this.performHttpRequest(t,e,"POST")},performPutHttpRequest:async function(t,e){return console.log(t),this.performHttpRequest(t,e,"PUT")}}},k={methods:{performShowSuccessMessage(t,e=3){const r=1e3*e;this.$bvToast.toast(t,{autoHideDelay:r,appendToast:!0,variant:"success",noCloseButton:!0,solid:!0})},performShowWarningMessage(t,e=3){const r=1e3*e;this.$bvToast.toast(t,{autoHideDelay:r,appendToast:!0,variant:"warning",noCloseButton:!0,solid:!0})},performShowErrorMessage(t,e=3){const r=1e3*e;this.$bvToast.toast(t,{autoHideDelay:r,appendToast:!0,variant:"danger",noCloseButton:!0,solid:!0})},performShowInfoMessage(t,e=3){const r=1e3*e;this.$bvToast.toast(t,{autoHideDelay:r,appendToast:!0,variant:"info",noCloseButton:!0,solid:!0})}}};a["default"].use(P["a"]),a["default"].use(x["a"]),a["default"].mixin(T),a["default"].mixin(k),a["default"].config.productionTip=!1,new a["default"]({router:w,store:C,render:t=>t(l)}).$mount("#app")},9755:function(t,e,r){const a=r("1ddd");t.exports={buildJsonInvalidParameters:a.buildJsonInvalidParameters,buildJsonErrorMessage:a.buildJsonErrorMessage,buildJsonSuccessMessage:a.buildJsonSuccessMessage}},ed09:function(t,e,r){"use strict";r("4147")}});
//# sourceMappingURL=app.b7f8b83c.js.map