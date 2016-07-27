'use strict';

// jshint expr:true

var httpMocks = require( 'node-mocks-http' );
var rewire = require( 'rewire' );
var should = require( 'chai' ).should(); // jshint ignore:line
var sinon = require( 'sinon' );

var app = require( '../../app' ); // jshint ignore:line
var responseSender = rewire( './index.js' );
var BackendError = require( '../BackendError' );

describe( 'responseSender', function() {
  var sendResponse = responseSender.__get__( 'sendResponse' );
  describe( '#sendResponse()', function() {
    context( 'when an error is received', function() {
      var handleErrorResponseSpy = sinon.spy();
      var revertErrorHandler;
      before( function() {
        revertErrorHandler = responseSender.__set__( 'handleErrorResponse', handleErrorResponseSpy );
      } );

      it( 'should invoke the error handler', function() {
        sendResponse( new Error( 'error' ), {}, {} );
        handleErrorResponseSpy.calledOnce.should.be.true;
      } );

      after( function() {
        revertErrorHandler();
      } );
    } );

    context( 'when no error is received', function() {
      it( 'should send 200 and the result', function() {
        var response = httpMocks.createResponse();
        sendResponse( null, 'result', response );
        response.statusCode.should.equal( 200 );
        var result = response._getData();
        result.should.equal( 'result' );
      } );
    } );
  } );

  describe( '#handleErrorResponse()', function() {
    var handleErrorResponse = responseSender.__get__( 'handleErrorResponse' );
    context( 'when the error is a BackendError', function() {
      context( 'and it is a 4xx error', function() {
        it( 'should log the error and send it', function() {
          var error = new BackendError.NotFoundError( 'error', {}, 404 );
          var response = httpMocks.createResponse();
          handleErrorResponse( error, response );
          response.statusCode.should.equal( 404 );
        } );
      } );

      context( 'and it is not a 4xx error', function() {
        it( 'should log the error and send it', function() {
          var error = new BackendError.NotFoundError( 'error', {}, 500 );
          var response = httpMocks.createResponse();
          handleErrorResponse( error, response );
          response.statusCode.should.equal( 500 );
        } );
      } );
    } );

    context( 'when the error is not a BackendError', function() {
      it( 'should log the error and send it as a 500', function() {
        var error = new Error( 'error' );
        var response = httpMocks.createResponse();
        handleErrorResponse( error, response );
        response.statusCode.should.equal( 500 );
      } );
    } );
  } );
} );
