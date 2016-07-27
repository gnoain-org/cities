'use strict';

/* jshint expr:true */
var _ = require( 'lodash' );
var chai = require( 'chai' ).should();
var httpMocks = require( 'node-mocks-http' );
var rewire = require( 'rewire' );
var sinon = require( 'sinon' );

var app = require( '../../app' ); // jshint ignore:line
var citiesApi = rewire( './index' );

var defaultCities = require( '../../data/cities.json' );

// Optimize data source by keying objects by the most used search criteria
var cities = _.keyBy( defaultCities, 'city' );
_.forEach( cities, function( city ) {
  city.businesses = _.keyBy( city.businesses, 'id' );
} );

describe( 'Cities API', function() {
  describe( '#getAllCities()', function() {
    var getAllCities = citiesApi.__get__( 'getAllCities' );

    it( 'should return the cities object', function( done ) {
      var request = httpMocks.createRequest( {
        method: 'GET',
        url: '/api/cities'
      } );
      var response = httpMocks.createResponse();
      getAllCities( request, response );

      var responseBody = response._getData();
      responseBody.should.deep.equal( cities );
      response.statusCode.should.equal( 200 );
      done();
    } );
  } );

  describe( '#getAllCityBusinesses()', function() {
    var getAllCityBusinesses = citiesApi.__get__( 'getAllCityBusinesses' );

    it( 'should return the cities object', function( done ) {
      var request = httpMocks.createRequest( {
        method: 'GET',
        url: '/api/cities/Madrid/businesses',
        params: {
          cityName: 'Madrid'
        }
      } );
      var response = httpMocks.createResponse();
      getAllCityBusinesses( request, response );

      var responseBody = response._getData();
      responseBody[ 0 ].should.deep.equal( cities[ 'Madrid' ].businesses[ 'MAD17298' ] );
      response.statusCode.should.equal( 200 );
      done();
    } );

    context( 'when the requested city does not exist', function() {
      it( 'should return 404', function( done ) {
        var request = httpMocks.createRequest( {
          method: 'GET',
          url: '/api/cities/DontExist/businesses',
          params: {
            cityName: 'DontExist'
          }
        } );
        var response = httpMocks.createResponse();
        getAllCityBusinesses( request, response );

        var responseBody = response._getData();
        responseBody.message.should.equal( 'Requested city not found 404' );
        response.statusCode.should.equal( 404 );
        done();
      } );
    } );
  } );

  describe( '#updateCityBusiness()', function() {
    var updateCityBusiness = citiesApi.__get__( 'updateCityBusiness' );

    it( 'should return the updated business and only update the address', function( done ) {
      var request = httpMocks.createRequest( {
        method: 'PUT',
        url: '/api/cities/Madrid/businesses/MAD17298',
        params: {
          cityName: 'Madrid',
          businessId: 'MAD17298'
        },
        body: {
          id: 'MAD17298',
          name: 'newName', // Attempt to update name
          address: 'newAddress'
        }
      } );
      var response = httpMocks.createResponse();
      updateCityBusiness( request, response );

      var responseBody = response._getData();
      responseBody.name.should.not.equal( 'newName' );
      responseBody.address.should.equal( 'newAddress' );
      response.statusCode.should.equal( 200 );
      done();
    } );

    context( 'when the requested city or business does not exist', function() {
      it( 'should return 404', function( done ) {
        var request = httpMocks.createRequest( {
          method: 'GET',
          url: '/api/cities/DontExist/businesses/MAD17298',
          params: {
            cityName: 'DontExist',
            businessId: 'MAD17298'
          }
        } );
        var response = httpMocks.createResponse();
        updateCityBusiness( request, response );

        var responseBody = response._getData();
        responseBody.message.should.equal( 'City or Business not found 404' );
        response.statusCode.should.equal( 404 );
        done();
      } );
    } );
  } );

  describe( '#deleteCityBusiness()', function() {
    var deleteCityBusiness = citiesApi.__get__( 'deleteCityBusiness' );

    it( 'should return a confirmation of the deletion', function( done ) {
      var request = httpMocks.createRequest( {
        method: 'DELETE',
        url: '/api/cities/Madrid/businesses/MAD17298',
        params: {
          cityName: 'Madrid',
          businessId: 'MAD17298'
        }
      } );
      var response = httpMocks.createResponse();
      deleteCityBusiness( request, response );

      var responseBody = response._getData();
      responseBody.should.equal( 'Deleted' );
      response.statusCode.should.equal( 200 );
      done();
    } );

    context( 'when the requested city or business does not exist', function() {
      it( 'should return 404', function( done ) {
        var request = httpMocks.createRequest( {
          method: 'DELETE',
          url: '/api/cities/DontExist/businesses/MAD17298',
          params: {
            cityName: 'DontExist',
            businessId: 'MAD17298'
          }
        } );
        var response = httpMocks.createResponse();
        deleteCityBusiness( request, response );
        var responseBody = response._getData();
        responseBody.message.should.equal( 'City or Business not found 404' );
        response.statusCode.should.equal( 404 );
        done();
      } );
    } );
  } );

} );
