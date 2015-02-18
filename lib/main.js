var windows = require("sdk/windows").browserWindows;
var buttons = require('sdk/ui/button/action');
var udpService = require("./udpService.js");

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
    udpService.openSocket();
}

windows.on('close', function(window) {
    udpService.closeSocket();
});