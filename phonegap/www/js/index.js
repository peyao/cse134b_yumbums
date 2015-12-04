/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function(cb) {
        this.bindEvents(cb);
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function(cb) {
        //document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('deviceready', function() {
            console.log('DEVICE IS READY!');

            var notificationOpenedCallback = function(jsonData) {
                console.log('didReceiveNotificationCallback: ' + JSON.stringify(jsonData));
            };

            window.plugins.OneSignal.init("1f8dad4e-4d83-45ce-9a42-73434eee9182",
                {googleProjectNumber: "623734894206",
                 autoRegister: true},
                notificationOpenedCallback);

            window.plugins.OneSignal.registerForPushNotifications();

            // Show an alert box if a notification comes in when the user is in your app.
            window.plugins.OneSignal.enableInAppAlertNotification(true);
        }, false);
        cb();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    }
};
