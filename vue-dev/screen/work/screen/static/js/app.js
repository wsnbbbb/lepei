webpackJsonp([4,2],{0:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}var o=n(71),r=i(o),s=n(154),a=i(s),u=n(79),c=i(u),d=n(82),l=i(d),f=n(22);n(77);var h=n(158),p=i(h);r.default.use(p.default),r.default.use(a.default);var v=new a.default({routes:c.default,mode:f.routerMode,strict:!1,scrollBehavior:function(t,e,n){return n?n:(e.meta.keepAlive&&(e.meta.savedPosition=document.body.scrollTop),{x:0,y:t.meta.savedPosition||0})}});new r.default({router:v,store:l.default}).$mount("#app")},22:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i="",o="hash",r="";e.baseUrl=i="",e.imgBaseUrl=r="http://171.221.228.25:9200",e.baseUrl=i,e.routerMode=o,e.imgBaseUrl=r},40:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0}),e.animate=e.showBack=e.loadMore=e.getStyle=e.removeStore=e.getStore=e.setStore=void 0;var o=n(44),r=i(o),s=n(43),a=i(s),u=(e.setStore=function(t,e){t&&("string"!=typeof e&&(e=(0,a.default)(e)),window.localStorage.setItem(t,e))},e.getStore=function(t){if(t)return window.localStorage.getItem(t)},e.removeStore=function(t){t&&window.localStorage.removeItem(t)},e.getStyle=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"int",i=void 0;return i="scrollTop"===e?t.scrollTop:t.currentStyle?t.currentStyle[e]:document.defaultView.getComputedStyle(t,null)[e],"float"==n?parseFloat(i):parseInt(i)});e.loadMore=function t(e,n){var i=window.screen.height,o=void 0,r=void 0,s=void 0,a=void 0,c=void 0,d=void 0;document.body.addEventListener("scroll",function(){t()},!1),e.addEventListener("touchstart",function(){o=e.offsetHeight,r=e.offsetTop,s=u(e,"paddingBottom"),a=u(e,"marginBottom")},{passive:!0}),e.addEventListener("touchmove",function(){t()},{passive:!0}),e.addEventListener("touchend",function(){d=document.body.scrollTop,l()},{passive:!0});var l=function n(){c=requestAnimationFrame(function(){document.body.scrollTop!=d?(d=document.body.scrollTop,t(),n()):(cancelAnimationFrame(c),o=e.offsetHeight,t())})},t=function(){document.body.scrollTop+i>=o+r+s+a&&n()}},e.showBack=function(t){var e=void 0,n=void 0;document.addEventListener("scroll",function(){o()},!1),document.addEventListener("touchstart",function(){o()},{passive:!0}),document.addEventListener("touchmove",function(){o()},{passive:!0}),document.addEventListener("touchend",function(){n=document.body.scrollTop,i()},{passive:!0});var i=function t(){e=requestAnimationFrame(function(){document.body.scrollTop!=n?(n=document.body.scrollTop,t()):cancelAnimationFrame(e),o()})},o=function(){t(document.body.scrollTop>500?!0:!1)}},e.animate=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:400,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"ease-out",o=arguments[4];clearInterval(t.timer),n instanceof Function?(o=n,n=400):n instanceof String&&(i=n,n=400),i instanceof Function&&(o=i,i="ease-out");var s=function(e){return"opacity"===e?Math.round(100*u(t,e,"float")):u(t,e)},a=parseFloat(document.documentElement.style.fontSize),c={},d={};(0,r.default)(e).forEach(function(t){/[^\d^\.]+/gi.test(e[t])?c[t]=e[t].match(/[^\d^\.]+/gi)[0]||"px":c[t]="px",d[t]=s(t)}),(0,r.default)(e).forEach(function(t){"rem"==c[t]?e[t]=Math.ceil(parseInt(e[t])*a):e[t]=parseInt(e[t])});var l=!0,f={};t.timer=setInterval(function(){(0,r.default)(e).forEach(function(r){var a=0,u=!1,c=s(r)||0,h=0,p=void 0;switch(i){case"ease-out":h=c,p=5*n/400;break;case"linear":h=d[r],p=20*n/400;break;case"ease-in":var v=f[r]||0;a=v+(e[r]-d[r])/n,f[r]=a;break;default:h=c,p=5*n/400}switch("ease-in"!==i&&(a=(e[r]-h)/p,a=a>0?Math.ceil(a):Math.floor(a)),i){case"ease-out":u=c!=e[r];break;case"linear":u=Math.abs(Math.abs(c)-Math.abs(e[r]))>Math.abs(a);break;case"ease-in":u=Math.abs(Math.abs(c)-Math.abs(e[r]))>Math.abs(a);break;default:u=c!=e[r]}u?(l=!1,"opacity"===r?(t.style.filter="alpha(opacity:"+(c+a)+")",t.style.opacity=(c+a)/100):"scrollTop"===r?t.scrollTop=c+a:t.style[r]=c+a+"px"):l=!0,l&&(clearInterval(t.timer),o&&o())})},20)}},41:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0}),e.changePassword=e.signout=e.accountLogin=e.deleteAddress=e.getSearchAddress=e.getAddressList=e.getOrderDetail=e.getOrderList=e.getUser=e.exChangeHongbao=e.getExpired=e.getHongbaoNum=e.vipCart=e.getService=e.payRequest=e.validateOrders=e.rePostVerify=e.placeOrders=e.postAddAddress=e.searchNearby=e.getAddress=e.getRemark=e.checkout=e.sendMobile=e.checkExsis=e.getcaptchas=e.mobileCode=e.ratingTags=e.ratingScores=e.getRatingList=e.foodMenu=e.shopDetails=e.foodActivity=e.foodDelivery=e.foodCategory=e.searchRestaurant=e.shopList=e.msiteFoodTypes=e.msiteAddress=e.searchplace=e.currentcity=e.groupcity=e.hotcity=e.cityGuess=e.getEvaluationShow=e.getFlag=e.getLastWeekScore=e.getTodayScoreRecords=e.getPosition=e.getTeacherTrain=e.getTodayAttendance=e.getOpinion=e.getPublish=e.getNewRepair=e.getSchoolSurvey=e.getClassCard=e.getYzFinancialWeekRecord=e.getYzFinancial=e.getConsume=e.getTeacherLeave=e.getStudentLeave=void 0;var o=n(87),r=i(o),s=n(76),a=i(s),u=n(40),c="http://171.221.228.25:9200";e.getStudentLeave=function(t){return(0,a.default)(c+"/exhibition/student-leave/statistics",t,"POST")},e.getTeacherLeave=function(t){return(0,a.default)(c+"/exhibition/teacher-leave/statistics",t,"POST")},e.getConsume=function(t){return(0,a.default)(c+"/exhibition/school-data/semester-consume",t,"POST")},e.getYzFinancial=function(t){return(0,a.default)(c+"/exhibition/school-data/new-yizhou-financial",t,"POST")},e.getYzFinancialWeekRecord=function(t){return(0,a.default)(c+"/exhibition/school-data/new-yizhou-financial-week-record",t,"POST")},e.getClassCard=function(t){return(0,a.default)(c+"/exhibition/school-data/class-card",t,"POST")},e.getSchoolSurvey=function(t){return(0,a.default)(c+"/exhibition/school-data/school-survey",t,"POST")},e.getNewRepair=function(t){return(0,a.default)(c+"/exhibition/school-data/new-repair",t,"POST")},e.getPublish=function(t){return(0,a.default)(c+"/exhibition/school-data/information-publish-statistics",t,"POST")},e.getOpinion=function(t){return(0,a.default)(c+"/exhibition/school-data/opinion",t,"POST")},e.getTodayAttendance=function(t){return(0,a.default)(c+"/exhibition/school-data/today-attendance",t,"POST")},e.getTeacherTrain=function(t){return(0,a.default)(c+"/exhibition/school-data/teacher-train",t,"POST")},e.getPosition=function(t){return(0,a.default)(c+"/exhibition/school-data/module-position",t,"POST")},e.getTodayScoreRecords=function(t){return(0,a.default)(c+"/exhibition/moral-education-evaluation/today-score-records",t,"POST")},e.getLastWeekScore=function(t){return(0,a.default)(c+"/exhibition/moral-education-evaluation/last-week-score",t,"POST")},e.getFlag=function(t){return(0,a.default)(c+"/exhibition/school-data/moral-education-evaluation-flag",t,"POST")},e.getEvaluationShow=function(t){return(0,a.default)(c+"/exhibition/school-data/special-moral-education-evaluation-show",t,"POST")},e.cityGuess=function(){return(0,a.default)("/v1/cities",{type:"guess"})},e.hotcity=function(){return(0,a.default)("/v1/cities",{type:"hot"})},e.groupcity=function(){return(0,a.default)("/v1/cities",{type:"group"})},e.currentcity=function(t){return(0,a.default)("/v1/cities/"+t)},e.searchplace=function(t,e){return(0,a.default)("/v1/pois",{type:"search",city_id:t,keyword:e})},e.msiteAddress=function(t){return(0,a.default)("/v2/pois/"+t)},e.msiteFoodTypes=function(t){return(0,a.default)("/v2/index_entry",{geohash:t,group_type:"1","flags[]":"F"})},e.shopList=function(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"",o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"",r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"",s=arguments.length>6&&void 0!==arguments[6]?arguments[6]:"",u=arguments.length>7&&void 0!==arguments[7]?arguments[7]:[],c="";u.forEach(function(t){t.status&&(c+="&support_ids[]="+t.id)});var d={latitude:t,longitude:e,offset:n,limit:"20","extras[]":"activities",keyword:"",restaurant_category_id:i,"restaurant_category_ids[]":o,order_by:r,"delivery_mode[]":s+c};return(0,a.default)("/shopping/restaurants",d)},e.searchRestaurant=function(t,e){return(0,a.default)("/v4/restaurants",{"extras[]":"restaurant_activity",geohash:t,keyword:e,type:"search"})},e.foodCategory=function(t,e){return(0,a.default)("/shopping/v2/restaurant/category",{latitude:t,longitude:e})},e.foodDelivery=function(t,e){return(0,a.default)("/shopping/v1/restaurants/delivery_modes",{latitude:t,longitude:e,kw:""})},e.foodActivity=function(t,e){return(0,a.default)("/shopping/v1/restaurants/activity_attributes",{latitude:t,longitude:e,kw:""})},e.shopDetails=function(t,e,n){return(0,a.default)("/shopping/restaurant/"+t,{latitude:e,longitude:n+"&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics"})},e.foodMenu=function(t){return(0,a.default)("/shopping/v2/menu",{restaurant_id:t})},e.getRatingList=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";return(0,a.default)("/ugc/v2/restaurants/"+t+"/ratings",{has_content:!0,offset:e,limit:10,tag_name:n})},e.ratingScores=function(t){return(0,a.default)("/ugc/v2/restaurants/"+t+"/ratings/scores")},e.ratingTags=function(t){return(0,a.default)("/ugc/v2/restaurants/"+t+"/ratings/tags")},e.mobileCode=function(t){return(0,a.default)("/v4/mobile/verify_code/send",{mobile:t,scene:"login",type:"sms"},"POST")},e.getcaptchas=function(){return(0,a.default)(c+"/exhibition/student-leave/statistics",{schoolId:1,type:2},"POST")},e.checkExsis=function(t,e){var n;return(0,a.default)("/v1/users/exists",(n={},(0,r.default)(n,e,t),(0,r.default)(n,"type",e),n))},e.sendMobile=function(t,e,n,i){var o;return(0,a.default)("/v1/mobile/verify_code/send",(o={action:"send",captcha_code:e},(0,r.default)(o,n,t),(0,r.default)(o,"type","sms"),(0,r.default)(o,"way",n),(0,r.default)(o,"password",i),o),"POST")},e.checkout=function(t,e,n){return(0,a.default)("/v1/carts/checkout",{come_from:"web",geohash:t,entities:e,restaurant_id:n},"POST")},e.getRemark=function(t,e){return(0,a.default)("/v1/carts/"+t+"/remarks",{sig:e})},e.getAddress=function(t,e){return(0,a.default)("/v1/carts/"+t+"/addresses",{sig:e})},e.searchNearby=function(t){return(0,a.default)("/v1/pois",{type:"nearby",keyword:t})},e.postAddAddress=function(t,e,n,i,o,r,s,u,c,d,l){return(0,a.default)("/v1/users/"+t+"/addresses",{address:e,address_detail:n,geohash:i,name:o,phone:r,phone_bk:s,poi_type:u,sex:c,tag:d,tag_type:l},"POST")},e.placeOrders=function(t,e,n,i,o,r,s){return(0,a.default)("/v1/users/"+t+"/carts/"+e+"/orders",{address_id:n,come_from:"mobile_web",deliver_time:"",description:i,entities:o,geohash:r,paymethod_id:1,sig:s},"POST")},e.rePostVerify=function(t,e,n){return(0,a.default)("/v1/carts/"+t+"/verify_code",{sig:e,type:n},"POST")},e.validateOrders=function(t){var e=t.user_id,n=t.cart_id,i=t.address_id,o=t.description,r=t.entities,s=t.geohash,u=t.sig,c=t.validation_code,d=t.validation_token;return(0,a.default)("/v1/users/"+e+"/carts/"+n+"/orders",{address_id:i,come_from:"mobile_web",deliver_time:"",description:o,entities:r,geohash:s,paymethod_id:1,sig:u,validation_code:c,validation_token:d},"POST")},e.payRequest=function(t,e){return(0,a.default)("/payapi/payment/queryOrder",{merchantId:5,merchantOrderNo:t,source:"MOBILE_WAP",userId:e,version:"1.0.0"})},e.getService=function(){return(0,a.default)("/v3/profile/explain")},e.vipCart=function(t,e,n){return(0,a.default)("/member/v1/users/"+t+"/delivery_card/physical_card/bind",{number:e,password:n},"POST")},e.getHongbaoNum=function(t){return(0,a.default)("/promotion/v2/users/"+t+"/hongbaos?limit=20&offset=0")},e.getExpired=function(t){return(0,a.default)("/promotion/v2/users/"+t+"/expired_hongbaos?limit=20&offset=0")},e.exChangeHongbao=function(t,e,n){return(0,a.default)("/v1/users/"+t+"/hongbao/exchange",{exchange_code:e,captcha_code:n},"POST")},e.getUser=function(){return(0,a.default)("/v1/user",{user_id:(0,u.getStore)("user_id")})},e.getOrderList=function(t,e){return(0,a.default)("/bos/v2/users/"+t+"/orders",{limit:10,offset:e})},e.getOrderDetail=function(t,e){return(0,a.default)("/bos/v1/users/"+t+"/orders/"+e+"/snapshot")},e.getAddressList=function(t){return(0,a.default)("/v1/users/"+t+"/addresses")},e.getSearchAddress=function(t){return(0,a.default)("v1/pois",{keyword:t,type:"nearby"})},e.deleteAddress=function(t,e){return(0,a.default)("/v1/users/"+t+"/addresses/"+e,{},"DELETE")},e.accountLogin=function(t,e,n){return(0,a.default)("/v2/login",{username:t,password:e,captcha_code:n},"POST")},e.signout=function(){return(0,a.default)("/v2/signout")},e.changePassword=function(t,e,n,i,o){return(0,a.default)("/v2/changepassword",{username:t,oldpassWord:e,newpassword:n,confirmpassword:i,captcha_code:o},"POST")}},42:function(t,e){"use strict"},73:function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={components:{}}},76:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(24),r=i(o),s=n(46),a=i(s),u=n(45),c=i(u),d=n(43),l=i(d),f=n(44),h=i(f),p=n(23),v=i(p),g=n(22);e.default=function(){var t=(0,v.default)(r.default.mark(function t(){var e,n,i,o,s=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",u=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},d=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"GET",f=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"fetch";return r.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(d=d.toUpperCase(),s=g.baseUrl+s,"GET"==d&&(e="",(0,h.default)(u).forEach(function(t){e+=t+"="+u[t]+"&"}),""!==e&&(e=e.substr(0,e.lastIndexOf("&")),s=s+"?"+e)),!window.fetch||"fetch"!=f){t.next=21;break}return n={method:d,headers:{Accept:"application/json","Content-Type":"application/json"},mode:"cors",cache:"force-cache"},"POST"==d&&Object.defineProperty(n,"body",{value:(0,l.default)(u)}),t.prev=6,t.next=9,fetch(s,n);case 9:return i=t.sent,t.next=12,i.json();case 12:return o=t.sent,t.abrupt("return",o);case 16:throw t.prev=16,t.t0=t.catch(6),new Error(t.t0);case 19:t.next=22;break;case 21:return t.abrupt("return",new c.default(function(t,e){var n=void 0;n=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject;var i="";"POST"==d&&(i=(0,l.default)(u)),n.open(d,s,!0),n.setRequestHeader("Content-type","application/x-www-form-urlencoded"),n.send(i),n.onreadystatechange=function(){if(4==n.readyState)if(200==n.status){var i=n.response;"object"!==("undefined"==typeof i?"undefined":(0,a.default)(i))&&(i=JSON.parse(i)),t(i)}else e(n)}}));case 22:case"end":return t.stop()}},t,void 0,[[6,16]])}));return function(){return t.apply(this,arguments)}}()},77:function(t,e){"use strict";!function(t,e){var n=t.documentElement,i="orientationchange"in window?"orientationchange":"resize",o=function(){var t=n.clientWidth;t&&(n.style.fontSize=20*(t/320)+"px")};t.addEventListener&&(e.addEventListener(i,o,!1),t.addEventListener("DOMContentLoaded",o,!1))}(document,window)},79:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(148),r=i(o),s=function(t){return n.e(0,function(){return t(n(149))})},a=function(t){return n.e(1,function(){return t(n(150))})};e.default=[{path:"/",component:r.default,children:[{path:"",redirect:"/home"},{path:"/test",component:a},{path:"/home/:id",component:s}]}]},80:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(24),r=i(o),s=n(23),a=i(s),u=n(41),c=n(42);e.default={getUserInfo:function(t){var e=this;t.commit,t.state;return(0,a.default)(r.default.mark(function t(){return r.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:case"end":return t.stop()}},t,e)}))()},saveAddress:function(t){var e=this,n=t.commit,i=t.state;return(0,a.default)(r.default.mark(function t(){var o;return r.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!(i.removeAddress.length>0)){t.next=2;break}return t.abrupt("return");case 2:return t.next=4,(0,u.getAddressList)(i.userInfo.user_id);case 4:o=t.sent,n(c.SAVE_ADDRESS,o);case 6:case"end":return t.stop()}},t,e)}))()}}},81:function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={}},82:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(71),r=i(o),s=n(72),a=i(s),u=n(83),c=i(u),d=n(80),l=i(d),f=n(81),h=i(f);r.default.use(a.default);var p={latitude:""};e.default=new a.default.Store({state:p,getters:h.default,actions:l.default,mutations:c.default})},83:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),n(42);n(40),n(22);e.default={}},132:function(t,e){},148:function(t,e,n){n(132);var i=n(38)(n(73),n(151),null,null);t.exports=i.exports},151:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("transition",{attrs:{name:"router-fade",mode:"out-in"}},[n("keep-alive",[t.$route.meta.keepAlive?n("router-view"):t._e()],1)],1),t._v(" "),n("transition",{attrs:{name:"router-fade",mode:"out-in"}},[t.$route.meta.keepAlive?t._e():n("router-view")],1)],1)},staticRenderFns:[]}},158:function(t,e,n){!function(e,n){t.exports=n()}("undefined"!=typeof self?self:this,function(){return function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=1)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),n(4)();var i=n(5),o=n(6);e.default={name:"vue-seamless-scroll",data:function(){return{xPos:0,yPos:0,delay:0,copyHtml:"",height:0,width:0,realBoxWidth:0,reqFrame:null,singleWaitTime:null,isHover:!1}},props:{data:{type:Array,default:function(){return[]}},classOption:{type:Object,default:function(){return{}}}},computed:{leftSwitchState:function(){return this.xPos<0},rightSwitchState:function(){return Math.abs(this.xPos)<this.realBoxWidth-this.width},leftSwitchClass:function(){return this.leftSwitchState?"":this.options.switchDisabledClass},rightSwitchClass:function(){return this.rightSwitchState?"":this.options.switchDisabledClass},leftSwitch:function(){return{position:"absolute",margin:this.height/2+"px 0 0 -"+this.options.switchOffset+"px",transform:"translate(-100%,-50%)"}},rightSwitch:function(){return{position:"absolute",margin:this.height/2+"px 0 0 "+(this.width+this.options.switchOffset)+"px",transform:"translateY(-50%)"}},float:function(){return this.isHorizontal?{float:"left",overflow:"hidden"}:{overflow:"hidden"}},pos:function(){return{transform:"translate("+this.xPos+"px,"+this.yPos+"px)",transition:"all "+(this.ease||"ease-in")+" "+this.delay+"ms",overflow:"hidden"}},defaultOption:function(){return{step:1,limitMoveNum:5,hoverStop:!0,direction:1,openTouch:!0,singleHeight:0,singleWidth:0,waitTime:1e3,switchOffset:30,autoPlay:!0,navigation:!1,switchSingleStep:134,switchDelay:400,switchDisabledClass:"disabled",isSingleRemUnit:!1}},options:function(){return o({},this.defaultOption,this.classOption)},navigation:function(){return this.options.navigation},autoPlay:function(){return!this.navigation&&this.options.autoPlay},scrollSwitch:function(){return this.data.length>=this.options.limitMoveNum},hoverStopSwitch:function(){return this.options.hoverStop&&this.autoPlay&&this.scrollSwitch},canTouchScroll:function(){return this.options.openTouch},isHorizontal:function(){return this.options.direction>1},baseFontSize:function(){return this.options.isSingleRemUnit?parseInt(window.getComputedStyle(document.documentElement,null).fontSize):1},realSingleStopWidth:function(){return this.options.singleWidth*this.baseFontSize},realSingleStopHeight:function(){return this.options.singleHeight*this.baseFontSize},step:function(){var t=this.options.step;return this.isHorizontal?this.realSingleStopWidth:this.realSingleStopHeight,t}},methods:{leftSwitchClick:function(){if(this.leftSwitchState)return Math.abs(this.xPos)<this.options.switchSingleStep?void(this.xPos=0):void(this.xPos+=this.options.switchSingleStep)},rightSwitchClick:function(){if(this.rightSwitchState)return this.realBoxWidth-this.width+this.xPos<this.options.switchSingleStep?void(this.xPos=this.width-this.realBoxWidth):void(this.xPos-=this.options.switchSingleStep)},_cancle:function(){cancelAnimationFrame(this.reqFrame||"")},touchStart:function(t){var e=this;if(this.canTouchScroll){var n=void 0,i=t.targetTouches[0],o=this.options,r=o.waitTime,s=o.singleHeight,a=o.singleWidth;this.startPos={x:i.pageX,y:i.pageY},this.startPosY=this.yPos,this.startPosX=this.xPos,s&&a?(n&&clearTimeout(n),n=setTimeout(function(){e._cancle()},r+20)):this._cancle()}},touchMove:function(t){if(!(!this.canTouchScroll||t.targetTouches.length>1||t.scale&&1!==t.scale)){var e=t.targetTouches[0],n=this.options.direction;this.endPos={x:e.pageX-this.startPos.x,y:e.pageY-this.startPos.y},event.preventDefault();var i=Math.abs(this.endPos.x)<Math.abs(this.endPos.y)?1:0;1===i&&n<2?this.yPos=this.startPosY+this.endPos.y:0===i&&n>1&&(this.xPos=this.startPosX+this.endPos.x)}},touchEnd:function(){var t=this;if(this.canTouchScroll){var e=void 0,n=this.options.direction;if(this.delay=50,1===n)this.yPos>0&&(this.yPos=0);else if(0===n){var i=this.realBoxHeight/2*-1;this.yPos<i&&(this.yPos=i)}else if(2===n)this.xPos>0&&(this.xPos=0);else if(3===n){var o=-1*this.realBoxWidth;this.xPos<o&&(this.xPos=o)}e&&clearTimeout(e),e=setTimeout(function(){t.delay=0,t._move()},this.delay)}},enter:function(){this.hoverStopSwitch&&(this.isHover=!0,this.singleWaitTime&&clearTimeout(this.singleWaitTime),this._cancle())},leave:function(){this.hoverStopSwitch&&(this.isHover=!1,this._move())},_move:function(){this.isHover||(this._cancle(),this.reqFrame=requestAnimationFrame(function(){var t=this,e=this.realBoxHeight/2,n=this.realBoxWidth/2,i=this.options,o=i.direction,r=i.waitTime,s=this.step;1===o?(Math.abs(this.yPos)>=e&&(this.$emit("ScrollEnd"),this.yPos=0),this.yPos-=s):0===o?(this.yPos>=0&&(this.$emit("ScrollEnd"),this.yPos=-1*e),this.yPos+=s):2===o?(Math.abs(this.xPos)>=n&&(this.$emit("ScrollEnd"),this.xPos=0),this.xPos-=s):3===o&&(this.xPos>=0&&(this.$emit("ScrollEnd"),this.xPos=-1*n),this.xPos+=s),this.singleWaitTime&&clearTimeout(this.singleWaitTime),this.realSingleStopHeight?Math.abs(this.yPos)%this.realSingleStopHeight<s?this.singleWaitTime=setTimeout(function(){t._move()},r):this._move():this.realSingleStopWidth&&Math.abs(this.xPos)%this.realSingleStopWidth<s?this.singleWaitTime=setTimeout(function(){t._move()},r):this._move()}.bind(this)))},_initMove:function(){var t=this;this.$nextTick(function(){t._dataWarm(t.data),t.copyHtml="",t.height=t.$refs.wrap.offsetHeight,t.width=t.$refs.wrap.offsetWidth;var e=t.$refs.slotList.offsetWidth,n=t.options.switchDelay,i=t.autoPlay;return t.isHorizontal&&i&&(e=2*e+1),t.$refs.realBox.style.width=e+"px",t.realBoxWidth=e,i?void(t.scrollSwitch?(t.copyHtml=t.$refs.slotList.innerHTML,setTimeout(function(){t.realBoxHeight=t.$refs.realBox.offsetHeight,t._move()},0)):(t._cancle(),t.yPos=t.xPos=0)):(t.ease="linear",void(t.delay=n))})},_dataWarm:function(t){t.length}},mounted:function(){this._initMove()},watch:{data:function(t,e){this._dataWarm(t),i(t,e)||(this._cancle(),this._initMove())}},beforeDestroy:function(){this._cancle()}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(2),o=function(t){return t&&t.__esModule?t:{default:t}}(i);o.default.install=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};t.component(e.componentName||o.default.name,o.default)},"undefined"!=typeof window&&window.Vue&&Vue.component(o.default.name,o.default),e.default=o.default},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(0),o=n.n(i);for(var r in i)"default"!==r&&function(t){n.d(e,t,function(){return i[t]})}(r);var s=n(7),a=n(3),u=a(o.a,s.a,!1,null,null,null);e.default=u.exports},function(t,e){t.exports=function(t,e,n,i,o,r){var s,a=t=t||{},u=typeof t.default;"object"!==u&&"function"!==u||(s=t,a=t.default);var c="function"==typeof a?a.options:a;e&&(c.render=e.render,c.staticRenderFns=e.staticRenderFns,c._compiled=!0),n&&(c.functional=!0),o&&(c._scopeId=o);var d;if(r?(d=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),i&&i.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(r)},c._ssrRegister=d):i&&(d=i),d){var l=c.functional,f=l?c.render:c.beforeCreate;l?(c._injectStyles=d,c.render=function(t,e){return d.call(e),f(t,e)}):c.beforeCreate=f?[].concat(f,d):[d]}return{esModule:s,exports:a,options:c}}},function(t,e){var n=function(){window.cancelAnimationFrame=function(){return window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame||function(t){return window.clearTimeout(t)}}(),window.requestAnimationFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){return window.setTimeout(t,1e3/60)}}()};t.exports=n},function(t,e){var n=function(t,e){if(t===e)return!0;if(t.length!==e.length)return!1;for(var n=0;n<t.length;++n)if(t[n]!==e[n])return!1;return!0};t.exports=n},function(t,e){function n(){Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)});var t=void 0,e=void 0,o=void 0,r=void 0,s=void 0,a=void 0,u=1,c=arguments[0]||{},d=!1,l=arguments.length;if("boolean"==typeof c&&(d=c,c=arguments[1]||{},u++),"object"!==(void 0===c?"undefined":i(c))&&"function"!=typeof c&&(c={}),u===l)return c;for(;u<l;u++)if(null!=(e=arguments[u]))for(t in e)o=c[t],r=e[t],s=Array.isArray(r),d&&r&&("object"===(void 0===r?"undefined":i(r))||s)?(s?(s=!1,a=o&&Array.isArray(o)?o:[]):a=o&&"object"===(void 0===o?"undefined":i(o))?o:{},c[t]=n(d,a,r)):void 0!==r&&(c[t]=r);return c}var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};t.exports=n},function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"wrap"},[t.navigation?n("div",{class:t.leftSwitchClass,style:t.leftSwitch,on:{click:t.leftSwitchClick}},[t._t("left-switch")],2):t._e(),t._v(" "),t.navigation?n("div",{class:t.rightSwitchClass,style:t.rightSwitch,on:{click:t.rightSwitchClick}},[t._t("right-switch")],2):t._e(),t._v(" "),n("div",{ref:"realBox",style:t.pos,on:{mouseenter:t.enter,mouseleave:t.leave,touchstart:t.touchStart,touchmove:t.touchMove,touchend:t.touchEnd}},[n("div",{ref:"slotList",style:t.float},[t._t("default")],2),t._v(" "),n("div",{style:t.float,domProps:{innerHTML:t._s(t.copyHtml)}})])])},o=[],r={render:i,staticRenderFns:o};e.a=r}]).default})}});