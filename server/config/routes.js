'use strict';

// *****************************************************************************
//  Module Interface
// *****************************************************************************

module.exports = {
  configureRoutes: configureRoutes
};

// *****************************************************************************
//  Interface Functions
// *****************************************************************************

function configureRoutes( app, passport ) {

  app.use( '/api/cities/',        require( '../api/cities' ) );

  // All other routes return 404
  app.route( '/*' )
    .all( function( request, response, next ) {
      response.status( 404 ).send( "Not Found" );
    } );
}
