'use strict';

// *****************************************************************************
//  Dependencies
// *****************************************************************************

// Core Modules
var path = require( 'path' );

// External Modules
var _ = require( 'lodash' );

// Internal Modules
var logger = require( '../../components/Logger' ).getLogger();

// *****************************************************************************
//  Module Interface
// *****************************************************************************

module.exports = {
  sendResponse:     sendResponse
};

// *****************************************************************************
//  Interface Functions
// *****************************************************************************

function sendResponse( error, result, response ) {
  if ( error ) {
    handleErrorResponse( error, response );
  } else {
    response.status( 200 ).send( result );
  }
}

// *****************************************************************************
//  Private Functions
// *****************************************************************************

function handleErrorResponse( error, response ) {
  if ( error.isBackendError ) {

    // If it is a 4xx error, it should not be logged as an error
    if ( _.startsWith( parseInt( error.statusCode ), '4' ) ) {
      logger.info( error );
    } else {
      logger.error( error );
    }
    return response.status( error.statusCode ).send( _.pick( error, [ 'message', 'details' ] ) );
  } else {
    logger.error( error );
    response.status( 500 ).send( error );
  }
}
