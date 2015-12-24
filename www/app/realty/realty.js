angular.module('app.realty', [])

.config(function($stateProvider) {
	$stateProvider
	.state('app.realty-saved', {
        url: '/realty/saved',
        cache:false,
        views: {
            'menuContent': {
                templateUrl: 'templates/savedRealties.html'
            }
        },
        controller: 'realtySavedCtrl'
    })
	.state('app.realty-index',{
		url: '/realty/index?realtyCode',
		cache:false,
		views:{
			'menuContent':{
				templateUrl: 'app/realty/realty.html'
			}
		},
		controller: 'realtyCtrl'
	});
})



.controller('realtySavedCtrl', function($scope, $state, $stateParams, Favorites) {

    $scope.savedProps = Favorites.all();

    $scope.goDetails = function(_realtyCode){
    	console.log(_realtyCode);
      $state.go('app.realty-index', {'realtyCode':_realtyCode});
    };

    $scope.unfav = function(code) {


    	$scope.savedProps.splice(code, 1);
    	//$state.go($state.current, {}, {reload: true});
    	Favorites.save($scope.savedProps);
    	//console.log('cleaned array: ' + JSON.stringify($scope.savedProps));
    };


})



.controller('realtyCtrl', function($scope, $stateParams, $ionicLoading, $ionicModal, $cordovaSocialSharing, 
	$cordovaGeolocation, $ionicSlideBoxDelegate, Search, FilterService, LocationService, Location, Favorites, $ionicHistory) {

	$scope.favorites = Favorites.all();
	$scope.isFavorited = false;
	var favidsArr = Favorites.favids();
	$ionicHistory.clearCache();
	//$ionicHistory.clearHistory();




	// Favorites.delete();

	var responseArr = Search.result();

	var address = responseArr[0].Endereco;

	var res = address.EnderecoFormatado.split(",");

	var realtyCode = $stateParams.realtyCode;

	console.log("Real code: " + realtyCode);

	Search.setMethod('BuscarImoveisAluguelPorCodigo');
	Search.setQuery({CodigoImovel: realtyCode , UF: address.Estado});




	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;

	$scope.shareAnywhere = function() {
        $cordovaSocialSharing.share("Imóvel Apsa", "Confira esse Imóvel", "www/imagefile.png", "http://www.apsa.com.br");
        console.log('shareAnywhere');
    };



	$ionicLoading.show({
		content: 'Carregando',
		animation: 'fade-in',
		showBackdrop: true,
		maxWidth: 200,
		showDelay: 0
	});
	    

	var realty = {};
	
	var promise1 = Search.loadData();


	var setMap = function(lat, long) {

        myLatlng = new google.maps.LatLng(lat,long);

        var mapOptions = {
	    	center: myLatlng,
	    	zoom: 16,
	    	mapTypeId: google.maps.MapTypeId.ROADMAP,
	    	zoomControl: false,
	    	scaleControl: false,
	    	draggable: true,
	    	maxZoom: 16
	    };



	    var map = new google.maps.Map(document.getElementById("propertyMap"),
	    	mapOptions);

	    var marker = new google.maps.Marker({
		    position: myLatlng,
		    map: map,
		    title: 'Imóvel'
		});

	    directionsDisplay.setMap(map);

        }

    
// Pegando a minha possição
	var location = new Location();
	    location.getPosition().then(function() { 
	                my_latitude = location.position.latitude;
	                my_longitude = location.position.longitude;

                
					// Loading realty data;
					promise1.then(function(){

						responseArr = Search.result();
						$scope.searchResult = [];
						$scope.searchResult = responseArr.length;


						if (responseArr !== undefined) {

							var areaUtil = responseArr[0].AreaUtil;
							var areaSplit = areaUtil.split(".");
							var coordenadas = responseArr[0].CoordenadasGeograficas;

							var address = responseArr[0].Endereco;

							var lat = coordenadas[0].replace(',','.');
							var lgt = coordenadas[1].replace(',','.');
                            



							var from = my_latitude + ',' + my_longitude; 		    // MY LOCATION
							var to = lat + ',' + lgt; 	                                // RESPONSEARR IMOVEL LOCATION


				   
							var distanceMatrix = LocationService.getDistanceMatrix(from, to);
							setMap(lat, lgt);


							var origin = myLatlng = new google.maps.LatLng(my_latitude,my_longitude);
	                        var destination = new google.maps.LatLng(lat,lgt);

				            $scope.calculateAndDisplayRoute = function() {
								  directionsService.route({
								    origin: origin,
								    destination: destination,
								    travelMode: google.maps.TravelMode.DRIVING
								  }, function(response, status) {
								    if (status === google.maps.DirectionsStatus.OK) {
								      directionsDisplay.setDirections(response);
								    } else {
								      window.alert('Directions request failed due to ' + status);
								    }
								  });
								};



							realty = {
								code: responseArr[0].CodigoImovel,
								title: address.EnderecoFormatado,
								price: responseArr[0].PrecoLocacao,
								realtyType: 'Apartamento',							//responseArr[0].TipoImovel
								area: areaSplit[0],
								dorms: responseArr[0].QtdDormitorios,
								suites: '0',
								spots: responseArr[0].QtdVagas,
								cond: responseArr[0].Observacao,
								features: responseArr[0].Caracteristicas,
								photos: responseArr[0].Fotos,
							}

						}


						$scope.realty = realty;
						
						$scope.isFavorited = (favidsArr.indexOf(realtyCode) > -1) ? true : false;

						$ionicSlideBoxDelegate.update();				
						
						distanceMatrix.then(function(response){
							
							var row = response.data.rows[0];

							console.log(row);

							realty.distance = row.elements[0].distance.text;
							
							$ionicLoading.hide();

						}, function() {

							realty.distance = 0;
							$ionicLoading.hide();
						});

					}, 
					function() {
					   
					   // No Results
					   $ionicLoading.hide();


					});


            });





	/** Após obter posição do usuário **/
	$cordovaGeolocation.getCurrentPosition({timeout: 10000,enableHighAccuracy: false}).then(function(position) {

		console.warn('my pos: ' + JSON.stringify(position));

	});

	
	$ionicModal.fromTemplateUrl('templates/emailModal.html', {
        scope: $scope
    })
    .then(function(modal) {
        $scope.sendMailModal = modal;
    });
    
    $scope.sendMail=function(){
        //$scope.emailModal.hide();
        $scope.sendMailModal.show();
    };
	

	$ionicModal.fromTemplateUrl('templates/telephoneModal.html', {
        scope: $scope
    })
    .then(function(modal) {
        $scope.telModal = modal;
    });

    $scope.telephoneModal=function(){
        $scope.telModal.show();
    };
	
	// ** SHARE MODAL **//
	$ionicModal.fromTemplateUrl('templates/shareModal.html', {
		scope: $scope
	})
	.then(function(modal) {
		$scope.shareModal = modal;
	});

	$scope.shareIconsModal=function(){
		$scope.shareModal.show();
	};


	$scope.favoriteRealtyID = function(status) {

		console.log("Status " + status);


		var pos = favidsArr.indexOf(realtyCode);
		
		if (status) {

			$scope.favorites.push($scope.realty);
			Favorites.save($scope.favorites);

		} else {

			$scope.favorites.splice(pos, 1);

	    	//$state.go($state.current, {}, {reload: true});

	    	Favorites.save($scope.favorites);
    	}
	};

	
	$scope.navSlide = function(index){
        $ionicSlideBoxDelegate.slide(index, 1000);
    };



});
