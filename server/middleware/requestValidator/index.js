'use strict';

// *****************************************************************************
//  Dependencies
// *****************************************************************************

// External Modules
var _ = require( 'lodash' );
var jsonValidator = require( 'is-my-json-valid' );

// Internal Modules
var responseSender = require( '../../components/responseSender' );
var BackendError = require( '../../components/BackendError' );

// Schemas
var businessSchema = require( './jsonSchemas/businessSchema' );

// *****************************************************************************
//  Module Interface
// *****************************************************************************

module.exports = {
  validateBusinessUpdateRequest: validateBusinessUpdateRequest
};

// *****************************************************************************
//  Interface Functions
// *****************************************************************************

function validateBusinessUpdateRequest( request, response, next ) {
  var updatedBusiness = request.body;
  var validate = jsonValidator( businessSchema );
  if ( !validate( updatedBusiness ) ) {
    var error = new BackendError.ValidationError( 'There have been validation errors',
    { errors: validate.errors }, 400 );
    return responseSender.sendResponse( error, null, response );
  } else {
    next();
  }
}
