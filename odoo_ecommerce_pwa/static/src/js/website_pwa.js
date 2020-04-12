/* Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>) */
/* See LICENSE file for full copyright and licensing details. */
/* License URL : https://store.webkul.com/license.html/ */
odoo.define('odoo_ecommerce_pwa.website_pwa', function(require) {
    "use strict";
    var ajax = require('web.ajax');

    $(document).ready(function() {

        if(navigator.onLine){
            var online = $('.pwa_online_icon');
            var offline = $('.pwa_offline_icon');
            if(offline.is(':visible')){
                if(offline){
                    offline.hide();
                }
                online.show();
                setTimeout(function() {
                    online.hide();
                }, 1000);
            }
        }
        else{
            var offline = $('.pwa_offline_icon');
            var online = $('.pwa_online_icon');
            if(offline){
                if(online){
                    online.hide();
                }
                offline.show();
            }
        }

        // Register service worker.
        if ('serviceWorker' in navigator) {

            navigator.serviceWorker.register('/service_worker');
            ajax.jsonRpc("/pwa/firebase/senderid", 'call')
            .then(function(data){
                if(data){
                    var firebaseConfig = {
                        messagingSenderId: String(data)
                    }
                    firebase.initializeApp(firebaseConfig);
                    try{
                        var messaging = firebase.messaging();
                    } catch(error) {
                        console.log(error);
                        var messaging = false;
                    }
                    function handlePermission(permission){
                        if(!('permission' in Notification)) {
                            Notification.permission = permission;
                        }
                        if (permission === 'granted' && messaging) {
                            messaging.getToken().then( function(currentToken) {
                                if (currentToken) {
                                    ajax.jsonRpc("/pwa/user/registrations", 'call', {
                                        'token': currentToken,
                                    });
                                }
                                else {
                                    console.log('No Instance ID token available. Request permission to generate one.');
                                }
                            }).catch( function(err) {
                                console.log('An error occurred while retrieving token. ', err.message);
                            });
                        }
                        else{
                            console.log('Unable to get permission to notify.');
                        }
                    }
                    try {
                        Notification.requestPermission()
                        .then( function(permission) {
                            handlePermission(permission);
                        })
                    } catch(error) {
                        try {
                            Notification.requestPermission(function(permission) {
                                handlePermission(permission);
                            });
                        }
                        catch(error) {
                            console.log("The browser doesn't support the firebase notification.");
                        }
                    }
                    if(messaging){
                        messaging.onMessage(function(payload) {
                            var notificationTitle = payload['notification']['title']
                            var notificationOptions = payload['notification']
                            navigator.serviceWorker.ready.then(function(registration) {
                                registration.showNotification(notificationTitle, notificationOptions);
                            });
                        });
                    }
                }
            });
        }

        // Offline event to show website is in offline mode
        window.addEventListener('offline', function(event) {
            var offline = $('.pwa_offline_icon');
            var online = $('.pwa_online_icon');
            if(offline){
                if(online){
                    online.hide();
                }
                offline.show();
            }
        });

        // Online event to show website is coming back to online mode
        window.addEventListener('online', function(event) {
            var online = $('.pwa_online_icon');
            var offline = $('.pwa_offline_icon');
            if(offline.is(':visible')){
                if(offline){
                    offline.hide();
                }
                online.show();
                setTimeout(function() {
                    online.hide();
                }, 1000);
            }
        });
    });
});
