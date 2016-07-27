( function() {
  'use strict';

  angular.module( 'CitiesApp' )
    .controller( 'CitiesController',
      [ 'CityService', '$uibModal', '$timeout',
      function( CityService, $uibModal, $timeout ) {

        var vm = this;

        // Data Interface
        vm.updateCityBusiness = updateCityBusiness;

        // Data Properties
        vm.cities = CityService.cities;

        // Initialisation
        CityService.getAllCities()
          .then( function() {
            vm.cities = CityService.cities;
          } );

// *****************************************************************************
// Controller Interface
// *****************************************************************************

        function updateCityBusiness( cityName, business ) {
          var modalInstance = $uibModal.open( {
            animation: false,
            templateUrl: '/Cities/BusinessModal/businessModal.html',
            controller: 'BusinessModalController',
            controllerAs: 'businessModalVm',
            bindToController: true,
            resolve: {
              business: business
            }
          } );

          modalInstance.result.then(
            function onSubmit( result ) {
              switch ( result.action ) {
                case 'update': CityService.updateCityBusiness( cityName, result.business );
                               break;
                case 'delete': CityService.deleteCityBusiness( cityName, result.business.id );
                               break;
              }
            }
          );
        }

      } ]
    );
} )();
