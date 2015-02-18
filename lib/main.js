/*
* The execution of the Firefox Addon start from this file.
* After running the application you could find a Maidsafe button on the toolbar.
* Maidsafe Button on the toolbar on click, initiates the UDP socket operation from the native code (C++) and prints the
* received packets data on the console.
* The Native (C++) code perform file and networking operation.
* After Receiving all the packets from the UDPServer the socket get closed automatically. In this application
* the client send 10 packet and receive 10 packed from the server, after which the socket get closed.
* In the mean time a file was created in the same directory by the native code, which holds
* log messages (FileFromNative.log).
* To shutdown the socket operation in the mid (before receiving the 10th packet) close the browser window toclose the
* socket.
*/
var windows = require("sdk/windows").browserWindows;
var buttons = require('sdk/ui/button/action');
var udpService = require("./udpService.js");

// Toolbar button to initiate the overall process.
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

// onClick event of Action button, to call the openSocket method in updService
function handleClick(state) {
    udpService.openSocket();
}

// Close the socket on browser window is closed.
windows.on('close', function(window) {
    udpService.closeSocket();
});