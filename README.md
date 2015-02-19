# Maidsafe Firefox Add-on
Firefox extension integrated with native code (c++) using JS-Ctypes.

### Requirement
To build a Firefox add-on which can integrate with native (c++) plugin to perform file and networking operations.

# Approach
Addon SDK to be used for developing the Firefox addon.
Native code to be ported and make it compatible with js-ctypes.
Bridge the calls between the extension and plugin and try to spawn a UDP connection as POC.

### Deciding factors
Mozilla advices to use Add-on SDK to develop extensions for Firefox browser.
js-ctypes allows IPC between javascript and native code written in C. js-ctypes follows a specific standard for enabling IPC.
The alternative approaches available plugin development were NPAPI and XPCOM. 
NPAPI will be deprecated in chrome and uncertain with firefox either. While a custom XPCOM component is also not suggested by Mozilla, because it will also be deprecated some time soon.
JS-Ctypes and emscripten were suggested approaches by MDN devs.
emscripten would be lot more complex to get it ported as MAIDSafe code depends on other dependencies which might also had to be ported.
JS-Ctypes was ideal suited for our requirement. js-ctypes works only with C library. But can invoke the C++ functions by creating a shim C functions and then calling the same from the C++ library.


### Prerequisites
To develop a add-on using Add-on SDK, you’ll need,
Python 2.5 or greater.
Firefox Add-on SDK. You can download it here.
Firefox 4.0 >

### Installation
Assumption Python and Firefox already installed.

Extract the SDK file and store it in your local folder.
Open terminal (Linux) / Command Prompt (Windows) and navigate to the SDK folder. cd addon-sdk
Run source bin/activate for Linux and bin/activate for Windows.
Your command prompt should now have a new prefix containing the name of the SDK’s root directory. (addon-sdk)~/mozilla/addon-sdk>
You can test your sdk activation by running cfx on the source directory.
For more information on installation you can refer here.

### Project Structure
Sample project is hosted on github.
Extension has three folders namely data, lib and test. In addition to this it contains package.json file.
data folder holds the media, native (c++), binary ( .dll and .so ) and the worker.js file.
lib folder contains the main.js and a custom module udpService.js.
test folder is used for unit testing which holds the test-main.js file.
The main.js inside the lib folder is the entry point for the application.
To test the project run cfx testall which test with a set of test cases written with it.

### Build Instruction
To run the extension, navigate to the source director of the project and run cfx run command. The sdk runs a new instance of firefox browser with your add-on installed.
To pack the extension, run cfx xpi which gives a extension installation file (.xpi).

##### _Note_
Whenever a new terminal is opened, must activate the sdk (Follow installation step 3), otherwise the cfx command won’t execute.
