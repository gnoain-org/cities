'use strict';

// *****************************************************************************
//  Dependencies
// *****************************************************************************

// Node Modules
var path = require( 'path' );

// External Modules
var _ = require( 'lodash' );
var express = require( 'express' );

// External Express Middlewares
var bodyParser = require( 'body-parser' );
var cors = require( 'cors' );
var errorHandler = require( 'errorhandler' );
var morgan = require( 'morgan' );

// Internal Modules
var logger = require( '../components/Logger' ).getLogger();

// *****************************************************************************
//  Module Interface
// *****************************************************************************

module.exports = {
  configureApp: configureApp
};

// *****************************************************************************
//  Interface Functions
// *****************************************************************************

function configureApp( app ) {
  app.use( cors( {
    methods: 'GET,PUT,DELETE',
    allowHeaders: 'Origin, X-Requested-With, Content-Type, Accept'
  } ) );
  app.use( bodyParser.urlencoded( { extended: false } ) );
  app.use( bodyParser.json() );
  app.use( express.static( path.resolve( __dirname + '../../../public' ) ) );
  app.use( '/bower_components', express.static( path.resolve( __dirname + '../../../bower_components' ) ) );


  morgan.token( 'body', function( request, response ) {
    return JSON.stringify( request.body, null, 2 );
  } );

  app.use( morgan( ':method :url :body', {
    stream: logger.stream,
    immediate: true
  } ) );

  if ( 'development' === process.env.NODE_ENV ) {
    app.use( errorHandler() ); // Error handler - has to be last
  }
}
