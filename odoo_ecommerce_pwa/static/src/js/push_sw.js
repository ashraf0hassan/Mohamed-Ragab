/* Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>) */
/* See LICENSE file for full copyright and licensing details. */
/* License URL : https://store.webkul.com/license.html/ */
importScripts('https://www.gstatic.com/firebasejs/3.7.4/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/3.7.4/firebase-messaging.js')

var baseUrl = location.origin;
fetch(baseUrl + '/pwa/sw/firebase/senderid', {mode: 'cors'})
.then(function(response) {
    response.json().then(function(data) {
        var firebaseConfig = {
            messagingSenderId: data.senderid,
        }
        firebase.initializeApp(firebaseConfig);
        var messaging = firebase.messaging();
    });
})
.catch(function(err){
    console.log('---------err-------%r',err);
});
