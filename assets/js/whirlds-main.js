var whirldsJs = angular.module( 'whirldsJs', [ 'ngRoute' ] );

whirldsJs.constant( 'degrees', 45 );

whirldsJs.config( ['$routeProvider', '$sceDelegateProvider', function( $routeProvider, $sceDelegateProvider ) {

  $routeProvider.when( '/', {

    templateUrl: '/assets/views/select-coords.html',
    controller : 'selectCoordsController'

  } )

  $routeProvider.when( '/whirld/:centerLatLng/:radius', {

    templateUrl: '/assets/views/view-whirld.html',
    controller : 'viewWhirldController'

  } );

  $sceDelegateProvider.resourceUrlWhitelist( [

    'self',
    'http://maps.googleapis.com/maps/api**'

  ] );

} ] );

// CONTROLLERS

whirldsJs.controller( 'selectCoordsController', [ 'getCircleLatLng', '$scope', function( getCircleLatLng, $scope ) {

  $scope.url = {

    lat   : 1,
    lng   : 1,
    radius: 1

  }

  $scope.map = {

    options: {

      zoom: 13,
      mapTypeControl   : false,
      streetViewControl: false,
      styles: [{

        featureType: 'poi',
        stylers    : [{

          visibility: 'off'

        }]

      }],
      id: 'map'

    },

    circle: {

      strokeColor : '#FF8CFF',
      strokeWeight: 2,
      fillColor   : '#fff',
      fillOpacity : 0.75,
      editable    : true,
      radius      : 300,
      showCircle  : false

    },

    events: {

      click: function( event ) {

        var map = this;

        if( $scope.map.circle.binding ) { $scope.map.circle.binding.setMap( null ) };

        $scope.map.circle.center  = event.latLng;
        var circle                = new google.maps.Circle( $scope.map.circle );
        $scope.map.circle.binding = circle;

        circle.setMap( map );
      
        $scope.url.lat    = circle.center.k;
        $scope.url.lng    = circle.center.A;
        $scope.url.radius = circle.radius;

        $scope.$apply();

        google.maps.event.addListener( circle, 'radius_changed', function() {

          var circle  = this;
      
          $scope.url.lat    = circle.center.k;
          $scope.url.lng    = circle.center.A;
          $scope.url.radius = circle.radius;

          $scope.$apply();

        } );

      }

    }

  }

} ] );

whirldsJs.controller( 'viewWhirldController', [ 'degrees', '$scope', '$routeParams', function( degrees, $scope, $routeParams ) {

  $scope.centerLatLng  = $routeParams.centerLatLng;
  $scope.radius        = $routeParams.radius;
  $scope.degrees       = degrees;

} ] );

// FACTORIES

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
 * Takes a object with lat and lng properties, a radius in meters, and a
 * number of points to get along the circumference of a circle.
 * Returns an array of n points on the circles circumference,
 * where n is the number of points passed to the factory.
 * Requires the Google Maps API with the geometry library
**/
whirldsJs.factory( 'getCircleLatLng', function() {

  return ( function( center, radius, numberOfPoints ) {

      var latLngs = [];

      for( var i = 0; i < numberOfPoints; i++ ) {

        var angle = i * 360 / numberOfPoints;

        var point = new google.maps.LatLng( center.lat, center.lng );

        var offset = google.maps.geometry.spherical.computeOffset( point, radius, angle );

        var latLngCoords = {

          lat   : offset.k,
          lng   : offset.A,
          angle : angle,
          number: i

        }
        
        latLngs.push( latLngCoords );

      }

      return latLngs;

    }

  )

} );

// DIRECTIVES

/**
 * Creates a Google Map with options specified as attributes.
 * If the 'center' attribute is undefined, it will instead set
 * the center to the Users location based on the user's IP address 
 * using @getUserLocationData.
**/
whirldsJs.directive('googleMap', [ 'getUserLocationData', function( getUserLocationData ) {

  function link( scope, element, attrs ) {

    if( !scope.map.center ) {

      getUserLocationData
      .then( 

        function( response ) {

          scope.map.options.center = {

            lat: response.data.latitude,
            lng: response.data.longitude

          }

        },

        function() {

          scope.map.options.center = {

            lat: 37.795,
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

/**
 * Creates a 'whirld' - an array of images that switch every 100 seconds 
 * based on the centerLatLng and radius in the URL and the degrees in
 * config. Degrees should be moved out of config.
**/
whirldsJs.directive( 'whirld', [ 'degrees', 'getCircleLatLng', '$interval', function( degrees, getCircleLatLng, $interval ) {

  return {

    link: function( scope, element, attributes ) {

      scope.images = [];

      var centerLatLngObj = {

        lat: scope.centerLatLng.split( ',' )[0],
        lng: scope.centerLatLng.split( ',' )[1]

      }

      var latLngs = getCircleLatLng( centerLatLngObj, scope.radius, degrees );

      for( var i = 0; i < scope.degrees; i++ ) {

        var img = "http://maps.googleapis.com/maps/api/streetview?size=600x600&location=" + latLngs[i].lat + "," + latLngs[i].lng + "&fov=120&heading=" + ( latLngs[i].angle < 180 ? latLngs[i].angle + 180 : latLngs[i].angle - 180 ) + "&pitch=15";
        scope.images.push( { src: img } );

      }

      scope.imageIndex = 0;

      $interval( function() {

        scope.imageIndex < scope.images.length - 1 ? scope.imageIndex++ : scope.imageIndex = 0;

      }, 100);

      scope.$watch( 'imageIndex', function() {

        scope.images.forEach( function( image ) {

          image.visible = null;

        });

        scope.images[ scope.imageIndex ].visible = true;

      });

    },
    restrict: 'EAC',
    replace: true,
    templateUrl: '/assets/views/partials/whirld.html'

  }

} ] );