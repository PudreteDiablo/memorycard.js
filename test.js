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

m.save( 1, {
  rupees : 2
} ,'tacos' )

console.log( m.getAll( ) )
