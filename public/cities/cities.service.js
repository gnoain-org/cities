( function() {
  'use strict';

  angular.module( 'CitiesApp' )
    .constant( "API_BASE_URL", "http://localhost:9000/api/cities/" )
    .factory( 'CityService',
      [ '$http', '$filter', 'API_BASE_URL',
      function( $http, $filter, API_BASE_URL ) {

        var service = {

          // Service Interface
          deleteCityBusiness:   deleteCityBusiness,
          getAllCities:         getAllCities,
          updateCityBusiness:   updateCityBusiness,

          // Service Properties
          cities:       {}
        };

        return service;

// *****************************************************************************
// Service Interface
// *****************************************************************************

        function deleteCityBusiness( cityName, businessId ) {
          if ( service.cities[ cityName ] &&
               service.cities[ cityName ].businesses[ businessId ] ) {
            return $http.delete( API_BASE_URL + cityName + '/businesses/' + businessId )
              .success( function onSucces( results ) {
                delete service.cities[ cityName ].businesses[ businessId ];
              } )
              .error( function onError( error ) {

                //TODO Implement a proper error management
                console.log( 'There was an error: ' + error );
              } );
          } else {

            //TODO Implement a proper error management
            console.log( 'Business to delete not found' );
          }
        }

        function getAllCities() {
          return $http.get( API_BASE_URL )
            .success( function onSucces( result ) {
              service.cities = result;
            } )
            .error( function onError( error ) {

              //TODO Implement a proper error management
              console.log( 'There was an error: ' + error );
            } );
        }

        function updateCityBusiness( cityName, business ) {
          if ( service.cities[ cityName ] &&
               service.cities[ cityName ].businesses[ business.id ] ) {
            return $http.put( API_BASE_URL + cityName + '/businesses/' + business.id,
                business )
              .success( function onSucces() {
                service.cities[ cityName ].businesses[ business.id ] = business;
              } )
              .error( function onError( error ) {

                //TODO Implement a proper error management
                console.log( 'There was an error: ' + error );
              } );
          } else {

            //TODO Implement a proper error management
            console.log( 'Business to update not found' );
          }
        }
      } ]
    );
} )();
