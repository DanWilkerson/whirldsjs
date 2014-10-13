var whirldsJs = angular.module( 'whirldsJs', [] );

whirldsJs.controller( 'mainController', [ '$scope', function( $scope ) {

  $scope.map = {

    zoom: "1",
    mapTypeControl: false,
    styles: [{
      featureType: 'poi',
      stylers: [{
        visibility: 'off'
      }]
    }],
    mapDivId: 'map'

  }

  $scope.map.circle = {

    strokeColor : '#FF8CFF',
    strokeWeight: 2,
    fillColor   : '#fff',
    fillOpacity : 0.75,
    editable    : true,
    radius      : 500,
    map         : $scope.map.mapDivId,
    showCircle  : false

  }

  $scope.map.events = {

    click: function( event ) {

      var latitude  = event.d;
      var longitude = event.e;
      $scope.map.circle.center     = latitude + "," + longitude;
      $scope.map.circle.showCircle = true;

    }

  }

} ] );

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

    if( !scope.map.center ) {

      getUserLocationData
      .then( 

        function ( response ){ 

          scope.map.center = response.data.latitude + ',' + response.data.longitude;

        },

        function(){

          scope.map.center = '37.795,122.40282';

        }

      );

    }

    if ( typeof attrs.mapZoom === 'undefined' || typeof scope.map.zoom === 'undefined' ) {

      scope.map.zoom = 13

    }

  }

  return {

    link: link,
    
  }

} ] );
