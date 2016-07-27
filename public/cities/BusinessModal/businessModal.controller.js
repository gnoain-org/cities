( function() {
  'use strict';

  angular.module( 'CitiesApp' )
    .controller( 'BusinessModalController',
      [ '$uibModalInstance', 'business',
      function( $uibModalInstance, business ) {

        var vm = this;

        //Controller Interface
        vm.cancel =         cancel;
        vm.ok =             ok;

        // Controller Properties
        vm.business = angular.copy( business, vm.business );

// *****************************************************************************
// Controller Interface
// *****************************************************************************

        function cancel() {
          $uibModalInstance.dismiss( 'cancel' );
        }

        function ok( action ) {
          $uibModalInstance.close( {
            action:   action,
            business: vm.business
          } );
        }
  } ] );
} )();
