'use strict';

/* jshint expr:true */

var rewire = require( 'rewire' );
var sinon = require( 'sinon' );

var app = require( '../../app' ); // jshint ignore:line
var requestValidator = rewire( './index' );

describe( 'requestValidator', function() {
  describe( '#validateBusinessUpdateRequest()', function() {
    var validateBusinessUpdateRequest = requestValidator.__get__( 'validateBusinessUpdateRequest' );
    context( 'when the request is valid', function() {
      it( 'should invoke next()', function() {
        var validBody = { id: '1234', name: 'business name', address: 'calle falsa, 123' };
        var nextSpy = sinon.spy();
        validateBusinessUpdateRequest( { body: validBody }, {},  nextSpy );
        nextSpy.calledOnce.should.be.true;
      } );
    } );

    context( 'when business does not match the schema', function() {
      var revertResponseSender;

      it( 'send a 400 error', function() {
        var wrongBody = { id: '1234' }; // name and address missing
        var sendResponseStub = sinon.spy();
        revertResponseSender = requestValidator.__set__( 'responseSender', { sendResponse: sendResponseStub } );
        validateBusinessUpdateRequest( { body: wrongBody }, {} );
        sendResponseStub.calledOnce.should.be.true;
        var error = sendResponseStub.getCall( 0 ).args[ 0 ];
        error.message.should.equal( 'There have been validation errors 400' );
      } );

      after( function() {
        revertResponseSender();
      } );
    } );
  } );

} );
