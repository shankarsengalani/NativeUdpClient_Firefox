var lib;
var add;
var stopSoc;
var callback;
try {
    function jsCallback (data) {
        self.postMessage(data.readString());
    }

    function runScoket() {
        var funcType = new ctypes.FunctionType(ctypes.default_abi, ctypes.void_t, [ctypes.char.array(100)]);
        var funcPtrType = funcType.ptr;
        callback = funcPtrType(jsCallback);
        add = lib.declare("RegisterCallback", ctypes.default_abi, ctypes.void_t, funcPtrType/*, ctypes.int32_t, ctypes.int32_t*/);
    }

    function registerDLL(nativeUrl) {
        lib = ctypes.open(nativeUrl);
        runScoket();
    }
} catch (e) {
    dump(e);
}

self.onmessage = function(messageFromClient) {
    try {
        var libUrl = messageFromClient.data;
        registerDLL(libUrl);
        add(callback);
    } catch (e) {
        dump(e+"\n");
    }
};
