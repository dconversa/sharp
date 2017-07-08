
/*global  $, console*/

var app = {
    // Application Constructor
    initialize: function () {
        "use strict";
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        "use strict";
        console.log("index.js bindEvents");
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
                                  
    onDeviceReady: function () {
        "use strict";
        console.log("index.js onDeviceReady");
        document.addEventListener("backbutton", function (e) {
            if ($.mobile.pageContainer.pagecontainer("getActivePage").is("#home") &&
			         $(".ui-page-active .ui-popup-active").length === 0) {
                navigator.app.exitApp();
            } else {
				e.preventDefault();
			}
        }, false);
    }
};

app.initialize();