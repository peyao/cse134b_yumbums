function LimitStore(){}LimitStore.store={}
LimitStore.LIMIT=2
LimitStore.put=function(e,n){if(LimitStore.store[e]===undefined){LimitStore.store[e]=[null,null]}LimitStore.store[e].push(n)
  if(LimitStore.store[e].length==LimitStore.LIMIT+1){LimitStore.store[e].shift()}return LimitStore.store[e]}
LimitStore.get=function(e){return LimitStore.store[e]}
if(typeof window!=="undefined"){(function(){function e(e,n){n=n||{bubbles:false,cancelable:false,details:undefined}
  var i=document.createEvent("CustomEvent")
  i.initCustomEvent(e,n.bubbles,n.cancelable,n.details)
  return i}e.prototype=window.Event.prototype
  window.CustomEvent=e})()}var _temp_OneSignal=null
if(typeof OneSignal!=="undefined")_temp_OneSignal=OneSignal
var OneSignal={_VERSION:10801,_HOST_URL:"https://onesignal.com/api/v1/",_IS_DEV:false,_app_id:null,_tagsToSendOnRegister:null,_notificationOpened_callback:null,_idsAvailable_callback:[],_defaultLaunchURL:null,_initOptions:null,_httpRegistration:false,_main_page_port:null,_isNotificationEnabledCallback:null,_subscriptionSet:true,_initOneSignalHttp:null,_sessionIframeAdded:false,_useHttpMode:null,_windowWidth:550,_windowHeight:480,LOGGING:false,LOGGING_VERBOSE:false,LOGGING_TRACING:false,SERVICE_WORKER_UPDATER_PATH:"OneSignalSDKUpdaterWorker.js",SERVICE_WORKER_PATH:"OneSignalSDKWorker.js",SERVICE_WORKER_PARAM:{},_debug:function(){if(OneSignal.LOGGING){if(OneSignal.LOGGING_VERBOSE){console["log"].apply(console,arguments)
  if(OneSignal.LOGGING_TRACING){console["trace"].apply(console,[" "])}}}},_log:function(){if(OneSignal.LOGGING){console["log"].apply(console,arguments)
  if(OneSignal.LOGGING_TRACING){console["trace"].apply(console,[" "])}}},_info:function(){if(OneSignal.LOGGING){console["info"].apply(console,arguments)
  if(OneSignal.LOGGING_TRACING){console["trace"].apply(console,[" "])}}},_warn:function(){console["warn"].apply(console,arguments)
  if(OneSignal.LOGGING_TRACING){console["trace"].apply(console,[" "])}},_error:function(){console["error"].apply(console,arguments)
  if(OneSignal.LOGGING_TRACING){console["trace"].apply(console,[" "])}},_ensureDbInstance:function(){return new Promise(function(e,n){if(OneSignal._oneSignal_db){e(OneSignal._oneSignal_db)}else{var i=indexedDB.open("ONE_SIGNAL_SDK_DB",1)
  i.onsuccess=function(n){var i=n.target.result
    OneSignal._oneSignal_db=i
    OneSignal._debug("Succesfully opened IndexedDB.")
    e(i)}
  i.onerror=function(e){OneSignal._error("Unable to open IndexedDB.",e)
    n(e)}
  i.onupgradeneeded=function(e){OneSignal._log("Recreating schema in IndexedDB...")
    var n=e.target.result
    n.createObjectStore("Ids",{keyPath:"type"})
    n.createObjectStore("NotificationOpened",{keyPath:"url"})
    n.createObjectStore("Options",{keyPath:"key"})}}})},_getDbValue:function(e,n){return new Promise(function(i,t){OneSignal._ensureDbInstance().then(function(a){var o=a.transaction(e).objectStore(e).get(n)
  o.onsuccess=function(e){if(o.result)OneSignal._triggerEvent_dbValueRetrieved(o.result)
    i(o.result)}
  o.onerror=function(e){t(o.errorCode)}}).catch(function(e){OneSignal._error(e.stack)})})},_getDbValues:function(e){return new Promise(function(n,i){OneSignal._ensureDbInstance().then(function(t){var a={}
  var o=t.transaction(e).objectStore(e).openCursor()
  o.onsuccess=function(e){var i=e.target.result
    if(i){OneSignal._triggerEvent_dbValueRetrieved(i)
      a[i.key]=i.value.value
      i.continue()}else n(a)}
  o.onerror=function(e){i(o.errorCode)}}).catch(function(e){OneSignal._error(e.stack)})})},_putDbValue:function(e,n){return new Promise(function(i,t){OneSignal._ensureDbInstance().then(function(t){t.transaction([e],"readwrite").objectStore(e).put(n)
  OneSignal._triggerEvent_dbValueSet(n)
  i(n)}).catch(function(e){OneSignal._error(e.stack)})})},_deleteDbValue:function(e,n){return new Promise(function(i,t){OneSignal._ensureDbInstance().then(function(t){t.transaction([e],"readwrite").objectStore(e).delete(n)
  i(n)}).catch(function(e){OneSignal._error(e.stack)})})},_sendToOneSignalApi:function(e,n,i,t,a){var o={method:n}
  if(i){o.headers={"Content-type":"application/json;charset=UTF-8"}
    o.body=JSON.stringify(i)}fetch(OneSignal._HOST_URL+e,o).then(function r(e){if(e.status>=200&&e.status<300)return Promise.resolve(e)
  else return Promise.reject(new Error(e.statusText))}).then(function s(e){return e.json()}).then(function(e){OneSignal._log(e)
    if(t!=null)t(e)}).catch(function(e){OneSignal._error("Request failed:",e)
    if(a!=null)a()})},_getLanguage:function(){return navigator.language?navigator.language.length>3?navigator.language.substring(0,2):navigator.language:"en"},_getPlayerId:function(e,n){if(e)n(e)
else{OneSignal._getDbValue("Ids","userId").then(function i(e){if(e)n(e.id)
else n(null)}).catch(function(e){OneSignal._error(e.stack)})}},_getBrowserName:function(){if(navigator.appVersion.match(/Chrome\/(.*?) /))return"Chrome"
  if(navigator.appVersion.match("Version/(.*) (Safari)"))return"Safari"
  if(navigator.userAgent.match(/Firefox\/([0-9]{2,}\.[0-9]{1,})/))return"Firefox"
  return""},_registerWithOneSignal:function(e,n,i){OneSignal._getDbValue("Ids","userId").then(function t(a){OneSignal._getNotificationTypes(function(t){var o="players"
  var r={app_id:e,device_type:i,language:OneSignal._getLanguage(),timezone:(new Date).getTimezoneOffset()*-60,device_model:navigator.platform+" "+OneSignal._getBrowserName(),device_os:(navigator.appVersion.match(/Chrome\/(.*?) /)||navigator.appVersion.match("Version/(.*) Safari")||navigator.userAgent.match(/Firefox\/([0-9]{2,}\.[0-9]{1,})/))[1],sdk:OneSignal._VERSION}
  if(a){o="players/"+a.id+"/on_session"
    r.notification_types=t}else if(t!=1)r.notification_types=t
  if(n){r.identifier=n
    OneSignal._putDbValue("Ids",{type:"registrationId",id:n})}OneSignal._sendToOneSignalApi(o,"POST",r,function s(e){sessionStorage.setItem("ONE_SIGNAL_SESSION",true)
    if(e.id){OneSignal._putDbValue("Ids",{type:"userId",id:e.id})
      OneSignal._sendUnsentTags()}OneSignal._getPlayerId(e.id,function(e){if(OneSignal._idsAvailable_callback.length>0){while(OneSignal._idsAvailable_callback.length>0){var i=OneSignal._idsAvailable_callback.pop()
      i({userId:e,registrationId:n})}}if(OneSignal._httpRegistration){OneSignal._log("Sending player Id and registrationId back to host page")
      OneSignal._log(OneSignal._initOptions)
      var t=opener||parent
      OneSignal._safePostMessage(t,{idsAvailable:{userId:e,registrationId:n}},OneSignal._initOptions.origin,null)
      if(opener)window.close()}else OneSignal._debug("NO opener")})})})}).catch(function(e){OneSignal._error(e.stack)})},_sendUnsentTags:function(){if(OneSignal._tagsToSendOnRegister){OneSignal.sendTags(OneSignal._tagsToSendOnRegister)
  OneSignal._tagsToSendOnRegister=null}},setDefaultNotificationUrl:function(e){OneSignal._putDbValue("Options",{key:"defaultUrl",value:e})},setDefaultIcon:function(e){OneSignal._putDbValue("Options",{key:"defaultIcon",value:e})},setDefaultTitle:function(e){OneSignal._putDbValue("Options",{key:"defaultTitle",value:e})},_visibilitychange:function(){if(document.visibilityState=="visible"){document.removeEventListener("visibilitychange",OneSignal._visibilitychange)
  OneSignal._sessionInit({})}},onNativePromptChanged:function(e){OneSignal._log("Event onesignal.prompt.native.permissionchanged:",e.detail)
  OneSignal._checkTrigger_eventSubscriptionChanged()},_onSubscriptionChanged:function(e){OneSignal._log("Event onesignal.subscription.changed:",e.detail)},_onDbValueRetrieved:function(e){OneSignal._log("Event onesignal.db.retrieved:",e.detail)},_onDbValueSet:function(e){OneSignal._log("Event onesignal.db.valueset:",e.detail)
  var n=e.detail
  if(n.type==="userId"){LimitStore.put("db.ids.userId",n.id)
    OneSignal._checkTrigger_eventSubscriptionChanged()}},_onInternalSubscriptionSet:function(e){OneSignal._log("Event onesignal.internal.subscriptionset:",e.detail)
  var n=e.detail
  LimitStore.put("subscription.value",n)
  OneSignal._checkTrigger_eventSubscriptionChanged()},_checkTrigger_eventSubscriptionChanged:function(){var e=LimitStore.get("notification.permission")
  var n=e[e.length-2]
  var i=e[e.length-1]
  var t=LimitStore.get("db.ids.userId")
  var a=t[t.length-2]
  var o=t[t.length-1]
  var r=LimitStore.get("subscription.value")
  var s=r[r.length-2]
  var l=r[r.length-1]
  var g="unchanged"
  if((n==="default"||n==="denied"||n===null)&&i==="granted"&&o!==null&&l==true||s==false&&l==true&&o!=null&&i=="granted"){g=true}if(n!=="denied"&&i==="denied"||n==="granted"&&i!=="granted"||a!==null&&o===null||s!==false&&l===false){g=false}if(g!=="unchanged"){OneSignal._debug("SubscriptionChanged event fired, new state is now:",g)
    var c=LimitStore.put("event.subscriptionchanged.lastriggered",Date.now())
    var u=c[c.length-1]
    var d=c[c.length-2]
    var S=(u-d)/1e3
    var f=LimitStore.put("event.subscriptionchanged.laststates",g)
    var _=f[f.length-1]
    var O=f[f.length-2]
    var p=d!=null&&S<=1||_===O
    if(p===false){OneSignal._info("Triggering event onesignal.subscription.changed:",g)
      OneSignal._triggerEvent_subscriptionChanged(g)}else{if(S<=1)OneSignal._debug("SubscriptionChanged event fired, but because last event was fired in the last ",S," seconds, skipping event firing.")
      if(_===O)OneSignal._debug("SubscriptionChanged event fired, but because the new subscription state ("+_+") is the same as the last subscription state ("+O+"), skipping event firing.")}}else{OneSignal._debug("SubscriptionChanged event fired, but new state is unchanged, so returning.")}},init:function(e){OneSignal._initOptions=e
  if(!OneSignal.isPushNotificationsSupported()){OneSignal._warn("Your browser does not support push notifications.")
    return}if(navigator.permissions&&!(OneSignal._isBrowserFirefox()&&OneSignal._getFirefoxVersion()<=45)){OneSignal._info("Using browser's native permission onChange() to hook permission change event.")
    OneSignal._usingNativePermissionHook=true
    var n=OneSignal._getNotificationPermission()
    LimitStore.put("notification.permission",n)
    navigator.permissions.query({name:"notifications"}).then(function(e){e.onchange=function(){var e=LimitStore.put("notification.permission",this.state)
      var n=e[0]
      var i=e[1]
      OneSignal._triggerEvent_nativePromptPermissionChanged(n,i)}}).catch(function(e){OneSignal._error(e.stack)})}else{var n=OneSignal._getNotificationPermission()
    LimitStore.put("notification.permission",n)}OneSignal._getDbValue("Ids","userId").then(function(e){var n=e?e.id:null
    LimitStore.put("db.ids.userId",n)})
  OneSignal._getSubscription(function(e){LimitStore.put("subscription.value",e)})
  window.addEventListener("onesignal.prompt.native.permissionchanged",OneSignal.onNativePromptChanged)
  window.addEventListener("onesignal.subscription.changed",OneSignal._onSubscriptionChanged)
  window.addEventListener("onesignal.db.valueretrieved",OneSignal._onDbValueRetrieved)
  window.addEventListener("onesignal.db.valueset",OneSignal._onDbValueSet)
  window.addEventListener("onesignal.db.valueset",OneSignal._onDbValueSet)
  window.addEventListener("onesignal.internal.subscriptionset",OneSignal._onInternalSubscriptionSet)
  OneSignal._useHttpMode=!OneSignal._isSupportedSafari()&&(!OneSignal._supportsDirectPermission()||OneSignal._initOptions.subdomainName)
  if(OneSignal._useHttpMode)OneSignal._initOneSignalHttp="https://"+OneSignal._initOptions.subdomainName+".onesignal.com/sdks/initOneSignalHttp"
  else OneSignal._initOneSignalHttp="https://onesignal.com/sdks/initOneSignalHttps"
  if(OneSignal._IS_DEV)OneSignal._initOneSignalHttp="https://192.168.1.206:3000/dev_sdks/initOneSignalHttp"
  if(OneSignal._isSupportedSafari()&&typeof window.fetch=="undefined"){var i=document.createElement("script")
    i.setAttribute("src","https://cdnjs.cloudflare.com/ajax/libs/fetch/0.9.0/fetch.js")
    document.head.appendChild(i)}if(document.readyState==="complete")OneSignal._internalInit()
  else window.addEventListener("load",OneSignal._internalInit)},_internalInit:function(){Promise.all([OneSignal._getDbValue("Ids","appId"),OneSignal._getDbValue("Ids","registrationId"),OneSignal._getDbValue("Options","subscription")]).then(function e(n){var i=n[0]
  var t=n[1]
  var a=n[2]
  if(i&&i.id!=OneSignal._initOptions.appId){OneSignal._deleteDbValue("Ids","userId")
    sessionStorage.removeItem("ONE_SIGNAL_SESSION")}if(sessionStorage.getItem("ONE_SIGNAL_SESSION")&&!OneSignal._initOptions.subdomainName&&(Notification.permission=="denied"||sessionStorage.getItem("ONE_SIGNAL_NOTIFICATION_PERMISSION")==Notification.permission))return
  sessionStorage.setItem("ONE_SIGNAL_NOTIFICATION_PERMISSION",Notification.permission)
  if(OneSignal._initOptions.autoRegister==false&&!t&&OneSignal._initOptions.subdomainName==null)return
  if(document.visibilityState!="visible"){document.addEventListener("visibilitychange",OneSignal._visibilitychange)
    return}OneSignal._sessionInit({})}).catch(function(e){OneSignal._error(e.stack)})},registerForPushNotifications:function(e){if(!e)e={}
  e.fromRegisterFor=true
  OneSignal._sessionInit(e)},_initHttp:function(e){OneSignal._initOptions=e
  if(e.continuePressed){OneSignal.setSubscription(true)}var n=parent!=null&&parent!=window
  var i=opener||parent
  if(!i){OneSignal._log("ERROR:_initHttp: No opener or parent found!")
    return}var t=new MessageChannel
  t.port1.onmessage=function(e){OneSignal._log("_initHttp.messageChannel.port1.onmessage",e)
    if(e.data.initOptions){OneSignal.setDefaultNotificationUrl(e.data.initOptions.defaultUrl)
      OneSignal.setDefaultTitle(e.data.initOptions.defaultTitle)
      if(e.data.initOptions.defaultIcon)OneSignal.setDefaultIcon(e.data.initOptions.defaultIcon)
      OneSignal._log("document.URL",e.data.initOptions.parent_url)
      OneSignal._getDbValue("NotificationOpened",e.data.initOptions.parent_url).then(function n(t){OneSignal._log("_initHttp NotificationOpened db",t)
        if(t){OneSignal._deleteDbValue("NotificationOpened",e.data.initOptions.parent_url)
          OneSignal._log("OneSignal._safePostMessage:targetOrigin:",OneSignal._initOptions.origin)
          OneSignal._safePostMessage(i,{openedNotification:t.data},OneSignal._initOptions.origin,null)}}).catch(function(e){OneSignal._error(e.stack)})}else if(e.data.getNotificationPermission){OneSignal._getSubdomainState(function(e){OneSignal._safePostMessage(i,{currentNotificationPermission:e},OneSignal._initOptions.origin,null)})}else if(e.data.setSubdomainState)OneSignal.setSubscription(e.data.setSubdomainState.setSubscription)}
  OneSignal._getSubdomainState(function(e){e["isIframe"]=n
    OneSignal._safePostMessage(i,{oneSignalInitPageReady:e},OneSignal._initOptions.origin,[t.port2])})
  OneSignal._initSaveState()
  OneSignal._httpRegistration=true
  if(location.search.indexOf("?session=true")==0)return
  OneSignal._getPlayerId(null,function(e){if(!n||e){OneSignal._log("Before navigator.serviceWorker.register")
    navigator.serviceWorker.register(OneSignal.SERVICE_WORKER_PATH,OneSignal.SERVICE_WORKER_PARAM).then(OneSignal._enableNotifications,OneSignal._registerError)
    OneSignal._log("After navigator.serviceWorker.register")}})},_getSubdomainState:function(e){var n={}
  Promise.all([OneSignal._getDbValue("Ids","userId"),OneSignal._getDbValue("Ids","registrationId"),OneSignal._getDbValue("Options","subscription")]).then(function i(n){var i=n[0]
    var t=n[1]
    var a=n[2]
    e({userId:i?i.id:null,registrationId:t?t.id:null,notifPermssion:Notification.permission,subscriptionSet:a?a.value:null,isPushEnabled:Notification.permission=="granted"&&i&&t&&(a&&a.value||a==null)})}).catch(function(e){OneSignal._error(e.stack)})},_initSaveState:function(){OneSignal._app_id=OneSignal._initOptions.appId
  OneSignal._putDbValue("Ids",{type:"appId",id:OneSignal._app_id})
  OneSignal._putDbValue("Options",{key:"pageTitle",value:document.title})},_supportsDirectPermission:function(){return OneSignal._isSupportedSafari()||location.protocol=="https:"||location.host.indexOf("localhost")==0||location.host.indexOf("127.0.0.1")==0},_sessionInit:function(e){OneSignal._log("_sessionInit:",e)
  OneSignal._initSaveState()
  var n=location.origin.match(/^http(s|):\/\/(www\.|)/)[0]
  if(OneSignal._useHttpMode){if(e.fromRegisterFor){var i=window.screenLeft!=undefined?window.screenLeft:screen.left
    var t=window.screenTop!=undefined?window.screenTop:screen.top
    var a=window.innerWidth?window.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width
    var o=window.innerHeight?window.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height
    var r=OneSignal._windowWidth
    var s=OneSignal._windowHeight
    var l=a/2-r/2+i
    var g=o/2-s/2+t
    OneSignal._log("Opening popup window.")
    var c=OneSignal._initOptions["promptOptions"]
    var u=""
    if(c){var d=["actionMessage","exampleNotificationTitleDesktop","exampleNotificationMessageDesktop","exampleNotificationTitleMobile","exampleNotificationMessageMobile","exampleNotificationCaption","acceptButtonText","cancelButtonText"]
      for(var S=0;S<d.length;S++){var f=d[S]
        var _=c[f]
        var O=encodeURIComponent(_)
        if(_||_===""){u+="&"+f+"="+O}}}var p=window.open(OneSignal._initOneSignalHttp+"?"+u+"&hostPageProtocol="+n,"_blank","scrollbars=yes, width="+r+", height="+s+", top="+g+", left="+l)
    if(p)p.focus()}else{OneSignal._log("Opening iFrame.")
    OneSignal._addSessionIframe(n)}return}if(OneSignal._isSupportedSafari()){if(OneSignal._initOptions.safari_web_id){var v=OneSignal._getNotificationPermission(OneSignal._initOptions.safari_web_id)
    window.safari.pushNotification.requestPermission(OneSignal._HOST_URL+"safari",OneSignal._initOptions.safari_web_id,{app_id:OneSignal._app_id},function(e){OneSignal._log(e)
      var n=OneSignal._getNotificationPermission(OneSignal._initOptions.safari_web_id)
      if(e.deviceToken){OneSignal._registerWithOneSignal(OneSignal._app_id,e.deviceToken.toLowerCase(),7)}else{sessionStorage.setItem("ONE_SIGNAL_SESSION",true)}OneSignal._triggerEvent_nativePromptPermissionChanged(v)})}}else if(e.modalPrompt&&e.fromRegisterFor){if(!OneSignal.isPushNotificationsSupported()){OneSignal._warn("An attempt was made to open the HTTPS modal permission prompt, but push notifications are not supported on this browser. Opening canceled.")
    return}OneSignal.isPushNotificationsEnabled(function(e){var i=document.createElement("div")
    i.setAttribute("id","OneSignal-iframe-modal")
    i.innerHTML='<div id="notif-permission" style="background: rgba(0, 0, 0, 0.7); position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9000; display: block"></div>'
    document.body.appendChild(i)
    var t=document.createElement("style")
    t.innerHTML="@media (max-width: 560px) { .OneSignal-permission-iframe { width: 100%; height: 100%;} }"+"@media (min-width: 561px) { .OneSignal-permission-iframe { top: 50%; left: 50%; margin-left: -275px; margin-top: -248px;} }"
    document.getElementsByTagName("head")[0].appendChild(t)
    var a=document.createElement("iframe")
    a.className="OneSignal-permission-iframe"
    a.style.cssText="background: rgba(255, 255, 255, 1); position: fixed;"
    a.src=OneSignal._initOneSignalHttp+"?id="+OneSignal._app_id+"&httpsPrompt=true"+"&pushEnabled="+e+"&permissionBlocked="+(typeof Notification==="undefined"||Notification.permission=="denied")+"&hostPageProtocol="+n
    a.setAttribute("frameborder","0")
    a.width=OneSignal._windowWidth.toString()
    a.height=OneSignal._windowHeight.toString()
    OneSignal._log("Opening HTTPS modal prompt.")
    document.getElementById("notif-permission").appendChild(a)})}else if("serviceWorker"in navigator)OneSignal._registerForW3CPush(e)
  else OneSignal._log("Service workers are not supported in this browser.")},_registerForW3CPush:function(e){OneSignal._getDbValue("Ids","registrationId").then(function n(i){if(!i||!e.fromRegisterFor||Notification.permission!="granted"){navigator.serviceWorker.getRegistration().then(function(e){var n=""
  if(OneSignal._initOptions.path)n=OneSignal._initOptions.path
  if(typeof e==="undefined")navigator.serviceWorker.register(n+OneSignal.SERVICE_WORKER_PATH,OneSignal.SERVICE_WORKER_PARAM).then(OneSignal._enableNotifications,OneSignal._registerError)
  else{if(e.active){if(e.active.scriptURL.indexOf(n+OneSignal.SERVICE_WORKER_PATH)>-1){OneSignal._getDbValue("Ids","WORKER1_ONE_SIGNAL_SW_VERSION").then(function(i){if(i){if(i.id!=OneSignal._VERSION){e.unregister().then(function(){navigator.serviceWorker.register(n+OneSignal.SERVICE_WORKER_UPDATER_PATH,OneSignal.SERVICE_WORKER_PARAM).then(OneSignal._enableNotifications,OneSignal._registerError)}).catch(function(e){OneSignal._error(e.stack)})}else navigator.serviceWorker.register(n+OneSignal.SERVICE_WORKER_PATH,OneSignal.SERVICE_WORKER_PARAM).then(OneSignal._enableNotifications,OneSignal._registerError)}else navigator.serviceWorker.register(n+OneSignal.SERVICE_WORKER_PATH,OneSignal.SERVICE_WORKER_PARAM).then(OneSignal._enableNotifications,OneSignal._registerError)}).catch(function(e){OneSignal._error(e.stack)})}else if(e.active.scriptURL.indexOf(n+OneSignal.SERVICE_WORKER_UPDATER_PATH)>-1){OneSignal._getDbValue("Ids","WORKER1_ONE_SIGNAL_SW_VERSION").then(function(i){if(i){if(i.id!=OneSignal._VERSION){e.unregister().then(function(){navigator.serviceWorker.register(n+OneSignal.SERVICE_WORKER_PATH,OneSignal.SERVICE_WORKER_PARAM).then(OneSignal._enableNotifications,OneSignal._registerError)})}else navigator.serviceWorker.register(n+OneSignal.SERVICE_WORKER_UPDATER_PATH,OneSignal.SERVICE_WORKER_PARAM).then(OneSignal._enableNotifications,OneSignal._registerError)}else navigator.serviceWorker.register(n+OneSignal.SERVICE_WORKER_UPDATER_PATH,OneSignal.SERVICE_WORKER_PARAM).then(OneSignal._enableNotifications,OneSignal._registerError)}).catch(function(e){OneSignal._error(e.stack)})}}else if(e.installing==null)navigator.serviceWorker.register(n+OneSignal.SERVICE_WORKER_PATH,OneSignal.SERVICE_WORKER_PARAM).then(OneSignal._enableNotifications,OneSignal._registerError)}}).catch(function(e){OneSignal._error(e.stack)})}}).catch(function(e){OneSignal._error(e.stack)})},_addSessionIframe:function(e){var n=document.createElement("iframe")
  n.style.display="none"
  n.src=OneSignal._initOneSignalHttp+"Iframe"
  if(sessionStorage.getItem("ONE_SIGNAL_SESSION"))n.src+="?session=true"+"&hostPageProtocol="+e
  else n.src+="?hostPageProtocol="+e
  document.body.appendChild(n)
  OneSignal._log("Adding session iFrame.")
  OneSignal._sessionIframeAdded=true},_registerError:function(e){OneSignal._log("navigator.serviceWorker.register:ERROR: "+e)},_enableNotifications:function(e){OneSignal._log("_enableNotifications: ",e)
  if(!("PushManager"in window)){OneSignal._log("Push messaging is not supported. No PushManager.")
    sessionStorage.setItem("ONE_SIGNAL_SESSION",true)
    return}if(!("showNotification"in ServiceWorkerRegistration.prototype)){OneSignal._log("Notifications are not supported. showNotification not available in ServiceWorkerRegistration.")
    sessionStorage.setItem("ONE_SIGNAL_SESSION",true)
    return}if(Notification.permission==="denied"){OneSignal._warn("The user has disabled notifications.")
    return}navigator.serviceWorker.ready.then(function(e){OneSignal._log(e)
    OneSignal._subscribeForPush(e)}).catch(function(e){OneSignal._error(e.stack)})},_getNotificationPermission:function(e){if(window.safari){if(e){return window.safari.pushNotification.permission(e).permission}else{return"default"}}else{return Notification.permission}},_triggerEvent:function(e,n){if(typeof window==="undefined"){OneSignal._debug("Skipping triggering of event:",e,"because we are running in a ServiceWorker context.")
  return}var i=new CustomEvent(e,{bubbles:true,cancelable:true,details:n})
  window.dispatchEvent(i)},_triggerEvent_customPromptClicked:function(e){OneSignal._triggerEvent("onesignal.prompt.custom.clicked",{result:e})},_triggerEvent_nativePromptPermissionChanged:function(e,n){if(n===undefined){n=OneSignal._getNotificationPermission(OneSignal._initOptions.safari_web_id)}if(e!==n){OneSignal._triggerEvent("onesignal.prompt.native.permissionchanged",{from:e,to:n})}},_triggerEvent_subscriptionChanged:function(e){OneSignal._triggerEvent("onesignal.subscription.changed",e)},_triggerEvent_dbValueRetrieved:function(e){OneSignal._triggerEvent("onesignal.db.valueretrieved",e)},_triggerEvent_dbValueSet:function(e){OneSignal._triggerEvent("onesignal.db.valueset",e)},_triggerEvent_internalSubscriptionSet:function(e){OneSignal._triggerEvent("onesignal.internal.subscriptionset",e)},_subscribeForPush:function(e){OneSignal._log("_subscribeForPush:","navigator.serviceWorker.ready.then")
  var n=OneSignal._getNotificationPermission(OneSignal._initOptions.safari_web_id)
  e.pushManager.subscribe({userVisibleOnly:true}).then(function(e){sessionStorage.setItem("ONE_SIGNAL_NOTIFICATION_PERMISSION",Notification.permission)
    OneSignal._getDbValue("Ids","appId").then(function i(t){appId=t.id
      OneSignal._debug("serviceWorkerRegistration.pushManager.subscribe()")
      var a=null
      if(e){if(typeof e.subscriptionId!="undefined")a=e.subscriptionId
      else a=e.endpoint.replace(new RegExp("^(https://android.googleapis.com/gcm/send/|https://updates.push.services.mozilla.com/push/)"),"")
        OneSignal._debug("registration id is:"+a)}else OneSignal._log("Error could not subscribe your browser for push!")
      OneSignal._registerWithOneSignal(appId,a,OneSignal._isSupportedFireFox()?8:5)
      if(!OneSignal._usingNativePermissionHook)OneSignal._triggerEvent_nativePromptPermissionChanged(n)}).catch(function(e){OneSignal._error(e.stack)})}).catch(function(e){OneSignal._error("Error during subscribe():",e)
    if(!OneSignal._usingNativePermissionHook)OneSignal._triggerEvent_nativePromptPermissionChanged(n)
    if(e.code==20&&opener&&OneSignal._httpRegistration)window.close()})},sendTag:function(e,n){jsonKeyValue={}
  jsonKeyValue[e]=n
  OneSignal.sendTags(jsonKeyValue)},sendTags:function(e){OneSignal._getDbValue("Ids","userId").then(function n(i){if(i)OneSignal._sendToOneSignalApi("players/"+i.id,"PUT",{app_id:OneSignal._app_id,tags:e})
else{if(OneSignal._tagsToSendOnRegister==null)OneSignal._tagsToSendOnRegister=e
else{var t={}
  for(var a in OneSignal._tagsToSendOnRegister)t[a]=OneSignal._tagsToSendOnRegister[a]
  for(var a in e)t[a]=e[a]
  OneSignal._tagsToSendOnRegister=t}}}).catch(function(e){OneSignal._error("sendTags:",e)})},deleteTag:function(e){OneSignal.deleteTags([e])},deleteTags:function(e){var n={}
  var i=e.length
  for(var t=0;t<i;t++)n[e[t]]=""
  OneSignal.sendTags(n)},_handleNotificationOpened:function(e){var n=JSON.parse(e.notification.tag)
  e.notification.close()
  Promise.all([OneSignal._getDbValue("Ids","appId"),OneSignal._getDbValue("Ids","userId")]).then(function i(e){var i=e[0]
    var t=e[1]
    if(i&&t){OneSignal._sendToOneSignalApi("notifications/"+n.id,"PUT",{app_id:i.id,player_id:t.id,opened:true})}}).catch(function(e){OneSignal._error(e.stack)})
  e.waitUntil(clients.matchAll({type:"window"}).then(function(e){var i=registration.scope
    if(OneSignal._defaultLaunchURL)i=OneSignal._defaultLaunchURL
    if(n.launchURL)i=n.launchURL
    for(var t=0;t<e.length;t++){var a=e[t]
      if("focus"in a&&a.url==i){a.focus()
        a.postMessage(n)
        return}}OneSignal._putDbValue("NotificationOpened",{url:i,data:n})
    clients.openWindow(i).catch(function(e){clients.openWindow(registration.scope+"redirector.html?url="+i)})}).catch(function(e){OneSignal._error(e.stack)}))},_getTitle:function(e,n){if(e!=null){n(e)
  return}Promise.all([OneSignal._getDbValue("Options","defaultTitle"),OneSignal._getDbValue("Options","pageTitle")]).then(function i(e){var i=e[0]
  var t=e[1]
  if(i){n(i.value)
    return}else if(t&&t.value!=null){n(t.value)
    return}else{n("")}}).catch(function(e){OneSignal._error(e.stack)})},_handleGCMMessage:function(e,n){if(n.data&&n.data.text()[0]=="{"){OneSignal._log("Received data.text: ",n.data.text())
  OneSignal._log("Received data.json: ",n.data.json())}n.waitUntil(new Promise(function(n,i){OneSignal._getTitle(null,function(i){OneSignal._getDbValue("Options","defaultIcon").then(function t(a){OneSignal._getLastNotifications(function(t,o){var r={id:t.custom.i,message:t.alert,additionalData:t.custom.a}
  if(t.title)r.title=t.title
  else r.title=i
  if(t.custom.u)r.launchURL=t.custom.u
  if(t.icon)r.icon=t.icon
  else if(a)r.icon=a.value
  e.registration.showNotification(r.title,{body:t.alert,icon:r.icon,tag:JSON.stringify(r)}).then(n).catch(function(e){OneSignal._error(e.stack)})
  OneSignal._getDbValue("Options","defaultUrl").then(function(e){if(e)OneSignal._defaultLaunchURL=e.value}).catch(function(e){OneSignal._error(e.stack)})},n)}).catch(function(e){OneSignal._error(e.stack)})})}))},_getLastNotifications:function(e,n){OneSignal._getDbValue("Ids","userId").then(function i(t){if(t){OneSignal._sendToOneSignalApi("players/"+t.id+"/chromeweb_notification","GET",null,function(n){for(var i=0;i<n.length;i++)e(JSON.parse(n[i]))},function(){n()})}else{OneSignal._log("Error: could not get notificationId")
  n()}}).catch(function(e){OneSignal._error(e.stack)})},_listener_receiveMessage:function e(n){OneSignal._log("_listener_receiveMessage: ",n)
  if(OneSignal._initOptions==undefined)return
  if(!OneSignal._IS_DEV&&n.origin!==""&&n.origin!=="https://onesignal.com"&&n.origin!=="https://"+OneSignal._initOptions.subdomainName+".onesignal.com")return
  if(n.data.oneSignalInitPageReady){OneSignal._getDbValues("Options").then(function t(e){OneSignal._log("current options",e)
    if(!e.defaultUrl)e.defaultUrl=document.URL
    if(!e.defaultTitle)e.defaultTitle=document.title
    e.parent_url=document.URL
    OneSignal._log("Posting message to port[0]",n.ports[0])
    n.ports[0].postMessage({initOptions:e})}).catch(function(e){OneSignal._error("_listener_receiveMessage:",e)})
    var i=n.data.oneSignalInitPageReady
    if(i.isIframe)OneSignal._iframePort=n.ports[0]
    if(i.userId)OneSignal._putDbValue("Ids",{type:"userId",id:i.userId})
    if(i.registrationId)OneSignal._putDbValue("Ids",{type:"registrationId",id:i.registrationId})
    OneSignal._fireNotificationEnabledCallback(i.isPushEnabled)
    OneSignal._sendUnsentTags()}else if(n.data.currentNotificationPermission)OneSignal._fireNotificationEnabledCallback(n.data.currentNotificationPermission.isPushEnabled)
  else if(n.data.idsAvailable){sessionStorage.setItem("ONE_SIGNAL_SESSION",true)
    OneSignal._putDbValue("Ids",{type:"userId",id:n.data.idsAvailable.userId})
    OneSignal._putDbValue("Ids",{type:"registrationId",id:n.data.idsAvailable.registrationId})
    if(OneSignal._idsAvailable_callback.length>0){while(OneSignal._idsAvailable_callback.length>0){curr_callback=OneSignal._idsAvailable_callback.pop()
      curr_callback({userId:n.data.idsAvailable.userId,registrationId:n.data.idsAvailable.registrationId})}}OneSignal._sendUnsentTags()}else if(n.data.httpsPromptAccepted){OneSignal.registerForPushNotifications()
    OneSignal.setSubscription(true);(elem=document.getElementById("OneSignal-iframe-modal")).parentNode.removeChild(elem)
    OneSignal._triggerEvent_customPromptClicked("granted")}else if(n.data.httpsPromptCanceled){(elem=document.getElementById("OneSignal-iframe-modal")).parentNode.removeChild(elem)
    OneSignal._triggerEvent_customPromptClicked("denied")}else if(n.data.httpPromptAccepted){OneSignal._triggerEvent_customPromptClicked("granted")}else if(n.data.httpPromptCanceled){OneSignal._triggerEvent_customPromptClicked("denied")}else if(OneSignal._notificationOpened_callback)OneSignal._notificationOpened_callback(n.data)},addListenerForNotificationOpened:function(e){OneSignal._notificationOpened_callback=e
  if(window){OneSignal._getDbValue("NotificationOpened",document.URL).then(function(e){if(e){OneSignal._deleteDbValue("NotificationOpened",document.URL)
    OneSignal._notificationOpened_callback(e.data)}}).catch(function(e){OneSignal._error(e.stack)})}},_fireNotificationEnabledCallback:function(e){if(OneSignal._isNotificationEnabledCallback){OneSignal._isNotificationEnabledCallback(e)
  OneSignal._isNotificationEnabledCallback=null}},getIdsAvailable:function(e){if(e===undefined)return
  OneSignal._idsAvailable_callback.push(e)
  Promise.all([OneSignal._getDbValue("Ids","userId"),OneSignal._getDbValue("Ids","registrationId")]).then(function n(e){var n=e[0]
    var i=e[1]
    if(n){if(i){while(OneSignal._idsAvailable_callback.length>0){var t=OneSignal._idsAvailable_callback.pop()
      t({userId:n.id,registrationId:i.id})}}else while(OneSignal._idsAvailable_callback.length>0){var t=OneSignal._idsAvailable_callback.pop()
      t({userId:n.id,registrationId:null})}}}).catch(function(e){OneSignal._error(e.stack)})},getTags:function(e){OneSignal._getDbValue("Ids","userId").then(function(n){if(n){OneSignal._sendToOneSignalApi("players/"+n.id,"GET",null,function(n){e(n.tags)})}}).catch(function(e){OneSignal._error(e.stack)})},isPushNotificationsEnabled:function(e){if(OneSignal._initOptions.subdomainName&&!OneSignal._isBrowserSafari()){OneSignal._isNotificationEnabledCallback=e
  if(OneSignal._iframePort)OneSignal._iframePort.postMessage({getNotificationPermission:true})
  return}Promise.all([OneSignal._getDbValue("Ids","registrationId"),OneSignal._getDbValue("Options","subscription")]).then(function(n){var i=n[0]
  var t=n[1]
  if(i){if(t&&!t.value)return e(false)
    e(Notification.permission=="granted")}else e(false)}).catch(function(e){OneSignal._error(e.stack)})},_isSupportedSafari:function(){var e=navigator.appVersion.match("Version/([0-9]?).* Safari")
  if(e==null)return false
  if(/iPhone|iPad|iPod/i.test(navigator.userAgent))return false
  return parseInt(e[1])>6},_isBrowserSafari:function(){var e=navigator.appVersion.match("Version/([0-9]?).* Safari")
  return e!=null},_isSupportedFireFox:function(){var e=navigator.userAgent.match(/(Firefox\/)([0-9]{2,}\.[0-9]{1,})/)
  if(e)return parseInt(e[2].substring(0,2))>43
  return false},_isBrowserFirefox:function(){var e=navigator.userAgent.match(/(Firefox\/)([0-9]{2,}\.[0-9]{1,})/)
  return e!=null},_getFirefoxVersion:function(){var e=navigator.userAgent.match(/(Firefox\/)([0-9]{2,}\.[0-9]{1,})/)
  if(e)return parseInt(e[2].substring(0,2))
  else return-1},isPushNotificationsSupported:function(){if(OneSignal._isSupportedFireFox())return true
  if(OneSignal._isSupportedSafari())return true
  var e=navigator.appVersion.match(/Chrome\/(.*?) /)
  if(!e)return false
  if(navigator.appVersion.match(/Edge/))return false
  if(navigator.appVersion.match(/ wv/))return false
  if(navigator.appVersion.match(/OPR\//))return false
  if(/iPad|iPhone|iPod/.test(navigator.platform))return false
  return parseInt(e[1].substring(0,2))>41},_getNotificationTypes:function(e){OneSignal._getSubscription(function(n){e(n?1:-2)})},setSubscription:function(e){if(OneSignal._iframePort)OneSignal._iframePort.postMessage({setSubdomainState:{setSubscription:e}})
else{OneSignal._getSubscription(function(n){if(n!=e){OneSignal._putDbValue("Options",{key:"subscription",value:e})
  OneSignal._getDbValue("Ids","userId").then(function(n){if(n)OneSignal._sendToOneSignalApi("players/"+n.id,"PUT",{app_id:OneSignal._app_id,notification_types:e?1:-2},function i(){OneSignal._triggerEvent_internalSubscriptionSet(e)})}).catch(function(e){OneSignal._error(e.stack)})}})}},_getSubscription:function(e){OneSignal._getDbValue("Options","subscription").then(function(n){e(!(n&&n.value==false))}).catch(function(e){OneSignal._error(e.stack)})},_safePostMessage:function(e,n,i,t){var a=i.toLowerCase()
  if(a.startsWith("http://")){var o={}
    location.search.substr(1).split("&").forEach(function(e){o[e.split("=")[0]]=e.split("=")[1]})
    var r=/^http(s|):\/\/(www\.|)/
    a=a.replace(r,o["hostPageProtocol"])}if(t)e.postMessage(n,a,t)
  else e.postMessage(n,a)},_process_pushes:function(e){for(var n=0;n<e.length;n++)OneSignal.push(e[n])},push:function(e){if(typeof e=="function")e()
else{var n=e.shift()
  OneSignal[n].apply(null,e)}}}
if(OneSignal._IS_DEV){OneSignal.LOGGING=true
  OneSignal._HOST_URL="https://192.168.1.206:3000/api/v1/"}if(typeof window!=="undefined")window.addEventListener("message",OneSignal._listener_receiveMessage,false)
else{importScripts("https://cdn.onesignal.com/sdks/serviceworker-cache-polyfill.js")
  self.addEventListener("push",function(e){OneSignal._handleGCMMessage(self,e)})
  self.addEventListener("notificationclick",function(e){OneSignal._handleNotificationOpened(e)})
  var isSWonSubdomain=location.href.match(/https\:\/\/.*\.onesignal.com\/sdks\//)!=null
  if(OneSignal._IS_DEV)isSWonSubdomain=true
  self.addEventListener("install",function(e){OneSignal._log("OneSignal Installed service worker: "+OneSignal._VERSION)
    if(self.location.pathname.indexOf("OneSignalSDKWorker.js")>-1)OneSignal._putDbValue("Ids",{type:"WORKER1_ONE_SIGNAL_SW_VERSION",id:OneSignal._VERSION})
    else OneSignal._putDbValue("Ids",{type:"WORKER2_ONE_SIGNAL_SW_VERSION",id:OneSignal._VERSION})
    if(isSWonSubdomain){e.waitUntil(caches.open("OneSignal_"+OneSignal._VERSION).then(function(e){return e.addAll(["/sdks/initOneSignalHttpIframe","/sdks/initOneSignalHttpIframe?session=*","/sdks/manifest_json"])}).catch(function(e){OneSignal._error(e.stack)}))}})
  if(isSWonSubdomain){self.addEventListener("fetch",function(e){e.respondWith(caches.match(e.request).then(function(n){if(n)return n
    return fetch(e.request)}).catch(function(e){OneSignal._error(e.stack)}))})}}if(_temp_OneSignal)OneSignal._process_pushes(_temp_OneSignal)
