var nativeCallback;
try {
    function declareNativeMethod(nativeUrl) {
        function jsCallback (data) {
            self.postMessage(data.readString());
        }
        var lib = ctypes.open(nativeUrl);
        var funcType = new ctypes.FunctionType(ctypes.default_abi, ctypes.void_t, [ctypes.char.ptr]);
        var funcPtrType = funcType.ptr;
        nativeCallback = funcPtrType(jsCallback);
        return lib.declare("RegisterCallback", ctypes.default_abi, ctypes.void_t, funcPtrType, ctypes.char.ptr);
    }
} catch (ex) {
    dump("Worker Error: " + ex + "\n");
}

self.onmessage = function(messageFromClient) {
    try {
        var libUrl = messageFromClient.data;
        var add = declareNativeMethod(libUrl);
        add(nativeCallback, "FileFromNative.log");
    } catch (ex) {
        dump("Worker Error on Message Received: " + ex + "\n");
    }
};
