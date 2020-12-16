# MemoryCard-JS
Save user progress in javascript-based games with slots and objects.

[![npm version](https://badge.fury.io/js/memorycard-js.svg)](//npmjs.com/package/memorycard-js)
[![Support](https://img.shields.io/badge/Support%20Project-Patreon-orange.svg)](https://patreon.com/PudreteDiablo)
[![Electron](https://img.shields.io/badge/Electron-Yes-blue.svg)](#available-platforms)
[![Cordova](https://img.shields.io/badge/Cordova-Yes-blue.svg)](#available-platforms)
[![Browsers](https://img.shields.io/badge/Browsers-Yes-blue.svg)](#available-platforms)
[![Backend Server](https://img.shields.io/badge/Backend%20Servers-Yes-blue.svg)](#available-platforms)

## Content Table

- [Installation](#installation)
  - [Node.js](#nodejs-electronbackend-servers)
  - [Browser CDN](#browser-cdn)
  - [Self-Host/Download](#self-host--download)
- [Advantages of Usage](#advantages)
- [Available Platforms](#available-platforms)
- [Documentation](#documentation)
  - [Reference Object](#reference-object)
    - [Node.js](#nodejs-backend-serverselectron)
    - [Global Object](#global-object-cordovabrowserselectron)
  - [Configuration](#configuration)
    - [Strict Mode](#strict-mode)
  - [Methods](#methods)
    - [getSummary( )](#getsummary-)
    - [getAll( )](#getall-)
    - [getSlot( )](#getslot-)
    - [write( )](#write-)
    - [save( )](#save-)
    - [load( )](#load-)
    - [writeAsync( )](#writeasync-)
    - [saveAsync( )](#saveasync-)
    - [loadAsync( )](#loadasync-)
    - [on( )](#on-)
  - [Events](#events)
  - [Properties](#properties)
- [Other Stuff](#other-stuff)
  - [Write vs. Save](#write-vs-save)
  - [Automatic vs. Manual](#automatic-vs-manual-save)

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
  - `file` String - **Default:** `{EXECUTABLE_PATH}/memorycard.data` | Set the file where the slots and its data will be writed and saved.
  - `slots` Number - **Default: 4** | Number of slots that will be available in the *MemoryCard*.
  - `key` String - **Default: null** | Increase security by requesting a key everytime that write( ) or save( ) function is called.
  - `strict_mode` Boolean - **Default: false** | Set strict mode enabled. See [Strict Mode](#strict-mode) section for more information.
  - `template` Object - **Default: null** | Set a template for every new slot writed in the *MemoryCard*. When **strict_mode is disabled** all missing properties in the new slot will be replaced with the template properties as default. But if **strict_mode is enabled** all new slots must match with the template even the properties types to allow the save action.

#### Why set a *slots* limit?
It just helps to organize the data and avoids a huge *disk usage*. Also, a small number of slots can help to create a nice "save screen" for your game, just like many retro games. 

#### Strict Mode
The strict mode helps you to keep your saved slots as clean as possible, so it will add missing properties, delete extra-defined properties and fixing the types. This mode can be useful to avoid corrupted data slots, but also could be dangerous, so just try to be careful.

##### Here an example of strict_mode data output:
```js
// TEMPLATE-SLOT
var $template = {
  username   : "Diablo Luna" ,
  rupees     : 8 ,
  trophies   : "9,2,5,6" ,
  tips       : true ,
  medallions : [ 2, 3 ] ,
  inventory  : {
    nuts : 4
  } ,
}

// THE DATA ALREADY SAVED IN THE SLOT
var $slot = {
  username   : "Diablo Luna" ,
  rupees     : 0 ,
  difficult  : "cow"
}

// NEW DATA TO SAVE
var $new = {
  username   : "Diablo Luna" ,
  rupees     : "8" ,
  trophies   : [ 4, 5, 7 ] ,
  tips       : false ,
  wooops     : true ,
  medallions : 4 ,
  inventory : {
    nuts : "8"
  }
}

// ==== STEPS ================================================ [v]
// $new will be compared with the already saved $slot (if exists)
// and all missed properties will be added to the $new.
// [then]
// $new will be compared with the $template and will be fixed
// by adding missing properties, removing extra-properties in $new
// and fixing types in the properties of $new.
// [then]
// $new will be saved, replacing the $slot in the next save.
// ===============================================================

// DATA SAVED [OUTPUT]
{
  username   : "Diablo Luna" ,
  rupees     : 8 ,
  trophies   : "4,5,7" ,
  tips       : false ,
  medallions : [ 4 ] ,
  inventory  : null
}

/* 
 * RUPEES has set to 8 number because the original type 
 * in the template was <Number> and string "8" 
 * could be turned into a number.
 * 
 * TROPHIES array has changed to string and separated by comma
 * because the original type in the template is <String>.
 * 
 * MEDALLIONS has set to [ 4 ] because the original type
 * in the template was <Array> and (by deduction) maybe
 * the game-developer tried to make a new array with the
 * number '4'.
 * 
 * WOOOPS was removed because isn't in the original template. 
 * 
 * INVENTORY has changed to the original value (template)
 * because the type was incorrect and isn't possible convert
 * the "null" into a Object.
 */
```

Strict mode can be very useful, but just try to make the code cleanest possible, is not a magic tool.


## Methods

### getSummary( )
Returns an array of all slots in the *MemoryCard* even the empty slots. Is just a summary that helps you to draw a "save screen", so It only will returns relevant information like slot_index and the modification date.

```js
var slots = MemoryCard.getSummary( ) ;
    slots = [ {
      index : 0 ,
      empty : false ,
      title : "The Lemon Land II" ,
      date  : Date // <= JavaScript Date
    } , {
      index : 1 ,
      empty : true ,
      title : "Slot 2" // <= Why 2? Because index 0 = "Slot 1" (It's just a title).
    } , {
      index : 2 ,
      empty : true ,
      title : "Slot 3"
    } ] ;
```

### getAll( )
Same as getSummary( ) but this method also includes data of every slot. Maybe you want to add more info. to your "save screen" such as rupees collected or the game progress.

```js
var slots = MemoryCard.getSummary( ) ;
    slots = [ {
      index : 0 ,
      empty : false ,
      title : "The Lemon Land II" ,
      date  : Date ,
      data  : {
        // ALL DATA OF THE SLOT
      }
    } , {
      index : 1 ,
      empty : true ,
      title : "Slot 2" ,
      data  : null
    } ]
```

### getSlot( )
Returns all slot data of the specified *slot_index*. If the slot is empty it will returns an object with `empty : true` property.

```js
var slot = MemoryCard.getSlot( 0 ) ;
    slow = {
      index : 0 ,
      empty : false ,
      title : "The Lemon Land II" ,
      date  : Date ,
      data  : {
        // ALL DATA OF THE SLOT
      }
    } ;
```

#### Parameters
- `slot_index` Number - **(Required)** The index of the requested slot. Must be less than the pre-configured number of slots (4 slots by default).

### write( )
Writes the data in a slot of the *MemoryCard*. This method will overwrite the entire slot if is already in use. If you only want to save a little change like new "coins" amount, you maybe want to use [save( )](#save) method instead.

```js
// MemoryCard.write( slot_index, title, data, ?key ) ;
MemoryCard.write( 2, "Cookies Island", {
 username : "Diablo Luna"
 scene : 3 ,
 inventory : {
   watermelons : 8 ,
   lemon_pie : true
 }
} , false, "XMJSKO92" ) ;
```

#### Parameters
- `slot_index` Number | **(Required)** Declare the slot where the data will be saved.
- `title` String | **Default: "Slot N" where N = slot_index + 1.** Set a title to display in the slots summary.
- `data` Object | **(Required)** All data to save in the slot. If you have enabled **Strict Mode**, the data object will be processed before save it in the storage. See [Strict Mode](#strict-mode) for more information.
- `key` String | **(Optional)** Set the required key to save the new data in the slot, only if you have declared it before in the [configuration](#configuration).


### save( )
With this method you can save one or more properties in an already saved slot. If the selected slot is empty, the method will return an error.

Unlike [write( )](#write-), when you are in **strict mode**, only the defined properties in the parameters will be processed and fixed to save in the slot. 

```js
// MemoryCard.save( slot_index, data, ?key ) ;
MemoryCard.save( 2, {
 rupees : 32
} , "XMJSKO92" ) ;
```

#### Parameters
- `slot_index` Number | **(Required)** Declare the slot where the data will be saved.
- `data` Object | **(Required)** The data to overwrite in the slot.
- `key` String | **(Optional)** Set the required key to save the new data in the slot, only if you have declared it before in the [configuration](#configuration).


### load( )
Read and return the data of the specified slot_index. This method will return an error if the selected slot is empty.

```js
// MemoryCard.load( slot_index ) ;
MemoryCard.load( 2 ) ;
```

#### Parameters
- `slot_index` Number | **(Required)** Declare the slot where the data will loaded.


### writeAsync( )
An async option of [write( )](#write-]).

**NOTE:** All async versions of the available methods are helpful to catch errors and will always returns [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). Also all of it uses the same parameters of it "original" versions.

```js
MemoryCard.writeAsync( slot_index, title, data, ?key ) ;
```


### saveAsync( )

```js
MemoryCard.saveAsync( slot_index, data, ?key ) ;
```


### loadAsync( )

```js
MemoryCard.loadAsync( slot_index ) ;
```

#### An example of an async function call

```js
MemoryCard
  .writeAsync( 2, "Cookies Island", {
    username : "Diablo Luna"
    scene : 3 ,
    inventory : {
      watermelons : 8 ,
      lemon_pie : true
    }
  } , false, "XMJSKO92" ).
  .then( ( ) => {
    // ON SUCCESS
  } )
  .catch( err => {
    // ON ERROR
    console.error( 'WRITE_SLOT_DATA_ERROR ::', err ) ;
  } ) ;
```

# Other Stuff

## write() vs. save()
Maybe you think that save is useless because only allows to save in already saved slots. But this method was designed to add a safe option to avoid a constant original slot overwrite. Also, save( ) can be much faster and can help to make a *automatic-save* system.

## Automatic vs. Manual Save
**Note:** I refer to *manual saving* as the save activated by the player through a menu or an in-game item.

This depends totally about your game and the genre of it. Just imagine, a FPS horror game where you need to save a property named `scene` every time the player changes the scene, but at the same time needs a *manual save* to keep all big changes in the storage like the chapter number or all new added items in to the inventory.

Of course, you can save all changes every time the player changes the scene, but it could affect performance. As I said before, it depends of your game and your imagination.