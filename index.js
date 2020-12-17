const { electron } = require('process');

/* 
  Copyright 2021 Diablo Luna [@PudreteDiablo]
  Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
var root       = typeof window !== "undefined" ? window : this ;
var isElectron = ( ) => typeof window !== "undefined" && window.process && window.process.platform ? true : false ;
var isNodejs   = ( ) => typeof module !== 'undefined' && module.exports ? true : false ;
var isCordova  = ( ) => typeof window !== "undefined" && window.hasOwnProperty( 'cordova' ) ? true : false ;
var fs         = isNodejs( ) || isElectron( ) ? require( 'fs' ) : { } ;
var path       = isNodejs( ) || isElectron( ) ? require( 'path' ) : { } ;
var Cryptr     = isNodejs( ) || isElectron( ) ? require( 'cryptr' ) : null ;
var cryptr     = Cryptr ? new Cryptr( 'WATERMELON-CIGARETTES' ) : { } ;
var MCARD      = { 
  get loaded( )       { return this.__config.loaded ; } ,
  get configObject( ) { return this.__config ; }
} ;

MCARD.__config = {
  slots   : 4 , 
  file    : './memorycard.data' ,
  storage : isNodejs( ) || isElectron( ) ? { } : window.localStorage ,
  key     : null ,
  temp    : false ,
  manual  : false
} ;

MCARD.__cache = { } ;

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
    if( isElectron( ) ) {
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
  if( MCARD.__cache.slots[ index ] ) 
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
      var str = atob( raw ) ;
      try { data = JSON.parse( str ) ; }
      catch( ex ) { throw new Error( 'Couldn\'t decrypt MemoryCard file. ' + ex.toString( ) ) ; }    
    } else {
      data = create( ) ;
      var str = btoa( JSON.stringify( data ) ) ;
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
  return data ;
} ;

/**
 * This method will overwrite the entire slot if the slot is already in use. If you only want to save a little change like "coins" collected, you maybe want to use save( ) method instead. See docs, "Write vs Save" for more useful information.
 * 
 * @param {!Number} slot_index - Select the slot index where will be saved the data. 
 * @param {?String} title - Define a custom title for the slot, example: "Chapter III: The Cave". Default: "Slot $n", Where $n is the index of the slot.
 * @param {!Object} data - Object that contains all data to save in the slot. If you have set "strict_mode", you data object must match with the pre-defined template, even it properties types.
 * @param {?String} key - The required key to save in the memorycard (Only if you have defined a key in the config).
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
MCARD.write = ( slot, title, data, key ) => {
  if( typeof slot  !== "number" ) { throw new Error( 'Please define a slot_index to save data.' ) ; }
  if( typeof title === "object" ) { data = title ; title = `Slot ${ slot }` ; }
  if( typeof data  !== "object" ) { throw new Error( 'No data defined to save. Please set a object to write the data_slot in the memorycard.' ) ; }
  
} ;


/* FUNCTIONS [v] */
function GET_RANDOM_STRING( length ) {
  var result           = '' ,
     characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' ,
     charactersLength = characters.length ;
  for ( var i = 0 ; i < length ; i++ ) {
    result += characters.charAt( Math.floor( Math.random( ) * charactersLength ) ) ;
  } return result ;
}

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