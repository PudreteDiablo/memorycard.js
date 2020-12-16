# MemoryCard-JS
Save user progress in javascript-based games with slots and objects.

[![npm version](https://badge.fury.io/js/memorycard-js.svg)](//npmjs.com/package/memorycard-js)
[![Support](https://img.shields.io/badge/Support%20Project-Patreon-orange.svg)](https://patreon.com/PudreteDiablo)
[![Electron](https://img.shields.io/badge/Electron-Yes-blue.svg)](#available-platforms)
[![Cordova](https://img.shields.io/badge/Cordova-Yes-blue.svg)](#available-platforms)
[![Browsers](https://img.shields.io/badge/Browsers-Yes-blue.svg)](#available-platforms)
[![Backend Server](https://img.shields.io/badge/Backend%20Servers-Yes-blue.svg)](#available-platforms)

## Content Table

* [Installation](#installation)
  * [Node.js](#nodejs-electronbackend-servers)
  * [Browser CDN](#browser-cdn)
  * [Self-Host/Download](#self-host--download)
* [Advantages of Usage](#advantages)
* [Available Platforms](#available-platforms)
* [Documentation](#documentation)
  * [Reference Object](#reference-object)
    * [Node.js](#nodejs-backend-serverselectron)
    * [Global Object](#global-object-cordovabrowserselectron)
  * [Configuration](#configuration)

# Installation
#### Node.js (Electron/Backend-Servers)
```
npm i memorycard-js --save
```

#### Browser CDN
```
https://cdn.jsdelivr.net/npm/memorycard-js/dist/memorycard.min.js
```

#### Self-Host / Download
Go to [dist folder](https://github.com/PudreteDiablo/memorycard-js/tree/master/dist), download one of the javascript files and save it in your project folder then just import it via html: ```<script src="./memorycard.min.js"></script>``` or node.js: ```require( './memorycard.js' )``` 

### Advantages
You can save time in your game development by installing this package in your current game. Don't worry about platforms compatibility or organization, With this tool you can easily access to a safe *user-progress* data storage.

# Available Platforms
This tool was designed to be compatible with all useful javascript frameworks such as Electron and Cordova. Basically, the package encrypts the *data* and then saves depending on the platform where the game or application is currently running.

| Electron/Node.js | Browsers     | Cordova      | Cloud/Server   |
| :--------------: | :----------: | :----------: | :------------: |
| OS Drive         | LocalStorage | LocalStorage | Encrypted Data |

If you want to save the data in a *cloud storage*, you can easily request the encrypted data instead of save it by installing memorycard-js in you server (safer) or in the client-side. Also you can use [Strict Mode](#strict-mode) and [Card Key](#card-key) to improve the security.

# Documentation

### Reference Object
Depending on the current platform, you can access to the package by importing the module or calling the default object created by the script. 

**Note:** In Electron you can access to the MemoryCard with both options, but I recommend to access via *Global Object* if you are developing a cross-platform game.

#### Node.js (Backend Servers/Electron)
```js
const MemoryCard = require( 'memorycard-js' ) ;
```

#### Global Object (Cordova/Browsers/Electron)
```js
var mcard = window.MemoryCard ;
var mcard = window.MCARD ;
// or use one of it directly
MemoryCard.write( ) ;
MCARD.load( ) ;
```

## Configuration
The configuration is optional, but helps you to have more control about your *MemoryCard* use flow. Once you have the reference of the *MemoryCard Object*, just call the **config( )** method to set your preferences. The configuration is adaptative, so you can change the config while the game/app is running even if the current *MemoryCard Slots* was saved with different configuration. **It could be helpful but also dangerous, so be careful.**

```js
MemoryCard.config( config_object ) ;
```

#### Parameters
- `config_object` Object
  - `file` String - Set the file where the slots and its data will be writed and saved. **Default:** `{EXECUTABLE_PATH}/memorycard.data`
  - `slots` Number - Number of slots that will be available in the *MemoryCard*. **Default: 4**
  - `key` String - Increase security by requesting a key everytime that write( ) or save( ) function is called. **Default: null** 

#### Why set a *slots* limit?
The slots limit helps to draw a perfect "save screen" for your game, because MemoryCard