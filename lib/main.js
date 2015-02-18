var buttons = require('sdk/ui/button/action');
var tcpService = require("./tcpService.js");
var self = require('sdk/self');
var windows = require("sdk/windows").browserWindows;

buttons.ActionButton({
    id: "mozilla-link",
    label: "Visit Mozilla",
    icon: {
        "16": "./images/icon-16.png",
        "32": "./images/icon-32.png",
        "64": "./images/icon-64.png"
    },
    onClick: handleClick
});

function handleClick(state) {
    tcpService.sampleCallback();
}

windows.on('close', function(window) {
    tcpService.closeSocket();
});