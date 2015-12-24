angular.module('app.services.map', [])

    .service('GoogleMaps', function () {

        var circle;
        var circleBounds;
        var arrMarkers = [];
        var myLatLng;
        var map;
        var iw;

        var mapOptions = {
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: false,
            scaleControl: false,
            draggable: true,
            maxZoom: 16
        };

        function showMarkersInArea() {

            circleBounds = circle.getBounds();

            for (i in arrMarkers) {

                latLngCenter = new google.maps.LatLng(arrMarkers[i].position.lat(), arrMarkers[i].position.lng());

                if (circleBounds.contains(latLngCenter)) {
                    arrMarkers[i].setVisible(true);
                }  else {
                    arrMarkers[i].setVisible(false);
                }
            }

        }

        /**
         * Places a blue circle area on map
         * @param event
         */

        function setArea(event) {

            var self = this;

             hideAllMarkers();

            if (circle != null) {
                circle.setCenter(event.latLng);
            } else {

                circle = new google.maps.Circle({
                    map: map,
                    clickable: false,
                    radius: 20,
                    fillColor: '#004de8',
                    fillOpacity: 0.27,
                    strokeColor: '#004de8',
                    strokeOpacity: .4,
                    strokeOpacity: 0.62,
                    strokeWeight: 1,
                    center: event.latLng
                });

            }

             showMarkersInArea();

        }


        function hideAllMarkers() {

            if (iw) {
                iw.close();
            }

            for (i in arrMarkers) {
                arrMarkers[i].setVisible(false);
            }
        }


        function placeMarker(location,text) {

            var iconFile = 'http://www.daftlogic.com/images/gmmarkersv3/stripes.png';

            var boxText = document.createElement("div");
            boxText.style.cssText = "color: #000; font-weight: bold; padding: 10px;";
            boxText.innerHTML = '<a href="#/app/realty/index?realtyCode=6502" ui-sref="app.realty-index"><h2>Avenida das Américas</h2><p>Aluguel:</p><p>' + text + '</p></a>';


            var marker = new google.maps.Marker({
                position:location,
                icon:iconFile,
                draggable:false,
                visible:false,
            });

            var iwContent = boxText;

            google.maps.event.addListener(marker, "click", function (e) {

                if (iw) {
                    iw.close();
                }

                iw = new google.maps.InfoWindow({content: iwContent});
                iw.open(map, this);



            });


            return marker;
        }

        function GoogleMaps(lat,long) {

            var self = this;
            myLatLng = new google.maps.LatLng(lat,long);

            map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            map.setCenter(myLatLng);

            google.maps.event.addListenerOnce(map, 'idle', function(){
                var obj = {latLng: myLatLng};
                setArea(obj);
            });

            google.maps.event.addListener(map, 'mousedown', setArea);

        };



        GoogleMaps.prototype.getMap = function() {

            return null;

        };

        /** Place points at Map **/
        GoogleMaps.prototype.placeRealties = function(points) {


            hideAllMarkers();

            for (i = 0; i < points.length; i++) {

                var marker = placeMarker(points[i], 'valor');

                arrMarkers.push(marker);

                marker.setMap(map);

            }

             showMarkersInArea();

        };

        return GoogleMaps;
    })





     //MAP resultado da busca
    .service('ResultsInMap',function(){


        var circle;
        var circleBounds;
        var myLatLng;
        var map;
        var iw;

        var mapOptions = {
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: true,
            scaleControl: false,
            draggable: true,
            maxZoom: 16
        };



        /**
         * Places a blue circle area on map
         * @param event
         */

        function setArea(event) {

            var self = this;

           

            if (circle != null) {
                circle.setCenter(event.latLng);
            } else {

                circle = new google.maps.Circle({
                    map: map,
                    clickable: false,
                    radius: 100,
                    fillColor: '#004de8',
                    fillOpacity: 0.27,
                    strokeColor: '#004de8',
                    strokeOpacity: .4,
                    strokeOpacity: 0.62,
                    strokeWeight: 1,
                    center: event.latLng
                });

            }

        }        


        function placeMarker(location, code) {

            var iconFile = 'http://www.daftlogic.com/images/gmmarkersv3/stripes.png';

            var boxText = document.createElement("div");
            boxText.style.cssText = "color: #000; font-weight: bold; padding: 10px;";
            boxText.innerHTML = '<a href="#/app/realty/index?realtyCode=6502" ui-sref="app.realty-index"><h2>Avenida das Américas</h2><p>Aluguel:</p><p>' + '</p></a>';


             marker = new google.maps.Marker({
                position:location,
                icon:iconFile,
                draggable:false,
                visible:true,
            });

           

            iwContent = boxText;


            google.maps.event.addListener(marker, "click", function (e) {

                if (iw) {
                    iw.close();
                }

            });


            return marker;
        };

       

    
        function GoogleMaps(lat,long) {



            var self = this;

            myLatLng = new google.maps.LatLng(lat,long);

            map = new google.maps.Map(document.getElementById("map"), mapOptions);

            map.setCenter(myLatLng);

            google.maps.event.addListenerOnce(map, 'idle', function(){
                var obj = {latLng: myLatLng};
                setArea(obj);
            });

            // google.maps.event.addListener(map, 'mousedown', setArea);

        };


        GoogleMaps.prototype.getMap = function() {
            return null;
        };




        /** Place points at Map **/
        GoogleMaps.prototype.placeRealties = function(points, realtyCode) {

    

            for (i = 0; i < points.length; i++) {

                marker = placeMarker(points[i], realtyCode[i]);

                marker.setMap(map);

            }

        };
       


    
        return GoogleMaps;



       


    });


   



