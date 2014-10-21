var whirldsJs = angular.module( 'whirldsJs', [] );

whirldsJs.controller( 'mainController', [ 'whirldsBuilder', '$scope', function( whirldsBuilder, $scope ) {

  $scope.map = {};

  $scope.map.options = {

    zoom: 13,
    mapTypeControl: false,
    styles: [{
      featureType: 'poi',
      stylers: [{
        visibility: 'off'
      }]
    }],
    id: 'map'

  }

  $scope.map.circle = {

    strokeColor : '#FF8CFF',
    strokeWeight: 2,
    fillColor   : '#fff',
    fillOpacity : 0.75,
    editable    : true,
    radius      : 500,
    showCircle  : false

  }

  $scope.map.events = {

    click: function( event ) {

      if( $scope.map.circle.binding ) { $scope.map.circle.binding.setMap( null )};

      $scope.map.circle.center  = event.latLng;
      var circle                = new google.maps.Circle( $scope.map.circle );
      $scope.map.circle.binding = circle;

      circle.setMap( this );

      google.maps.event.addListener( circle, 'radius_changed', function() {

        whirldsBuilder.setWhirldsRadius( circle.radius );

      } );

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
whirldsJs.directive('googleMap', ['getUserLocationData', 'whirldsBuilder', function( getUserLocationData, whirldsBuilder ) {

  function link( scope, element, attrs ) {

    if( !scope.map.center ) {

      getUserLocationData
      .then( 

        function( response ) {

          scope.map.options.center = {

            lat : response.data.latitude,
            lng: response.data.longitude

          }

        },

        function() {

          scope.map.options.center = {

            lat : 37.795,
            lng: -122.40282

          }

        }

      )
      .then(function(){

        if( !scope.map.zoom ) {

          scope.map.zoom = 13;

        }

        var map = new google.maps.Map( element[0], scope.map.options );

        for( i in scope.map.events ) {

          google.maps.event.addListener( map, i, scope.map.events[i] );

        }

      });

    }


  }

  return {

    restrict: 'EAC',

    link: link,

    templateUrl: '/assets/views/partials/googleMap.html',

    replace: true

  }

} ] );

whirldsJs.service( 'whirldsBuilder', function() {

  var whirldsRadius = 0;
  var whirldsLatLng = {};

  return {

    setWhirldsRadius: function( radius ) {

      whirldsRadius = radius;

    },

    getWhirldsRadius: function() {

      return whirldsRadius;

    },

    setWhirldsLatLng: function( latLng ) {

      whirldsLatLng = latLng;

    },

    getWhirldsLatLng: function() {

      return whirldsLatLng;

    }

  }

} );