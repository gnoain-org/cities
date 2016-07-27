/* jshint expr:true */

'use strict';

var app = require( '../app' );
var request = require( 'supertest' );
var should = require( 'chai' ).should(); // jshint ignore:line

describe( 'Backend API', function() {
  this.timeout( 0 );
  context( 'when the path is the resource is not recognized', function() {
    it( 'should return 404', function( done ) {
      request( app )
        .get( '/api/wrongPath' )
        .expect( 404, done );
    } );
  } );
} );
