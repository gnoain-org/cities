'use strict';

// *****************************************************************************
// Main application file
// *****************************************************************************

// Load configuration into environment variables
require( 'dotenv' ).load();

// Initialize Logger
var Logger = require( './components/Logger' );
Logger.initialize();

// Create Server
var express = require( 'express' );
var app = express();
var server = require( 'http' ).createServer( app );

// Configure Server
require( './config/express' ).configureApp( app );
require( './config/routes' ).configureRoutes( app );

var logger = Logger.getLogger();
server.listen( process.env.PORT, process.env.IP, function() {
  logger.info( 'Server is up in http://' + process.env.IP + ':' + process.env.PORT + ' in %s mode', process.env.NODE_ENV );
} );

console.log('PENE');

module.exports = app;
