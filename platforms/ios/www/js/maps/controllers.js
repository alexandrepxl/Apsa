var mapsCtrl = angular.module('maps.controllers', ['angularSoap']);

mapsCtrl.factory("testService", ['$soap','$http',function($soap, $http){
    
    var base_url = "http://wsapsa.hmg.marlin.com.br/APSA_WS_Servicos/APSAServicos.asmx"; 
    var myLocation = {};
    var myAddress = {};

    //var base_url = "http://www.predic8.com:8080/material/ArticleService";
    //var base_url = "http://www.webservicex.com/globalweather.asmx";
    //var base_url = "http://www.w3schools.com/webservices/tempconvert.asmx";

    return {
        HelloWorld: function(){
            //return $soap.post(base_url,"HelloWorld");
            //var t =  $soap.post(base_url,"BuscarImoveisAluguelPorCodigo", {CodigoImovel: "9813", UF: "RJ"});
            //console.log("soap result" + t.);
            return $soap.post(base_url,"BuscarImoveisAluguelPorCodigo", {CodigoImovel: "9813", UF: "RJ"});
        },
        Example: function() {
         
          return $soap.post(base_url,"getAll");
         
        },
        GetWeather: function() {
          
          return $soap.post(base_url,"GetWeather", {CityName: "Brazil", CountryName: ""});

        },
        TempConvert: function() {
            return $soap.post(base_url,"FahrenheitToCelsius", {Fahrenheit: 100});
        },
        requestLocation: function() {
    
           
        },
        setMyLocation: function(lat,long) {

            myLocation.Lat = lat;
            myLocation.Long = long;

        },
        getReverseGeocoding: function() {
           var gmapsurl = 

            'https://maps.googleapis.com/maps/api/geocode/json?' +
            'latlng=-23.0027879,-43.3163851' +
            '&key=AIzaSyC_Um7H7bwlY3KWRD0us7dUEs1bvJuPLoo' +
            '&result_type=neighborhood|locality|country|administrative_area_level_1';

            return $http.get(gmapsurl);

        },
        setMyAddress: function(mapsData) {
            
            myAddress.Bairro = mapsData.data.results[0].address_components[0].long_name;
            myAddress.Cidade = mapsData.data.results[1].address_components[0].long_name;
            myAddress.UF = mapsData.data.results[2].address_components[0].short_name;
        },
        getMyAddress: function() {
            return myAddress;
        }
    }

}]);



mapsCtrl.controller('MapController', function($scope, $ionicModal, $state, testService, $ionicLoading) {

	var markupIsEnabled;

    $ionicLoading.show({
        template: 'loading'
      })

    testService.HelloWorld().then(function(response) {
       //console.log("soap: " + JSON.stringify(response));  
       $ionicLoading.hide()
       console.log(response.ArrayOfImovel.Imovel.AreaUtil);
    });

	$scope.toggleMap = function(toggleStatus) {
		
		markupIsEnabled = toggleStatus;

		if (toggleStatus == false) {
			
			map.setOptions({
				draggable: true
			});

		} else {
			map.setOptions({
				draggable: false
			});
		}
    };
	
	var points = [];
    var polygon;
    var routePath;
    var routePath2;
    var arrMarkers = new Array(0); // array com os pontos representando os imóveis
    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);

    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      scaleControl: false,
      draggable: true,
      maxZoom: 16
    };

    var map = new google.maps.Map(document.getElementById("map"),
    mapOptions);

    var polyOptions = {
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3
    };

    // Add a listener for the click event
    google.maps.event.addListener(map, 'mousedown', addLatLng);
    google.maps.event.addListenerOnce(map, 'idle', function(){
        plotrandom(10); 
    });

    function addLatLng(event) {

    	if (markupIsEnabled == true) {
	        points.push(event.latLng);
	        var marker = new google.maps.Marker({
	            position: event.latLng,
	            map: map
	          });

	        display();
        }

    }

    function display() {
        
        /*routePath = new google.maps.Polyline({
            path: points,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            geodesic: true
        });
        routePath.setMap(map);*/

        polygon = new google.maps.Polygon({
            paths: points,
            strokeColor: "#FF0000",
            strokeOpacity: 0,
            strokeWeight: 1,
            fillColor: '#EFF1F5',
            fillOpacity: 0.5
        });

        polygon.setMap(map);
        SearchPointsAdd();

    }

    function plotrandom(number) {
        bounds = map.getBounds();
        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast();
        var lngSpan = northEast.lng() - southWest.lng();
        var latSpan = northEast.lat() - southWest.lat();
        pointsrand = [];

        for (var i = 0; i < number; ++i) {
            var point = new google.maps.LatLng(southWest.lat() + latSpan * Math.random(), southWest.lng() + lngSpan * Math.random());
            pointsrand.push(point);
        }
        for (var i = 0; i < number; ++i) {
            var str_text = i + " : " + pointsrand[i];
            var marker = placeMarker(pointsrand[i], str_text);
            arrMarkers.push(marker);
            marker.setMap(map);
        }
    }

    function placeMarker(location,text) {
        var iconFile = 'http://www.daftlogic.com/images/gmmarkersv3/stripes.png'; 
        var marker = new google.maps.Marker({
            position:location,
            map:map,
            icon:iconFile,
            title:text.toString(),
            draggable:false
        });
        return marker;
    }


    function SearchPointsAdd() {
        if (!(polygon == undefined)) {
            if (arrMarkers) {
                for (i in arrMarkers) {
                    arrMarkers[i].setMap(null);
                }
            }

            for (var i = 0; i < pointsrand.length; ++i) {
                if (google.maps.geometry.poly.containsLocation(pointsrand[i], polygon)) {
                //if (polygon.containsLatLng(pointsrand[i])) {
                    var marker = placeRealtyMarker(pointsrand[i], i);
                    //randomMarkers.push(marker);
                    marker.setMap(map);
                    console.log("placeRealtyMarker:" + pointsrand[i] + " / " + i);
                }
            }
        }
    }

    /** 
        Coloca um marcador representando o imóvel (Realty)
    **/
    function placeRealtyMarker(location, number) {
        var image = new google.maps.MarkerImage('http://www.daftlogic.com/images/gmmarkersv3/marker.png',
        // This marker is 20 pixels wide by 32 pixels tall.
        new google.maps.Size(20, 34),
        // The origin for this image is 0,0.
        new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at 0,32.
        new google.maps.Point(9, 33));
        var shadow = new google.maps.MarkerImage('http://www.daftlogic.com/images/gmmarkersv3/shadow.png',
        // The shadow image is larger in the horizontal dimension
        // while the position and offset are the same as for the main image.
        new google.maps.Size(28, 22),
        new google.maps.Point(0, 0),
        new google.maps.Point(1, 22));
        
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            shadow: shadow,
            icon: image,
            draggable: true
        });
        
        /*google.maps.event.addListener(marker, 'dragend', function(event) {
            points[number] = event.latLng;
            Display();
        });*/

        return marker;
    }
	

    /*ionic.Platform.ready(function(){  
    	initialize();
    });*/

});