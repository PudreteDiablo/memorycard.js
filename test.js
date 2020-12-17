const m = require( './index.js' ) ;

m.config( {
  key : 'tacos' ,
  temp : false ,
  strict_mode : true ,
  template : {
    rupees : 0 ,
    map : "home"
  }
} )


m.write( 1, "My Awesome Title", {
  rupees : "8" ,
  map : true
} , 'tacos' ) ;

//m.format( 'tacos' ) ;

console.log( m.getAll( ) )