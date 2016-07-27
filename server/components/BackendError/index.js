'use strict';

// *****************************************************************************
//  Dependencies
// *****************************************************************************

//External Modules
var createCustomError = require( 'custom-error-generator' );

// *****************************************************************************
//  Module Interface
// *****************************************************************************

// Parent Error: All errors captured inherit from it
var BackendError = createCustomError( 'BackendError', null, function createError( message, details, statusCode ) {
  this.isBackendError = true;
  this.statusCode = statusCode;
  this.message = message;
  this.details = details;
  this.stack = Error.captureStackTrace( this );
} );

module.exports = {
  NotFoundError:   createCustomError( 'NotFoundError', null, BackendError ),
  ValidationError: createCustomError( 'ValidationError', null, BackendError )
};
