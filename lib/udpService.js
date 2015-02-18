/*
* udpService.js is a custom JavaScript module to serve upd operation from the native code.
* Js-ctypes is used for communicating with the native code.
* Chromeworker is implement to give a feel of running a process in different thread than on the main thread.
*/
const { Cc, Cu, Ci, ChromeWorker } = require('chrome');
var self = require('sdk/self');
Cu.import("resource://gre/modules/ctypes.jsm");
Cu.import("resource://gre/modules/Services.jsm");

// Get native binary file path with respect to the platform ( Win / Linus )
function getDLL () {
    var nativeUrl = '';
    nativeUrl = self.data.url(ctypes.libraryName("updClient"));
    nativeUrl = Services.io.newURI(nativeUrl,null,null).QueryInterface(Ci.nsIFileURL).file.path;
    return nativeUrl;
}

/*
* Call the Run function from the native code to start the updClient.
* With the help of chrome worker the native code is called in a new thread instead of the main thread.
* The postMessage() function sends the Binary file path to the worker file.
* When a message is send from the worker is captured by the onmessage() method and printed on the console.
*/
function openSocket () {
    console.log('Socket Started...\n');
    var worker = new ChromeWorker(self.data.url("worker.js"));
    worker.onmessage = function(e) {
        console.log("Data received: " + e.data);
    };
    worker.postMessage(getDLL());
}

/*
* closeSocket() method calls the native stop() method which intern closes the socket connection.
* This method is called when the browser window is closed.
*/
function closeSocket() {
    var dllLib = ctypes.open(getDLL());
    var stopSoc = dllLib.declare('stop', ctypes.default_abi, ctypes.void_t);
    stopSoc();
    console.log('Socket closed...\n');
}

exports.openSocket = openSocket;
exports.closeSocket = closeSocket;