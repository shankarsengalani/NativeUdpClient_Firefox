/*
* worker.js file act as a worker thread to run the native methods on a separate thread.
* Receives message posted from the main thread (using self.onmessage method ) and initiates to call the native method.
* Native method is declared inside declareNativeMethod() method, along with a callback function in it.
* To send a callback function to the native method, it is necessary to change the JavaScript method as
* native function pointer using ctypes.FunctionType().
* After declaration, the native method is called by passing the callback and filename as the parameter to it.
* Once it receives the callback from the native method, the self.postMessage() post the data to the main thread.
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

// Get the message from the main thread and run the udpClient.
self.onmessage = function(messageFromClient) {
    try {
        var libUrl = messageFromClient.data;
        var updRun = declareNativeMethod(libUrl);
        updRun(nativeCallback, "FileFromNative.log");
    } catch (ex) {
        dump("Worker Error on Message Received: " + ex + "\n");
    }
};
