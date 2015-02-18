const { Cc, Cu, Ci, ChromeWorker } = require('chrome');
var self = require('sdk/self');
Cu.import("resource://gre/modules/ctypes.jsm");
Cu.import("resource://gre/modules/Services.jsm");
var worker = new ChromeWorker(self.data.url("worker.js"));
var dllLib;
function getDLL () {
    var nativeUrl = '';
    nativeUrl = self.data.url("js_callback.dll");
    nativeUrl = Services.io.newURI(nativeUrl,null,null).QueryInterface(Ci.nsIFileURL).file.path;
    return nativeUrl;
}

function registerDll() {
    dllLib = ctypes.open(getDLL());
}

function sampleCallback () {
    console.log();
    //return;
    worker.onmessage = function(e) {
        console.log(e.data);
    };
    worker.postMessage(getDLL());
}

function closeSocket() {
    registerDll();
    var stopSoc = dllLib.declare('closeSocket', ctypes.default_abi, ctypes.void_t);
    stopSoc();
    console.log('Socket closed');
}

exports.sampleCallback = sampleCallback;
exports.closeSocket = closeSocket;