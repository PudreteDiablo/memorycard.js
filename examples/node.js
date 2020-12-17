MemoryCard = require( '../dist/memorycard.js' ) ;
// Change to "memorycard-js" [^] 

// CONFIGURE PACKAGE BEFORE CALL ANY METHOD [v]
MemoryCard.config( {
  file  : './memorycard.data' ,
  slots : 8 ,
  strict_mode : true ,
  template : {
    rupees : 0 ,
    map : "home"
  }
} ) ;

// DEFINE EVENTS FIRST (Recommended) [v]
MemoryCard.on( 'load', ( ev ) => {
  console.log( 'EVENT: New MemoryCard-Slot loaded =>', ev.slot_data ) ;
} ) ;

MemoryCard.on( 'save', ( ev ) => {
  console.log( `EVENT: Slot ${ ev.slot_index + 1 } has saved =>`, ev.slot_data ) ;
} ) ;

// READY TO CALL METHODS [v]
function saveGame( data ) {
  // Save in slot 1 - slot_index = 0 [v]
  MemoryCard.save( 0, 'My Title for Slots Summary', data ) ;
  // Once saved, return true ;
  return true ;
}

function loadGame( ) {
  // Load slot 1 ;
  // If doesn't exists, it will return NULL.
  return MemoryCard.load( 0 ) ;
}

// =========================
// TESTING SAVE AND LOAD [v]
saveGame( { rupees : 8 } ) ;
console.log( 'Game Data saved without errors, continue with script...' ) ;
var slotData = loadGame( ) ;
console.log( 'Game Loaded =>', slotData ) ;