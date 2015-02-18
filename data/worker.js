/*
* worker.js file act as a worker thread with the help of chrome worker implemented in updServer.js
* It receive the message posted from the main thread (self.onmessage method ) and start executing the native
* method 'Run'.
* The Native method is declared within the declareNativeMethod(), along with a callback function in it.
* After receiving the callback from the native method, the self.postMessage() post the data to the main thread.
*/
var nativeCallback;
try {
    // Declare native method "Run" along with a callback function (jsCallback).
    function declareNativeMethod(nativeUrl) {
        function jsCallback (data) {
            self.postMessage(data.readString());
        }
        var lib = ctypes.open(nativeUrl);
        var funcType = new ctypes.FunctionType(ctypes.default_abi, ctypes.void_t, [ctypes.char.ptr]);
        var funcPtrType = funcType.ptr;
        nativeCallback = funcPtrType(jsCallback);
        return lib.declare("Run", ctypes.default_abi, ctypes.void_t, funcPtrType, ctypes.char.ptr);
    }
} catch (ex) {
    dump("Worker Error: " + ex + "\n");
}

// Get the message from the main thread and initiate the udpClient process.
self.onmessage = function(messageFromClient) {
    try {
        var libUrl = messageFromClient.data;
        var add = declareNativeMethod(libUrl);
        add(nativeCallback, "FileFromNative.log");
    } catch (ex) {
        dump("Worker Error on Message Received: " + ex + "\n");
    }
};
