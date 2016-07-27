'use strict';

// *****************************************************************************
//  Dependencies
// *****************************************************************************

// Core Dependencies
var express =           require( 'express' );

// External Modules
var _ =                 require( 'lodash' );
var async =             require( 'async' );

// Internal Modules
var BackendError =      require( '../../components/BackendError' );
var requestValidator =  require( '../../middleware/requestValidator' );
var responseSender =    require( '../../components/responseSender' );

// *****************************************************************************
//  Data Source
// *****************************************************************************

  var defaultCities = require( '../../data/cities.json' );

  // Optimize data source by keying objects by the most used search criteria
  var cities = _.keyBy( defaultCities, 'city' );
  _.forEach( cities, function( city ) {
    city.businesses = _.keyBy( city.businesses, 'id' );
  } );

// *****************************************************************************
//  Module Interface
// *****************************************************************************

  var router = express.Router();

  module.exports = router;

// *****************************************************************************
//  Routes
// *****************************************************************************

router.get(    '/',                                  getAllCities );
router.get(    '/:cityName/businesses',              getAllCityBusinesses );
router.put(    '/:cityName/businesses/:businessId',  requestValidator.validateBusinessUpdateRequest,
                                                     updateCityBusiness );
router.delete( '/:cityName/businesses/:businessId',  deleteCityBusiness );

// *****************************************************************************
//  Route Functions
// *****************************************************************************

function getAllCities( request, response ) {
    return responseSender.sendResponse( null, cities, response );
}

// The following methods will fake asynchronous interactions to make it
// more realistic

function getAllCityBusinesses( request, response ) {
  async.waterfall( [
    function getCity( waterfallCallback ) {
      var requestedCity = request.params.cityName;
      return waterfallCallback( null, cities[ requestedCity ] );
    },
    function getCityBusinesses( city, waterfallCallback ) {
      if ( _.isEmpty( city ) ) {
        var error = new BackendError.NotFoundError( 'Requested city not found', {
          requestedCity: request.params.cityName
        }, 404 );
        return waterfallCallback( error );
      } else {
        return waterfallCallback( null, _.values( city.businesses ) );
      }
    }
  ], function( error, cityBusinesses ) {
    return responseSender.sendResponse( error, cityBusinesses, response );
  } );
}

function updateCityBusiness( request, response ) {
  var requestedCity =     request.params.cityName;
  var requestedBusiness = request.params.businessId;
  async.waterfall( [
    function getBusiness( waterfallCallback ) {
      var businessesToUpdate =  cities[ requestedCity ] ?
                                  cities[ requestedCity ].businesses[ requestedBusiness ] :
                                  null;
      return waterfallCallback( null, businessesToUpdate );
    },
    function updateBusiness( business, waterfallCallback ) {
      if ( _.isEmpty( business ) ) {
        var error = new BackendError.NotFoundError( 'City or Business not found', {
          requestedBusiness:  requestedBusiness,
          requestedCity:      requestedCity
        }, 404 );
        return waterfallCallback( error );
      } else {

        // At this moment, only the address should be updated, ignore the rest
        var updatedBusiness = request.body;
        business.address =    updatedBusiness.address;
        return waterfallCallback( null, business );
      }
    }
  ], function( error, updatedBusiness ) {
    return responseSender.sendResponse( error, updatedBusiness, response );
  } );
}

function deleteCityBusiness( request, response ) {
  var requestedCity =     request.params.cityName;
  var requestedBusiness = request.params.businessId;
  async.waterfall( [
    function getBusiness( waterfallCallback ) {
      var businessesToUpdate =  cities[ requestedCity ] ?
                                  cities[ requestedCity ].businesses[ requestedBusiness ] :
                                  null;
      return waterfallCallback( null, businessesToUpdate );
    },
    function removeBusiness( business, waterfallCallback ) {
      if ( _.isEmpty( business ) ) {
        var error = new BackendError.NotFoundError( 'City or Business not found', {
          requestedBusiness:  requestedBusiness,
          requestedCity:      requestedCity
        }, 404 );
        return waterfallCallback( error );
      } else {
        delete cities[ requestedCity ].businesses[ requestedBusiness ];
        return waterfallCallback( null );
      }
    }
  ], function( error ) {
    return responseSender.sendResponse( error, 'Deleted', response );
  } );
}
