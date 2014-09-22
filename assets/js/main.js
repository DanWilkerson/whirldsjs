var whirldsJs = angular.module( 'whirldsJs', [] );

whirldsJs.controller( 'mainController', [ '$scope', function( $scope ) {

  $scope.map = {


  }
  
}]);

/**
 * Returns a JSON object from freegeoip.net incuding Latitude and Longitudal
 * coordinates, based on IP address.
**/
whirldsJs.factory( 'getUserLocationData', [ '$http', function( $http ) { 

  return $http( {

    method: 'GET',
    url: 'https://freegeoip.net/json/'

  } );

} ] );

/**
 * Creates a Google Map with options specified as attributes.
 * If the 'center' attribute is undefined, it will instead set
 * the center to the Users location based on the user's IP address 
 * using @getUserLocationData.
**/
whirldsJs.directive('googleMap', ['getUserLocationData', function( getUserLocationData ) {

  function link( scope, element, attrs) {

    if( attrs.center ) {

      scope.center = '=map-center';

    } else {

      getUserLocationData
      .then( 

        function ( response ){ 

          scope.center = response.data.latitude + ',' + response.data.longitude;
          
        },

        function(){

          scope.center = '37.795,122.40282';

        }

      );

    }

  }

  return {

    link: link

  }

}]);