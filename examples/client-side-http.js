MemoryCard = require( 'memorycard-js' ) ; // <= Only for Node.js or Electron
// In other platforms like cordova and browsers, a default global object will
// created with name 'MemoryCard' or 'MCARD'.

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