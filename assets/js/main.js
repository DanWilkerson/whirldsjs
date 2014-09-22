var whirldsJs = angular.module( 'whirldsJs', [] );

whirldsJs.controller( 'mainController', [ '$scope', function( $scope ) {

  console.log($scope);

  $scope.test = 'test';

  $scope.map = {

    zoom: "1"

  }



}]);

/**
 * Returns a promise for a JSON object from freegeoip.net with data
 * about a users location, based on their IP address.
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

  function link( scope, element, attrs ) {

    if( attrs.mapCenter && attrs.mapCenter !== '' ) {

      scope.map.center = '=mapCenter';

    } else {

      getUserLocationData
      .then( 

        function ( response ){ 

          scope.map.center = response.data.latitude + ',' + response.data.longitude;
          console.log(scope);

        },

        function(){

          scope.map.center = '37.795,122.40282';
          console.log( scope );

        }

      );

    }

  }

  return {

    link: link

  }

} ] );

whirldsJs.directive('test', function() {
  return {template:'<div>{{test}}</div>'};
})