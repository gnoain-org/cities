describe( 'CityService', function() {

  var CityService;
  var $filter;
  var $httpBackend;

  var cities = {
    'Madrid': {
      country: 'ES',
      businesses: {
        'id1': {
          id: 'id1',
          address: 'Calle Falsa, 123'
        }
      }
    },
    'Paris' : {
      'country': 'FR'
    },
  };

  beforeEach( module( 'CitiesApp' ) );

  beforeEach( inject( function( _CityService_, _$httpBackend_ ) {
    CityService = _CityService_;
    $httpBackend = _$httpBackend_;
  } ) );

  afterEach( function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  } );

  describe( '#deleteCityBusiness()', function() {
    beforeEach( function() {
      CityService.cities = angular.copy( cities );
    } );

    context( 'when the city to delete exists in the service', function() {
      context( 'and the back end deletion is successful', function() {
        it( 'should delete the business in the service', function() {
          $httpBackend.whenDELETE( 'http://localhost:9000/api/cities/Madrid/businesses/id1' )
            .respond( 'deleted' );

          CityService.deleteCityBusiness( 'Madrid', 'id1' ).then( function( result ) {
            result.data.should.equal( 'deleted' );
            CityService.cities[ 'Madrid' ].businesses.should.be.empty;
          } );

          $httpBackend.flush();
        } );
      } );

      context( 'and the back end deletion is not successful', function() {
        after( function() {
          console.log.restore();
        } );

        it( 'should log an error (hopefully not for long)', function() {
          var consoleSpy = sinon.spy( console, 'log' );
          $httpBackend.whenDELETE( 'http://localhost:9000/api/cities/Madrid/businesses/id1' )
            .respond( function() {
              return [ 500, 'Database error' ];
            } );

          CityService.deleteCityBusiness( 'Madrid', 'id1' ).catch( function( result ) {
            consoleSpy.calledOnce.should.be.true;
            consoleSpy.args[ 0 ][ 0 ].should.equal( 'There was an error: Database error' );
          } );

          $httpBackend.flush();
        } );

      } );
    } );

    context( 'when the city to delete is not in the service', function() {
      after( function() {
        console.log.restore();
      } );

      it( 'should log an error (hopefully not for long)', function() {
        var consoleSpy = sinon.spy( console, 'log' );
        CityService.deleteCityBusiness( 'Londres', 'id1' );
        consoleSpy.calledOnce.should.be.true;
        consoleSpy.args[ 0 ][ 0 ].should.equal( 'Business to delete not found' );
      } );
    } );
  } );

  describe( '#getAllCities()', function() {
    it( 'should set the cities object with the result', function() {
      $httpBackend.whenGET( 'http://localhost:9000/api/cities/' )
        .respond( cities );

      CityService.getAllCities().then( function() {
        CityService.cities.should.deep.equal( cities );
      } );

      $httpBackend.flush();
    } );

    context( 'when the retrieve from the back end fails', function() {

      after( function() {
        console.log.restore();
      } );

      it( 'should log an error (hopefully not for long)', function() {
        var consoleSpy = sinon.spy( console, 'log' );
        $httpBackend.whenGET( 'http://localhost:9000/api/cities/' )
          .respond( function() {
            return [ 500, 'Database error' ];
          } );

        CityService.getAllCities().catch( function( result ) {
          consoleSpy.calledOnce.should.be.true;
          consoleSpy.args[ 0 ][ 0 ].should.equal( 'There was an error: Database error' );
        } );

        $httpBackend.flush();
      } );
    } );
  } );

  describe( '#updateCityBusiness()', function() {
    beforeEach( function() {
      CityService.cities = angular.copy( cities );
    } );

    context( 'when the city to update exists in the service', function() {
      context( 'and the back end update is successful', function() {
        var updatedBusiness = {
          id: 'id1',
          address: 'Calle Falsa, 321'
        };
        it( 'should update the business in the service and return the updated business', function() {
          $httpBackend.whenPUT( 'http://localhost:9000/api/cities/Madrid/businesses/id1', updatedBusiness )
            .respond( updatedBusiness );

          CityService.updateCityBusiness( 'Madrid', updatedBusiness )
            .then( function( result ) {
              result.data.should.deep.equal( updatedBusiness );
              CityService.cities[ 'Madrid' ].businesses[ 'id1' ].should.deep.equal( updatedBusiness );
            } );

          $httpBackend.flush();
        } );
      } );

      context( 'and the back end update is not successful', function() {
        after( function() {
          console.log.restore();
        } );

        it( 'should log an error (hopefully not for long)', function() {
          var updatedBusiness = {
            id: 'id1',
            address: 'Calle Falsa, 321'
          };

          var consoleSpy = sinon.spy( console, 'log' );
          $httpBackend.whenPUT( 'http://localhost:9000/api/cities/Madrid/businesses/id1', updatedBusiness )
            .respond( function() {
              return [ 500, 'Database error' ];
            } );

          CityService.updateCityBusiness( 'Madrid', updatedBusiness ).catch( function( result ) {
            consoleSpy.calledOnce.should.be.true;
            consoleSpy.args[ 0 ][ 0 ].should.equal( 'There was an error: Database error' );
          } );

          $httpBackend.flush();
        } );

      } );
    } );

    context( 'when the city to delete is not in the service', function() {
      after( function() {
        console.log.restore();
      } );

      it( 'should log an error (hopefully not for long)', function() {
        var wrongUpdatedBusiness = {
          id: 'dontExist',
          address: 'Calle Falsa, 321'
        };

        var consoleSpy = sinon.spy( console, 'log' );
        CityService.updateCityBusiness( 'Londres', wrongUpdatedBusiness );
        consoleSpy.calledOnce.should.be.true;
        consoleSpy.args[ 0 ][ 0 ].should.equal( 'Business to update not found' );
      } );
    } );
  } );

} );
