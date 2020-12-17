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
- [Examples](#examples)
- [Documentation](#documentation)
  - [Reference Object](#reference-object)
    - [Node.js](#nodejs-backend-serverselectron)
    - [Global Object](#global-object-cordovabrowserselectron)
  - [Configuration](#configuration)
    - [Strict Mode](#strict-mode)
    - [Card Keys](#card-keys)
  - [Methods](#methods)
    - [getSummary( )](#getsummary-)
    - [getAll( )](#getall-)
    - [getSlot( )](#getslot-)
    - [write( )](#write-)
    - [save( )](#save-)
    - [load( )](#load-)
    - [read( )](#read-)
    - [copy( )](#copy-)
    - [delete( )](#delete-)
    - [format( )](#format-)
    - [reset( )](#reset-)
    - [writeAsync( )](#writeasync-)
    - [saveAsync( )](#saveasync-)
    - [loadAsync( )](#loadasync-)
    - [readAsync( )](#readasync-)
    - [copyAsync( )](#copyasync-)
    - [deleteAsync( )](#deleteasync-)
    - [formatAsync( )](#formatasync-)
    - [resetAsync( )](#resetasync-)
    - [getCardData( )](#getcarddata-)
    - [setCardData( )](#setcarddata-)
    - [http( )](#http-)
    - [on( )](#on-)
  - [Events](#events)
  - [Properties](#properties)
- [Write vs. Save](#write-vs-save)
- [Automatic vs. Manual](#automatic-vs-manual-save)
- [How to Set Up a Cloud-Save System](#how-to-set-a-cloud-save-system)
  - [Client Side](#client-side)
    - [No-HTTP](#no-http-manually)
    - [HTTP](#http-automatic)
  - [Server Side](#server-side)
- [Support](#support)

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
You can save time in your game development by installing this package in your current game. Don't worry about platforms compatibility or organization, With this tool you can easily access to a safe *user-progress* data storage. Finally, you will get an object with different slots for those games that enable multiple progress save per user *(But you can also use this package to save one slot only)*.
<br/><br/>

# Available Platforms
This tool was designed to be compatible with all useful javascript frameworks such as Electron and Cordova. Basically, the package encrypts the *data* and then saves depending on the platform where the game or application is currently running.

| Electron/Node.js | Browsers     | Cordova      | Cloud/Server   |
| :--------------: | :----------: | :----------: | :------------: |
| OS Drive         | LocalStorage | LocalStorage | Encrypted Data |

If you want to save the data in a *cloud storage*, you can easily request the encrypted data instead of save it by installing memorycard-js in you server (safer) or in the client-side. Also you can use [Strict Mode](#strict-mode) and [Card Keys](#card-keys) to improve the security.

**Electron Tip:** Don't forget to enable [nodeIntegration](https://www.electronjs.org/docs/tutorial/quick-start#create-the-main-script-file) or you will get a error saying something like: "require" is not a function.
<br/>

# Examples
As programmer, I prefer to look at examples to understand how a package works. So I make a few examples with comments in the [examples folder](https://github.com/PudreteDiablo/memorycard-js/tree/master/examples).
<br/>

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
<br/>

## Configuration
The configuration is optional, but helps you to have more control about your *MemoryCard* use flow. Once you have the reference of the *MemoryCard Object*, just call the **config( )** method to set your preferences. You will not able to change the configuration once the selected *MemoryCard* is loaded or created, so if you create a *MemoryCard* with 4 slots and a [Card Key](#card-keys), you can't change that properties, just edit slots information to save user-progress.

```js
MemoryCard.config( config_object ) ;
```

#### Parameters
- `config_object` Object
  - `file` String - **Default:** `{EXECUTABLE_PATH}/memorycard.data` | Set the file where the slots and its data will be writed and saved.
  - `slots` Number - **Default: 4** | Number of slots that will be available in the *MemoryCard*.
  - `key` String - **Default: null** | Increase security by setting up a unique key for every new card created. See [Card Keys](#card-keys) for mor information.
  - `strict_mode` Boolean - **Default: false** | Set strict mode enabled. See [Strict Mode](#strict-mode) section for more information.
  - `template` Object - **Default: null** | Set a template for every new slot writed in the *MemoryCard*. When **strict_mode is disabled** all missing properties in the new slot will be replaced with the template properties as default. But if **strict_mode is enabled** all new slots must match with the template even the properties types to allow the save action.
  - `temp` Boolean - **Default: false** | **Recommended for cloud-based storage.** This option allows to create temporary *MemoryCard* files that will be deleted automatically by the OS or Browser by setting `/tmp/random-filename.data` in Node.js and switching **LocalStorage** to **SessionStorage** in Browsers.
  - `manual` Boolean - **Default: false** | Prevents user to save or load until you manually load a *MemoryCard* data through [setCardData( )](#setcarddata-)

#### Why set a *slots* limit?
It just helps to organize the data and avoids a huge *disk usage* (Web-LocalStorage only support 5MB per website). Also, a small number of slots can help to create a nice "save screen" for your game, just like many retro games.

#### Card Keys
Every time you create a *MemoryCard* (Automatically created when the package doesn't find the specified file or a record in the LocalStorage), the package will set the [pre-configured key](#configuration) as *MemoryCard* key and **will be locked** (not-changable).

*Tip:* Create a unique key based on the user-id (recommended) or also by requesting a unique device-id with tools like [machine-id npm package](https://www.npmjs.com/package/machine-id).

This feature have two objectives:
- Increase write secutiry by requesting the *card key* every time when [write( )](#write-) or [save( )](#save-) methods being called.
- Avoid a *progress-hack* by replacing the actual *MemoryCard* file with someone downloaded in a forum. Go to [examples](#examples) section to get a example about *Cards Keys* implementation.

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
<br/><br/><br/>

## Methods
The next methods can be used once you set configuration. Once you call one of these methods that requires *MemoryCard* data, the *MemoryCard* will be loaded and you will not able to change configuration again.


### getSummary( )
Returns an array of all slots in the *MemoryCard* even the empty slots. Is just a summary that helps you to draw a "save screen", so It only will returns relevant information like slot_index and the modification date.

```js
var slots = MemoryCard.getSummary( ) ;
    slots = [ {
      index : 0 ,
      empty : false ,
      title : "The Lemon Land II" ,
      date  : '2020-12-17T11:53:50.321Z' , // <= ISO Format Date
      DATE  : Date // <= JavaScript Date
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

#### Returns
- `slots[]` Array | An array with slots descriptions **without its data**.
<br/><br/>


### getAll( )
Same as [getSummary( )](#getsummary-) but this method also includes data of every slot. Maybe you want to add more info. to your "save screen" such as rupees collected or the game progress.

```js
var slots = MemoryCard.getAll( ) ;
    slots = [ {
      index : 0 ,
      empty : false ,
      title : "The Lemon Land II" ,
      date  : '2020-12-17T11:53:50.321Z' ,
      DATE  : Date ,
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

#### Returns
- `slots[]` Array | An array with slots descriptions **including its data**.
<br/><br/>


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

#### Returns
- `slot` Object | All information of the specified slot even if is empty.
<br/><br/>


### write( )
Writes the data in a slot of the *MemoryCard*. This method will overwrite the entire slot if is already in use. If you only want to save a little change like new "coins" amount, you maybe want to use [save( )](#save) method instead.

```js
// MemoryCard.write( slot_index, ?title, data, ?key ) ;
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
- `title` String | **(Optional) Default: "Slot N" where N = slot_index + 1.** Set a title to display in the slots summary.
- `data` Object | **(Required)** All data to save in the slot. If you have enabled **Strict Mode**, the data object will be processed before save it in the storage. See [Strict Mode](#strict-mode) for more information.
- `key` String | **(Optional)** Set the required key to save the new data in the slot, only if you have declared it before in the [configuration](#configuration).
<br/><br/>

### save( )
With this method you can save one or more properties in an already saved slot. If the selected slot is empty, the method will return an error.

Unlike [write( )](#write-), when you are in **strict mode**, only the defined properties in the parameters will be processed and fixed to save in the slot. 

```js
// MemoryCard.save( slot_index, ?title, data, ?key ) ;
MemoryCard.save( 2, {
 rupees : 32
} , "XMJSKO92" ) ;
```

#### Parameters
- `slot_index` Number | **(Required)** Declare the slot where the data will be saved.
- `title` String | **(Optional) Default: The current slot_title.** Set a title to display in the slots summary.
- `data` Object | **(Required)** The data to overwrite in the slot.
- `key` String | **(Optional)** Set the required key to save the new data in the slot, only if you have declared it before in the [configuration](#configuration).
<br/><br/>

### load( )
Read and return the data of the specified slot_index. This method will return `null` if the selected slot is empty.

```js
// MemoryCard.load( slot_index ) ;
MemoryCard.load( 2 ) ;
```

#### Returns
- `slot_data` Object | The data saved in the selected slot.

#### Parameters
- `slot_index` Number | **(Required)** Declare the slot where the data will loaded.
<br/><br/>

### read( )
Read directly from *MemoryCard* file and returns all data on the file as JSON Object. Also all cache object will be refreshed (not recommended).

```js
slots = MemoryCard.read( ) ;
```

#### Returns
- `memoryCard_data` Object | All decrypted information of the MemoryCard like the saved slots and the its key to modified it. Read [Card Keys](#card-keys) for more information.
  - `key` String/Null | The key saved in the *MemoryCard* in its creation date.
  - `date` String | The date of *MemoryCard* creation (ISO Format).
  - `slots` Object[] | All slots (even empty slots) in the *MemoryCard*.
<br/><br/>


### copy( )
Copy a already used slot to create new one.

```js
// MemoryCard.copy( ref_index, dest_index ) ;
MemoryCard.load( 0, 2 ) ;
// Slot 1 will be copied in Slot 3 [^]
```

#### Parameters
- `ref_index` Number | **(Required)** The index of the slot that will be copied.
- `dest_index` Number | **(Required)** The index of destination slot.
<br/><br/>


### delete( )
Delete an already used slot and restore it as *empty slot*.

```js
// MemoryCard.delete( slot_index ) ;
MemoryCard.delete( 1 ) ;
```

#### Parameters
- `slot_index` Number | **(Required)** The index of the slot that you want to delete. 

#### Recomendation
Ask to the player if is sure to delete the selected slot by writing in the dialog box the title of the slot.
<br/><br/>


### format( )
Delete all saved slots and set all as *empty slot*.

```js
MemoryCard.format( ) ;
```
<br/>


### reset( )
Do you prefer to delete entire *MemoryCard* even the file or record in the LocalStorage to create new one?. This method will delete entire data.

```js
MemoryCard.reset( ) ;
```
<br/>


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


### readAsync( )

```js
MemoryCard.readAsync( ) ;
```


### copyAsync( )

```js
MemoryCard.copyAsync( ref_index, dest_index ) ;
```


### deleteAsync( )

```js
MemoryCard.deleteAsync( slot_index ) ;
```


### formatAsync( )

```js
MemoryCard.formatAsync( ) ;
```


### resetAsync( )

```js
MemoryCard.resetAsync( ) ;
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
  .then( function( returned_variable_if_original_method_returns_one ) {
    // ON SUCCESS
  } )
  .catch( function( err ) {
    // ON ERROR
    console.error( 'WRITE_SLOT_DATA_ERROR ::', err ) ;
  } ) ;
```
<br/><br/>


### getCardData( )
Returns an encrypted *MemoryCard* data to save in an external drive like a cloud-storage.

```js
MemoryCard.getCardData( ) ;
```
<br/>


### setCardData( )
Set custom encrypted *MemoryCard* data to load slots and *user-progress*. You can use this method to load a *MemoryCard* backup or data requested from a cloud-storage.

If you will use a full "cloud-save-system", **I recommend to enable the `temp` option in the [MemoryCard Configuration](#configuration).** This will allow to delete automatically the *MemoryCard* files by setting `/tmp` folder as *MemoryCard* file or switching LocalStorage to SessionStorage if you will use a Browser instead Node.js as platform.

```js
MemoryCard.setCardData( MemoryCard_Data ) ;
```

#### Parameters
- `MemoryCard_Data` String | **(Required)** A valid encrypted string that contains all *MemoryCard* data. 
<br/><br/>


### http( )
Loads file from the defined url and then tries to load it as *MemoryCard* data through [setCardData( )](#setcarddata-).

**Returns a Promise.**

```js
MemoryCard
  .http( url )
  .then( ( ) => {
    // CLOUD-MEMORYCARD LOADED SUCCESSFULLY
    // READY TO GET SLOTS DATA
  } )
  .catch( err => {
    // ERROR
    console.error( 'MEMORYCARD_CLOUD_LOAD_ERROR ::', err ) ;
  } ) ;
```

#### Parameters
- `url` URL | **(Required)** A valid url that returns an encrypted *MemoryCard* data obtained through [getCardData( )](#getcarddata-)
<br/><br/>


### on( )
Adds an event listener depending of the type defined as first parameter. See [Events](#evets) to check available events.

```js
// MemoryCard.on( eventType, callback ) ;
MemoryCard.on( 'save', ( ev ) => {
  console.log( ev.slot_index ) ; // 0
} ) ;
```

#### Parameters
- `eventType` String | **(Required)** The type of the event to wait.
- `callback` Function | **(Required)** The function that will be called everytime event fires.
<br/><br/>


## Events
Catchable events through [on( )](#on-) method.

### Event: `save`
Called when [write( )](#write-) or [save( )](#save-) has been executed correctly. 

Returns:
- `EventData` Object
  - `type` String | If you want to differentiate between `write` and `save` methods.
  - `slot_index` Number | The index of the modified slot. 
  - `slot_data` Object | All data saved in the slot.
<br/><br/>


### Event: `load`
Fired when [load( )](#load-) has been executed correctly. 

Returns:
- `EventData` Object
  - `slot_index` Number | The index of the modified slot. 
  - `slot_data` Object | All data saved in the slot.
<br/><br/>


### Event: `delete`
Fired when [delete( )](#delete-) has been executed correctly. 

Returns:
- `EventData` Object
  - `slot_index` Number | The index of the modified slot. 
<br/><br/>


### Event: `copy`
Fired when [copy( )](#copy-) has been executed correctly. 

Returns:
- `EventData` Object
  - `slot_index` Number | The index of the new slot. 
  - `slot_ref_index` Number | The index of the copied slot.
<br/><br/>


### Event: `card-loaded`
Fired when a new *MemoryCard* data is loaded by [setCardData( )](#setcarddata-) or [read( )](#read-) methods. Even if you don't call one of these methods the package requires to call [read( )](#read-) at the first time when you call a method to access to a slot or try write one.

Returns:
- `EventData` Object
  - `card_data` Object | The full loaded data of the new inserted card as returned in [read( )](#read-). 
<br/><br/>


## Properties
Properties of the *MemoryCard* Object. I think are useless (except for the first one, because I used it to develop the methods) but... here it is.

`MemoryCard.loaded` Boolean | Allows you to check if a MemoryCard is already loaded.

`MemoryCard.__config` Object | The object config used every time a method is called and requires it. This object is modified with the [config( )](#configuration) method. **I recommend to you this property as read-only.** Please modify any .__config property by [config( )](#configuration) method.

`MemoryCard.__cache` Object | To avoid a slow perfomance, all slots are stored in a cache object and it is modified in every method. For example, when you call [write( )](#write-), the slot inside the cache object also will be modified to be available for other methods like [load( )](#load-) or the same write( ) because we need to compare the `old slot data` with the `new slot data`.
<br/><br/>

## write() vs. save()
Maybe you think that save is useless because only allows to save in already saved slots. But this method was designed to add a safe option to avoid a constant original slot overwrite. Also, save( ) can be much faster and can help to make an *automatic-save* system.
<br/><br/>

## Automatic vs. Manual Save
**Note:** I refer to *manual saving* as the save activated by the player through a menu or an in-game item.

This depends totally about your game and the genre of it. Just imagine, a FPS horror game where you need to save a property named `scene` every time the player changes the scene, but at the same time needs a *manual save* to keep all big changes in the storage like the chapter number or all new added items in to the inventory.

Of course, you can save all changes every time the player changes the scene, but it could affect performance. As I said before, it depends of your game and your imagination.
<br/><br/>

## How to Set Up a Cloud-Save System

### Client Side
First, ensure to enable `temp` option in the [configuration](#configuration) 
unless if you don't have problem if the player keep a *MemoryCard* data file in the disk drive (couldn't be a problem, 'cause you will set a custom file every time the game starts).

**Tip:** Ensure to first load the *MemoryCard* data before enable save/load options in your game because, once the user access to the current MemoryCard, you will not able to change it.

**Note:** You must write all new data in your server or cloud-storage manually. It can be easily set up with the [Save Event](#events) and the [getCardData( )](#getcarddata-).

#### No-HTTP (Manually)
You must download your *MemoryCard* data from your server by yourself. Once you have the data loaded, call the [setCardData( )](#setcarddata-) method to set the previously saved data from [getCardData( )](#getcarddata-) as your current *MemoryCard* data.

#### HTTP (Automatic)
You can save time if you provide a URL to directly get *MemoryCard* data from your server or cloud-storage. Just call [http( )](#http) method and wait a response to continue with your user-save-process (see the example).
<br/>

#### An example of HTTP Client-Side Save/Load Data
```js
// CONFIGURATION
MemoryCard.config( {
  temp  : true ,
  slots : 8 ,
  strict_mode : true
} ) ;

// SETTING UP EVENTS [v]
MemoryCard.on( 'load-card', ( ev ) => {
  console.log( 'New MemoryCard has inserted =>', ev.card_data ) ;
  // ENABLING SAVE-MENU because MemoryCard is ready to read and write [v]
  mySaveHTMLForm.enabled = true ;
  // ALSO DON'T FORGET TO DISPLAY SLOTS IN THE SAVE-MENU [v]
  var slots = MemoryCard.getSummary( ) ;
  mySaveHTMLForm.displaySlots( slots ) ;
} ) ;

MemoryCard.on( 'save', ( ev ) => {
  console.log( 'A slot was modified =>', `Slot ${ ev.slot_index + 1 }`, ev.slot_data ) ;
  // DISABLE SAVE-MENU until the data gets saved in the cloud (for security) [v]
  mySaveHTMLForm.enabled = false ;
  // NOW SAVE ALL MEMORYCARD IN THE SERVER/CLOUD-STORAGE
  fetch( 'https://my-http-server.com/saveUserMemoryCard', {
    method : 'POST',
    headers : {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    } ,
    body : JSON.stringify( { 
      user_id : "12938", 
      card_data : MemoryCard.getCardData( )
    } )
  } ).then( ( ) => {
    if( response.status >= 400 ) 
      { throw new Error( "Bad response from server" ) ; }
    // DATA SAVED SUCCESSFULLY
  } ).catch( err => {
    console.error( 'MEMORYCARD_CLOUD_SAVE_ERROR ::', err ) ;
  } ).finally( ( ) => {
    // RE-ENABLE SAVE-MENU [v]
    mySaveHTMLForm.enabled = true ;
  } ) ;
} ) ;

// LOAD CLOUD-MEMORYCARD THROUGH HTTP WHEN USER OPEN SAVE-MENU [v]
mySaveMenuButton.onclick = function( ) {
  if( !MemoryCard.loaded ) {
    // LOAD A MEMORYCARD THROUGH YOU OWN API or SERVER.
    // For this method, .http( ), the response must be a string of all
    // encrypted data of the MemoryCard that you saved in your server
    // with the .getCardData( ) method before (such as the 'save' event).
    MemoryCard
      .http( 'https://my-http-server.com/getUserMemoryCard?id=12938' )
      .then( ( ) => {
        // HTTP-MEMORYCARD LOADED SUCCESSFULLY
        // Now just wait that the 'save' event gets called.
        // Also you can set a function right here instead.
      } )
      .catch( err => {
        console.error( 'LOAD_HTTP_MEMORYCARD_ERROR ::', err ) ;
      } ) ;
  } else {
    // ENABLING SAVE-MENU because MemoryCard is already loaded 
    // and available to read and write [v]
    mySaveHTMLForm.enabled = true ;
    var slots = MemoryCard.getSummary( ) ;
    mySaveHTMLForm.displaySlots( slots ) ;
  }
} ;
```
<br/>

**Why use Client Side Cloud-Save:** If you are looking for *save-slots*, this option is perfect for you, because you will have an automated and organizated system to keep user progress in *memory-slots* even if you decide to save it in your server. But, what happens if you only want to save a single progress in the cloud per user? Well, you can see the next topic: "Server Side"

<br/>

### Server Side
Client side option for cloud-save system can be problematic if you are not a experienced javascript programmer. You can perfectly let server do all work and just provide a final JSON object to the client through HTTP, but for this option MemoryCard-JS seems useless because you can perfectly use a *Database* such as *Firebase Firestore*, *MySQL* or any other service that can provide a object response through http.

So, if you prefer a full server-side system, I recommend you to search for a nice *Realtime Database* for your project.
<br/><br/>


## Support
Support this project and other game-development tools through [Patreon](https://patreon.com/PudreteDiablo) or [Itch.io](https://pudretediablo.itch.io/)