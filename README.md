# Sample Firefox Add-on
> Firefox extension integrated with native code (c++) using JS-Ctypes.

Sample Firefox add-on which can integrate with native (c++) plugin to perform file and networking operations.

### Approach
* Addon SDK to be used for developing the Firefox addon.
* Native code to be ported and make it compatible with js-ctypes.
* Bridge the calls between the extension and plugin and try to spawn a UDP connection as POC.

### Deciding factors
* Mozilla advices to use [Add-on SDK](https://developer.mozilla.org/en-US/Add-ons) to develop extensions for Firefox browser.
* JS-Ctypes allows IPC between javascript and native code written in C. JS-Ctypes follows a specific standard for enabling IPC.
* The alternative approaches available plugin development were NPAPI and XPCOM. 
* NPAPI will be deprecated in chrome and uncertain with firefox either. While a custom XPCOM component is also not suggested by Mozilla, because it will also be deprecated some time soon.
* JS-Ctypes and emscripten were suggested approaches by MDN devs.
* Emscripten would be lot more complex to get it ported as MAIDSafe code depends on other dependencies which might also had to be ported.
* JS-Ctypes was ideal suited for our requirement. JS-Ctypes works only with C library. But can invoke the C++ functions by creating a shim C functions and then calling the same from the C++ library.


### Prerequisites
> To develop a add-on using Add-on SDK, you’ll need,
* Python 2.5 or greater.
* Firefox Add-on SDK. You can download it [here](https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Installation).
* Firefox 4.0 >

### Installation
> Assumption Python and Firefox already installed.

1. Extract the SDK file and store it in your local folder.
2. Open terminal (Linux) / Command Prompt (Windows) and navigate to the SDK folder. `cd addon-sdk`
3. Run source `bin/activate` for Linux and `bin/activate` for Windows to activate the SDK.
4. Your command prompt should now have a new prefix containing the name of the SDK’s root directory. `(addon-sdk)~/mozilla/addon-sdk>`
5. You can test your sdk activation by running `cfx` on the source directory.
6. For more information on installation you can refer [here](https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Installation).

### Project Structure
1. Sample project is hosted on [github](https://github.com/shankar2105/maidsafe_firefox_addon).
2. Extension has three folders namely __data__, __lib__ and __test__. In addition to this it contains __package.json__ file.
3. __data__ folder holds the media, native (c++), binary ( .dll and .so ) and the worker.js file.
4. __lib__ folder contains the __main.js__ and a custom module __udpService.js__.
5. __test__ folder is used for unit testing which holds the __test-main.js__ file.
6. The __main.js__ inside the __lib__ folder is the entry point for the application.
7. To test the project `run cfx` testall which test with a set of test cases written with it.

### Build Instruction
* To run the extension, navigate to the source directory of the project and run `cfx run` command. The sdk runs a new instance of firefox browser with your add-on installed.
* To pack the extension, run `cfx xpi` which gives a extension installation file (__.xpi__).

##### _Note_
> Whenever a new terminal is opened, must activate the sdk (`Follow installation step 3`), otherwise the cfx command won’t execute.
