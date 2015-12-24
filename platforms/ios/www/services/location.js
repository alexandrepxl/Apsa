angular.module('app.services.location', [])

    .service('Location', function ($cordovaGeolocation, $ionicLoading, $q) {

        var api_key = 'AIzaSyC_Um7H7bwlY3KWRD0us7dUEs1bvJuPLoo';
        var gmapsUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
        var apiDistanceMatrix = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
        var geocoder = new google.maps.Geocoder;

        function Location() {

            $ionicLoading.show({
                content: 'Carregando',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            this.position = {
                latitude: null,
                longitude: null
            };

        };


        Location.prototype.getPosition = function () {
            var self = this;

            return $cordovaGeolocation
                .getCurrentPosition({
                    timeout: 10000,
                    enableHighAccuracy: true
                })
                .then(function (response) {

                    var lat = response.coords.latitude;
                    var long = response.coords.longitude;

                    self.position = {
                        latitude: lat,
                        longitude: long,
                    };


                    return response;

                });
        };

        Location.prototype.getReverse = function(latitude, longitude) {


            var latlng = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
            var deferred = $q.defer();



            geocoder.geocode({'location': latlng}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {

                    deferred.resolve(results);

                } else {
                    deferred.reject(status);
                }
            });

            return deferred.promise;


        };




        Location.prototype.getByAddress = function(address) {
            geocoder.geocode( { 'address': address}, function(results, status) {

                console.warn('add: ' + JSON.stringify(results));

                if (status == google.maps.GeocoderStatus.OK) {

                    for (i=0; i<results.length; i++) {


                        var address_components = results[i].formatted_address;
                        console.log('add: ' + address_components)


                    }

                }
            });
        };

        return Location;

    });