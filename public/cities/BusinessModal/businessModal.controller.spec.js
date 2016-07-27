describe( 'BusinessModalController', function() {

  beforeEach( module( 'CitiesApp' ) );

  var controller;
  var uibModalInstanceStub;

  beforeEach( inject( function( $controller ) {
    uibModalInstanceStub = {
      close: sinon.spy(),
      dismiss: sinon.spy()
    };
    controller = $controller( 'BusinessModalController', {
        $uibModalInstance: uibModalInstanceStub,
        business: {
          name: 'Test Business'
        }
      } );

  } ) );

  describe( '#cancel()', function() {
    it( 'should dismiss the modal', function() {
      controller.cancel();
      uibModalInstanceStub.dismiss.calledOnce.should.be.true;
      uibModalInstanceStub.dismiss.args[ 0 ][ 0 ].should.equal( 'cancel' );
    } );
  } );

  describe( '#ok()', function() {
    it( 'should close the modal with the correct action and the business', function() {
      controller.ok( 'update' );
      uibModalInstanceStub.close.calledOnce.should.be.true;
      uibModalInstanceStub.close.args[ 0 ][ 0 ].should.deep.equal( {
        action: 'update',
        business: {
          name: 'Test Business'
        }
      } );
    } );
  } );



} );
