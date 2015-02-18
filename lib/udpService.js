const { Cc, Cu, Ci, ChromeWorker } = require('chrome');
var self = require('sdk/self');
Cu.import("resource://gre/modules/ctypes.jsm");
Cu.import("resource://gre/modules/Services.jsm");

function getDLL () {
    var nativeUrl = '';
    nativeUrl = self.data.url(ctypes.libraryName("updClient"));
    nativeUrl = Services.io.newURI(nativeUrl,null,null).QueryInterface(Ci.nsIFileURL).file.path;
    return nativeUrl;
}

function openSocket () {
    console.log('Socket Started...\n');
    var worker = new ChromeWorker(self.data.url("worker.js"));
    worker.onmessage = function(e) {
        console.log(e.data);
    };
    worker.postMessage(getDLL());
}

function closeSocket() {
    var dllLib = ctypes.open(getDLL());
    var stopSoc = dllLib.declare('closeSocket', ctypes.default_abi, ctypes.void_t);
    stopSoc();
    console.log('Socket closed...\n');
}

exports.openSocket = openSocket;
exports.closeSocket = closeSocket;