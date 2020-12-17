/* 
  Copyright 2021 Diablo Luna [@PudreteDiablo]
  Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
var root       = typeof window !== "undefined" ? window : this ;
var isElectron = ( ) => typeof window !== "undefined" && window.process && window.process.platform ? true : false ;
var isNodejs   = ( ) => typeof module !== 'undefined' && module.exports ? true : false ;
var isCordova  = ( ) => typeof window !== "undefined" && window.hasOwnProperty( 'cordova' ) ? true : false ;
var fs         = isNodejs( ) || isElectron( )  ? require( 'fs' ) : { } ;
var path       = isNodejs( ) || isElectron( )  ? require( 'path' ) : { } ;
var atob       = isNodejs( ) && !isElectron( ) ? require( 'atob' ) : window.atob ;
var btoa       = isNodejs( ) && !isElectron( ) ? require( 'btoa' ) : window.btoa ;
var MCARD      = { } ;
var cryptr     = {
  encrypt : ( str ) => ENCRYPT( str ) ,
  decrypt : ( str ) => DECRYPT( str )
} ;

MCARD.__config = {
  slots   : 4 , 
  file    : './memorycard.data' ,
  storage : isNodejs( ) || isElectron( ) ? { } : window.localStorage ,
  key     : null ,
  temp    : false
} ;

MCARD.__cache = { } ;
MCARD.eventListeners = [ ] ;

/**
 * @return {Boolean} - Check if a MemoryCard is already loaded.
 */
Object.defineProperty( MCARD, 'loaded', {
  get : ( ) => { return MCARD.__config.loaded }
} ) ;

/**
 * @return {Boolean} - Returns the configuration property.
 */
Object.defineProperty( MCARD, 'configObject', {
  get : ( ) => { return MCARD.__config ; }
} ) ;

/**
 * @param {!Object} config_json - Properties to configure MemoryCard.
 * @property {?String} config_json.file - (Electron) Set a custom path to read and write encrypted .data file.
 * @property {?String} config_json.key - Set a key that will be requested every save( ) and load( ) call.
 * @property {?Number} config_json.slots - Set max slots for the memory card. Default: 4
 * @property {?Boolean} config_json.strict_mode - Set a strict mode at save( ) function. You need to declare a template json and, everytime you save a new slot or overwrite one, the required new data needs to have the same properties as template with same types of variables. If you use save( ) instead to save little changes like new "coins" collected, the property type needs to match with the template even the property must be present in the template, so you will not able to save the "scene" property if is not present in the original template.
 * @property {?Object} config_json.template - Set a template for all new slots saved. If your new slot is missing a property this will be added automatically unless you have set "strict_mode".
 * 
 * @example
 *
 * ```js
 * MCARD.config( {
 *  file  : './memorycard.data' ,
 *  key   : 'watermelon' ,
 *  slots : 16 ,
 *  strict_mode : false ,
 *  template : {
 *    name  : "User Name" ,
 *    coins : 0 ,
 *    lives : 4 ,
 *    inventory : { }
 *  }
 * } ) ;
 * ```
 */
MCARD.config = ( object ) => {
  if( MCARD.loaded === true ) { throw new Error( 'You can\'t change config once the MemoryCard was loaded.' ) ; }
  if( typeof object !== "object" ) { throw new Error( 'The provided parameter is not a json object.' ) ; }
  if( object.strict_mode === true && !object.template ) 
    { throw new Error( 'To use "strict_mode" you need to declare a template in config function.' ) ; }
  if( object.strict_mode === true && Object.keys( object.template ).length <= 0 ) 
    { throw new Error( 'Your declared template doesn\'t have properties. You will always get a error at save( ) function call.' ) ; }
  if( object.slots && typeof object.slots !== "number" ) 
    { throw new Error( 'slots property must be a number.' ) ; }
  if( object.temp === true ) { 
    if( isNodejs( ) || isElectron( ) ) {
      var OS   = require( 'os' ) ;
      var tmp  = tmp = OS.tmpdir( ) ;
      object.file = path.join( tmp, `./${ GET_RANDOM_STRING( 64 ).toUpperCase( ) }.data` ) ;
    } else {
      object.storage = window.sessionStorage ;
    }
  } /* SET TEMP FILE [^] */
  for( var i in object ) {
    MCARD.__config[ i ] = object[ i ] ;
  } return true ;
}

/**
 * Returns a summary of all slots available even empty slots. Useful to draw a "save menu" in your game.
 * 
 * @return {Object[]} - An array of all slots in the memorycard, but only returns relevant information for the "save screen".
 * 
 * @example
 * ```js
 * slots = [ {
 *  index : 0 ,
 *  empty : false ,
 *  title : "The Lemon Land II" ,
 *  date  : Date
 * } , {
 *  index : 1 ,
 *  empty : true ,
 *  title : "Slot 2"
 * } , {
 *  index : 2 ,
 *  empty : true ,
 *  title : "Slot 3"
 * } ] ;
 * ```
 */
MCARD.getSummary = ( ) => {
  var length = MCARD.__config.slots || 4 ;
  var slots  = [ ] ;
  for( var i = 0 ; i < length ; i++ ) {
    slots.push( MCARD.getSlot( i ) ) ;
    delete slots[ i ].data ;
    if( typeof slots[ i ].date === "string" ) 
      { slots[ i ].DATE = new Date( slots[ i ].date ) ; }
  } return slots ;
} ;

/**
 * Same as getSummary( ) but this method also includes the data saved in the slot.
 * @abstract
 */
MCARD.getAll = ( ) => {
  var length = MCARD.__config.slots || 4 ;
  var slots  = [ ] ;
  for( var i = 0 ; i < length ; i++ ) {
    slots.push( MCARD.getSlot( i ) ) ;
    if( typeof slots[ i ].date === "string" ) 
      { slots[ i ].DATE = new Date( slots[ i ].date ) ; }
  } return slots ;
} ;

/**
 * Get a specific slot from the memory card. returns an empty slot if the defined slot doesn't exists. 
 * @abstract
 * 
 * @param {!number} slot_index - The slot to seek data. Must be less than the number of slots defined in the config (Default: 4).
 * 
 * @return {Object} - The slot object with its data if isn't empty. If the slot is already empty, will returns a object but with a property called "empty" instead. 
 *
 * @example
 * ```js
 * slot = MCARD.getSlot( 2 ) ;
 * slot = {
 *  index : 2 ,
 *  title : "Slot 3" // Why 3? 'cause index 0 is "Slot 1".
 *  empty : false ,
 *  data  : {
 *    // ALL DATA AVAILABLE
 *  }
 * } ;
 * ```
 */
MCARD.getSlot = ( index ) => {
  var $s = MCARD.__config.slots || 4 ;
  if( index >= $s ) 
    { throw new Error( 'The defined index number is invalid. Must be less than the pre-configured MemoryCard.slots (' + $s + ')' ) ; }
  if( MCARD.__cache.slots && MCARD.__cache.slots[ index ] ) 
    { return MCARD.__cache.slots[ index ] ; }
  MCARD.read( ) ;
  var slot = MCARD.__cache.slots[ index ] || {
    index : index ,
    empty : true ,
    title : `Slot ${ index + 1 }`
  } ;
  // FINALLY RETURN SLOT [v]
  return slot ;
}

/**
 * Reads directly from MemoryCard file and return all card data. Not recommended, could affect to game performance if you use it frecuently.
 *
 * @return {Object} - all decrypted data of the file (creation_date, key and slots).
 */
MCARD.read = ( ) => {
  var data   = { } ;
  var length = MCARD.__config.slots || 4 ;
  var file   = MCARD.__config.file || './memorycard.data' ;
  var create = ( ) => {
    // CREATE NEW MEMORY WITH DEFINED CONFIG [v]
    var $m = { 
      key   : MCARD.__config.key || null ,
      date  : ( new Date( ) ).toISOString( ) ,
      slots : [ ]
    } ; 
    for( var i = 0 ; i < length ; i++ ) {
      $m.slots.push( {
        index : i ,
        empty : true ,
        title : `Slot ${ i + 1 }`
      } ) ;
    } return $m ;
  } ;
  if( isNodejs( ) || isElectron( ) ) {
    if( fs.existsSync( file ) ) {
      var raw = fs.readFileSync( file, 'utf8' ) ;
      var str ;
      try { str = cryptr.decrypt( raw ) ; }
      catch( ex ) { throw new Error( 'Couldn\'t decrypt MemoryCard file. ' + ex.toString( ) ) ; }  
      data = JSON.parse( str ) ;
    } else {
      data = create( ) ;
      var encoded ;
      try { encoded = cryptr.encrypt( JSON.stringify( data ) ) ; }
      catch( ex ) { throw new Error( 'Couldn\'t encrypt MemoryCard file. ' + ex.toString( ) ) ; }  
      fs.writeFileSync( file, encoded ) ;
    }
  } else {
    var raw = MCARD.__config.storage.getItem( 'virtualMemoryCard_data' ) ;
    if( raw ) {
      var str = DECRYPT( raw ) ;
      try { data = JSON.parse( str ) ; }
      catch( ex ) { throw new Error( 'Couldn\'t decrypt MemoryCard file. ' + ex.toString( ) ) ; }    
    } else {
      data = create( ) ;
      var str = ENCRYPT( JSON.stringify( data ) ) ;
      MCARD.__config.storage.setItem( 'virtualMemoryCard_data', str ) ;
    }     
  } /* clean */
  for( var i = 0 ; i < data.length ; i++ ) {
    if( !data[ i ] ) {
      data[ i ] = {
        index : i ,
        empty : true ,
        title : `Slot ${ i + 1 }`
      } ;
    }
  } /* ===== */
  MCARD.__cache = data ;
  MCARD.fire( 'card-loaded', { card_data : data } ) ;
  return data ;
} ;

/**
 * This method will overwrite the entire slot if the slot is already in use. If you only want to save a little change like "coins" collected, you maybe want to use save( ) method instead. See docs, "Write vs Save" for more useful information.
 * 
 * @param {!Number} slot_index - Select the slot index where will be saved the data. 
 * @param {?String} title - Define a custom title for the slot, example: "Chapter III: The Cave". Default: "Slot $n", Where $n is the index of the slot.
 * @param {!Object} data - Object that contains all data to save in the slot. If you have set "strict_mode" on, all data will be processed. See docs for more information.
 * 
 * @example
 * ```js
 * MCARD.write( 2, "Cookies Island", {
 *  username : "Diablo Luna"
 *  scene : 3 ,
 *  inventory : {
 *    watermelons : 8 ,
 *    lemon_pie : true
 *  }
 * } , "XMJSKO92" ) ;
 * ```
 */
MCARD.write = ( slot, title, data ) => {
  if( typeof slot  !== "number" ) { throw new Error( 'Please define a slot_index to save data.' ) ; }
  if( typeof title === "object" ) { data = title ; title = `Slot ${ slot }` ; }
  if( typeof data  !== "object" ) { throw new Error( 'No data defined to save. Please set a object to write the data_slot in the memorycard.' ) ; }
  if( !MCARD.__cache.slots ) { MCARD.read( ) ; }
  if( slot >= MCARD.__cache.slots.length ) 
    { throw new Error( 'The slot_index must be less than the slots length available in the MemoryCard (' + MCARD.__cache.slots.length + ')' ) ; }
  const o = MCARD.__cache.slots[ slot ].data ;
  var   n = data ;
  if( MCARD.configObject.strict_mode === true ) {
    var t = MCARD.configObject.template ;
    if( t === undefined ) { throw new Error( 'Strict_Mode is enabled but can\'t find the "template slot" to clean the data in write( )' ) ; }
    // All missed properties [v]
    for( var i in o ) { if( !n[ i ] ) { n[ i ] = o[ i ] } }
    // Compare with template and fix it [v]
    for( var x in n ) {
      if( typeof t[ x ] === "undefined" ) { delete n[ x ] ; }
      n[ x ] = CLEAN( t[ x ], n[ x ] ) ;
    } /* Fix [^] */   
    for( var i in t ) {
      if( typeof n[ i ] === "undefined" ) { n[ i ] = t[ i ] ; }
    } /* Clean [^] */
  } /* FIX THE DATA TO SAVE [^] */
  try {
    MCARD.__cache.slots[ slot ].title = title || `Slot ${ slot + 1 }` ;
    MCARD.__cache.slots[ slot ].data  = n ;
    MCARD.__cache.slots[ slot ].date  = ( new Date( ) ).toISOString( ) ;
    MCARD.__cache.slots[ slot ].empty = false ;
    var str = JSON.stringify( MCARD.__cache ) ;
    if( isNodejs( ) || isElectron( ) ) {
      var enc = cryptr.encrypt( str ) ;
      fs.writeFileSync( MCARD.configObject.file, enc ) ;
    } else {
      var enc = ENCRYPT( str ) ;
      MCARD.__config.storage.setItem( 'virtualMemoryCard_data', enc ) ;
    }
  } catch( ex ) {
    MCARD.__cache.slots[ slot ] = o ;
    throw new Error( 'WRITE_MEMORYCARD_SLOT_ERROR ::' + ex.toString( ) ) ;
  } MCARD.fire( 'save', {
    type       : 'write' ,
    slot_index : slot ,
    slot_data  : n
  } ) ;
  /* RESPONSE [v] */ 
  return true ;
} ;


/**
 * This method allows you to save only one or more properties of the specified slot. If the slot is empty, you will get an error.
 * 
 * @param {!Number} slot_index - Select the slot index where will be saved the data. 
 * @param {?String} title - Define a custom title for the slot, example: "Chapter III: The Cave". Default: "Slot $n", Where $n is the index of the slot.
 * @param {!Object} data - Object that contains all data to save in the slot.
 * 
 * @example
 * ```js
 * MCARD.save( 2, "Cookies Island", {
 *  scene : 3
 * } , "XMJSKO92" ) ;
 * ```
 */
MCARD.save = ( slot, title, data ) => {
  if( typeof slot  !== "number" ) { throw new Error( 'Please define a slot_index to save data.' ) ; }
  if( typeof title === "object" ) { data = title ; title = null ; }
  if( typeof data  !== "object" ) { throw new Error( 'No data defined to save. Please set a object to write the data_slot in the memorycard.' ) ; }
  if( !MCARD.__cache.slots ) { MCARD.read( ) ; }
  if( slot >= MCARD.__cache.slots.length ) 
    { throw new Error( 'The slot_index must be less than the slots length available in the MemoryCard (' + MCARD.__cache.slots.length + ')' ) ; }
  var o = MCARD.__cache.slots[ slot ].data ;
  if( !o || o.empty === true ) { throw new Error( `The Slot ${ slot } is Empty. You can only use save( ) in already used slots.` ) ; }
  var n = data ;
  if( MCARD.configObject.strict_mode === true ) {
    var t = MCARD.configObject.template ;
    if( t === undefined ) { throw new Error( 'Strict_Mode is enabled but can\'t find the "template slot" to clean the data in write( )' ) ; }
    // Compare with template and fix it [v]
    for( var x in n ) {
      if( typeof o[ x ] === "undefined" ) { continue ; }
      n[ x ] = CLEAN( o[ x ], n[ x ] ) ;
    } /* Fix BY Original [^] */
    for( var i in o ) {
      if( typeof n[ i ] === "undefined" ) { n[ i ] = o[ i ] ; }
    } /* Add Missed from Original [^] */
    for( var x in n ) {
      if( typeof t[ x ] === "undefined" ) { delete n[ x ] ; }
      n[ x ] = CLEAN( t[ x ], n[ x ] ) ;
    } /* Fix BY Template [^] */   
    for( var i in t ) {
      if( typeof n[ i ] === "undefined" ) { n[ i ] = t[ i ] ; }
    } /* Add Missed from Template [^] */
  } /* FIX THE DATA TO SAVE [^] */
  try {
    MCARD.__cache.slots[ slot ].title = title || MCARD.__cache.slots[ slot ].title || `Slot ${ slot + 1 }` ;
    MCARD.__cache.slots[ slot ].data  = n ;
    MCARD.__cache.slots[ slot ].date  = ( new Date( ) ).toISOString( ) ;
    MCARD.__cache.slots[ slot ].empty = false ;
    var str = JSON.stringify( MCARD.__cache ) ;
    if( isNodejs( ) || isElectron( ) ) {
      var enc = cryptr.encrypt( str ) ;
      fs.writeFileSync( MCARD.configObject.file, enc ) ;
    } else {
      var enc = ENCRYPT( str ) ;
      MCARD.__config.storage.setItem( 'virtualMemoryCard_data', enc ) ;
    }
  } catch( ex ) {
    MCARD.__cache.slots[ slot ] = o ;
    throw new Error( 'WRITE_MEMORYCARD_SLOT_ERROR ::' + ex.toString( ) ) ;
  } MCARD.fire( 'save', {
    type       : 'save' ,
    slot_index : slot ,
    slot_data  : n
  } ) ;
  /* RESPONSE [v] */ 
  return true ;
} ;


/**
 * Read and return the data of the specified slot_index. This method will return `null` if the selected slot is empty.
 * 
 * @param {!Number} slot_index - The slot index to load data. 
 * 
 * @example
 * ```js
 * MCARD.load( 1 ) ;
 * ```
 */
MCARD.load = ( slot ) => {
  if( typeof slot !== "number" ) 
    { throw new Error( 'Please declare a slot_index to load data from MemoryCard.' ) ; }
  if( !MCARD.__cache.slots ) { MCARD.read( ) ; }
  var o = MCARD.getSlot( slot ) ;
      o = !o || o.empty !== false ? null : o.data ;
  MCARD.fire( 'load', {
    slot_index : slot ,
    slot_data  : o
  } ) ;
  /* RESPONSE [v] */ 
  return o ;
} ;


/**
 * Copy an already used slot to create new one.
 * 
 * @param {!Number} ref_index - The reference slot_index to copy data. 
 * @param {!Number} dest_index - The destination slot_index to paste data.
 * 
 * @example
 * ```js
 * MCARD.copy( 0, 3 ) ;
 * ```
 */
MCARD.copy = ( ref_index, dest_index ) => {
  if( typeof ref_index !== "number" ) 
    { throw new Error( 'Please declare a ref_index to copy data.' ) ; }
  if( typeof dest_index !== "number" ) 
    { throw new Error( 'Please declare a dest_index to paste data.' ) ; }
  if( !MCARD.__cache.slots ) { MCARD.read( ) ; }
  var r = MCARD.getSlot( ref_index ) ;
  if( !r || r.empty !== false ) 
    { throw new Error( 'The reference-slot doesn\'t have data to copy in the destination-slot. Please select another slot.' ) ; }
  MCARD.write( dest_index, r.data, r.title ) ;
  MCARD.fire( 'copy', {
    slot_index     : dest_index ,
    slot_ref_index : ref_index
  } ) ;
  /* RESPONSE [v] */ 
  return true ;
} ;


/**
 * Delete an already used slot and restore it as *empty slot*.
 * 
 * @param {!Number} slot_index - The index of the slot to delete from the MemoryCard.
 * @param {?String} key - The key to access to the MemoryCard, only if it required.
 * 
 * @example
 * ```js
 * MCARD.delete( 1 ) ;
 * ```
 */
MCARD.delete = ( slot ) => {
  if( typeof slot !== "number" ) 
    { throw new Error( 'Please declare a slot_index to delete data.' ) ; }
  if( !MCARD.__cache.slots ) { MCARD.read( ) ; }
  const o = MCARD.__cache.slots[ slot ] ;
  try {
    MCARD.__cache.slots[ slot ].title = `Slot ${ slot + 1 }` ;
    MCARD.__cache.slots[ slot ].empty = true ;
    delete MCARD.__cache.slots[ slot ].date ;
    delete MCARD.__cache.slots[ slot ].data ;
    var str = JSON.stringify( MCARD.__cache ) ;
    if( isNodejs( ) || isElectron( ) ) {
      var enc = cryptr.encrypt( str ) ;
      fs.writeFileSync( MCARD.configObject.file, enc ) ;
    } else {
      var enc = ENCRYPT( str ) ;
      MCARD.__config.storage.setItem( 'virtualMemoryCard_data', enc ) ;
    }
  } catch( ex ) {
    MCARD.__cache.slots[ slot ] = o ;
    throw new Error( 'DELETE_MEMORYCARD_SLOT_ERROR ::' + ex.toString( ) ) ;
  } MCARD.fire( 'delete', { slot_index : slot } ) ;
  /* RESPONSE [v] */ 
  return true ;
} ;


/**
 * Delete all saved slots and set all as *empty slot*.
 * 
 * 
 * @example
 * ```js
 * MCARD.format( ?key ) ;
 * ```
 */
MCARD.format = ( ) => {
  if( !MCARD.__cache.slots ) { MCARD.read( ) ; }
  const original = MCARD.__cache ;
  try {
    for( var i = 0 ; i < MCARD.__cache.slots.length ; i++ ) {
      MCARD.delete( i ) ;
    } /* DELETE EVERY SLOT [^] */
  } catch( ex ) {
    MCARD.__cache = original ;
    throw new Error( 'FORMAT_MEMORYCARD_ERROR ::' + ex.toString( ) ) ;
  } MCARD.fire( 'format', { card_data : MCARD.__cache } ) ;
  /* RESPONSE [v] */ 
  return true ; 
} ;

/**
 * [WARNING] Do you prefer to delete entire *MemoryCard* even the file or record in the LocalStorage to create new one?. This method will delete entire data and file.
 * 
 * @example
 * ```js
 * MCARD.reset( ) ;
 * ```
 */
MCARD.reset = ( ) => {
  if( isNodejs( ) || isElectron( ) ) {
    fs.unlinkSync( MCARD.configObject.file ) ;
  } else {
    MCARD.__config.storage.removeItem( 'virtualMemoryCard_data' ) ;
  } return true ;
} ;

/**
 * Returns an encrypted *MemoryCard* data to save in an external drive like a cloud-storage.
 * 
 * @return {String} - Encrypted MemoryCard data.
 * 
 * @example
 * ```js
 * var data = MCARD.getCardData( ) ;
 * ```
 */
MCARD.getCardData = ( ) => {
  if( isNodejs( ) || isElectron( ) ) {
    var f = MCARD.configObject.file ;
    if( !fs.existsSync( f ) ) { return null ; }
    return fs.readFileSync( f, 'utf8' ) ;
  } else {
    return MCARD.__config.storage.getItem( 'virtualMemoryCard_data' ) || null ;
  }
} ;

/**
 * Set custom encrypted *MemoryCard* data to load slots and *user-progress*. You can use this method to load a *MemoryCard* backup or data requested from a cloud-storage.
 * 
 * @param {!String} MemoryCard_Data - (Required) A valid encrypted string that contains all *MemoryCard* data. 
 * 
 * @example
 * ```js
 * MCARD.setCardData( 'all-encrypted-data-of-my-memorycard' ) ;
 * ```
 */
MCARD.setCardData = ( raw ) => {
  if( typeof raw === "undefined" ) { throw new Error( 'Please provide a string with all encrypted data of your MemoryCard.' ) ; }
  var obj ;
  if( isNodejs( ) || isElectron( ) ) {
    try { obj = JSON.parse( cryptr.decrypt( raw ) ) ; }
    catch( ex ) { throw new Error( 'Invalid MemoryCard Data. ' + ex.toString( ) ) ; }  
    fs.writeFileSync( f, raw ) ;
  } else {
    try { obj = JSON.parse( DECRYPT( raw ) ) ; }
    catch( ex ) { throw new Error( 'Invalid MemoryCard Data. ' + ex.toString( ) ) ; }    
    MCARD.__config.storage.setItem( 'virtualMemoryCard_data', raw ) ;
  } /* VALID THE NEW DATA AND SAVE IT [^] */
  return MCARD.read( ) ;
} ;


MCARD.on = ( type, cb ) => {
  if( typeof type !== "string" ) { throw new Error( 'Please define an event type as first parameter :: MemoryCard.on( eventType<string>, callback<function> )' ) ; } 
  if( typeof cb !== "function" ) { throw new Error( 'Please define an callback as second parameter :: MemoryCard.on( eventType<string>, callback<function> )' ) ; }
  return MCARD.eventListeners.push( { type , fn : cb } ) ;
} ;

MCARD.fire = ( type, data ) => {
  var $f = MCARD.eventListeners.filter( c => c.type === type ) ;
  for( var i = 0 ; i < $f.length ; i++ ) {
    try {
      $f[ i ].fn( data || { } ) ;
    } catch( ex ) {
      console.error( 'Can\'t call "' + type + '" event callback ::', ex ) ;
    }
  }
} ;


/* ASYNC OPTIONS [v] */
MCARD.writeAsync = ( slot, title, data, key ) => {
  return new Promise( ( res, rej ) => {
    var x = MCARD.write( slot, title, data, key ) ;
    return res( x ) ;
  } ) ;
} ;

MCARD.saveAsync = ( slot, title, data, key ) => {
  return new Promise( ( res, rej ) => {
    var x = MCARD.save( slot, title, data, key ) ;
    return res( x ) ;
  } ) ;
} ;

MCARD.loadAsync = ( slot ) => {
  return new Promise( ( res, rej ) => {
    var x = MCARD.load( slot ) ;
    return res( x ) ;
  } ) ;
} ;

MCARD.readAsync = ( ) => {
  return new Promise( ( res, rej ) => {
    var x = MCARD.read( ) ;
    return res( x ) ;
  } ) ;
} ;

MCARD.copyAsync = ( ref_index, dest_index, key ) => {
  return new Promise( ( res, rej ) => {
    var x = MCARD.copy( ref_index, dest_index, key ) ;
    return res( x ) ;
  } ) ;
} ;

MCARD.deleteAsync = ( slot, key ) => {
  return new Promise( ( res, rej ) => {
    var x = MCARD.delete( slot, key ) ;
    return res( x ) ;
  } ) ;
} ;

MCARD.formatAsync = ( key ) => {
  return new Promise( ( res, rej ) => {
    var x = MCARD.format( key ) ;
    return res( x ) ;
  } ) ;
} ;

MCARD.resetAsync = ( ) => {
  return new Promise( ( res, rej ) => {
    var x = MCARD.reset( ) ;
    return res( x ) ;
  } ) ;
} ;


/* FUNCTIONS [v] */
function CLEAN( t, n ) {
  if( Array.isArray( t ) && !Array.isArray( n ) ) {
         if( typeof n === "number" ) { return [ n ] ; }
    else if( typeof n === "string" ) { return n.split( ',' ) ; }
    else { return t }
  } else if( !Array.isArray( t ) && Array.isArray( n ) ) {
    if( typeof t === "string" ) 
      { return n.join( ',' ) ; }
    else 
      { return t }
  } else if( typeof t !== typeof n  ) {
         if( typeof t === "string"  ) { return n.toString( ) ; }
    else if( typeof t === "number"  ) { return ( typeof n === "string" ? parseFloat( n ) : t ) || t ; }
    else if( typeof t === "boolean" ) { return n == 1 ? true : n == 0 ? false : n == "true" ? true : n == "false" ? false : t ; }
    else { return t ; }
  } else {
    return n ;
  } /* [^] */
}

function GET_RANDOM_STRING( length ) {
  var result           = '' ,
     characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' ,
     charactersLength = characters.length ;
  for ( var i = 0 ; i < length ; i++ ) {
    result += characters.charAt( Math.floor( Math.random( ) * charactersLength ) ) ;
  } return result ;
}

function ENCRYPT( str ) {
  str = typeof MCARD.configObject.key === "string" 
      ? str + '@k:' + MCARD.configObject.key : str ;
  str = btoa( str ) ;
  str = str.reverse( ) ;
  str = str.hexEncode( ) ;
  str = str.reverse( ) ;
  return str ;
}

function DECRYPT( str ) {
  str = str.reverse( ) ;
  str = str.hexDecode( ) ;
  str = str.reverse( ) ;
  str = atob( str ) ;
  var i = str.indexOf( '@k:' ) ;
  if( i !== -1 ) {
    var k = str.substring( i + 3, str.length ) ;
    if( k !== MCARD.configObject.key ) 
      { throw new Error( 'Invalid MemoryCard_Key' ) ; }
  } /* VALIDATING KEY [^] */
  return str.replace( /(@k:).*$/, "" ) ;
}

String.prototype.reverse = function ( ) {
  return this.split( "" ).reverse( ).join( "" ) ;
} ;

String.prototype.hexEncode = function( ) {
  var hex, i ;
  var result = "" ;
  for( i = 0 ; i < this.length ; i++ ) {
    hex = this.charCodeAt( i ).toString( 16 ) ;
    result += ( "000"+hex ).slice( -4 ) ;
  } return result ;
} ;

String.prototype.hexDecode = function( ) {
  var j ;
  var hexes = this.match( /.{1,4}/g ) || [ ] ;
  var back = "" ;
  for( j = 0 ; j < hexes.length ; j++ ) {
    back += String.fromCharCode( parseInt( hexes[ j ], 16 ) ) ;
  } return back ;
} ;

/* define module [v] === */
if( typeof module !== 'undefined' && module.exports ) {
  module.exports  = MCARD ;
  root.MCARD      = MCARD ;
  root.MemoryCard = MCARD ;
} else { 
  root.MCARD      = MCARD ;
  root.MemoryCard = MCARD ;
} /* =================== */
/* define module [^] === */