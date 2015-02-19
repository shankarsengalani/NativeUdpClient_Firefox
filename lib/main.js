/*
* The execution of Addon starts at this point.
* Extension communicate with the Native C++ code using js-ctypes to perform file and network operation.
* On running the application you could find a Maidsafe button on the Firefox toolbar.
* On clicking the Maidsafe Button, UDP socket operation initiated from the native code (C++) and prints the
* received packets data on the console and writes a log file.
* UDP client sends and receive the packets back from the UDPServer and once all the packets are received the
* client socket closes itself.
* In this application the client send 10 packet and receive 10 packed from the server, after which the client
* socket get closed.
* To shutdown the socket operation in the mid (before receiving the 10th packet) close the browser window to close the
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