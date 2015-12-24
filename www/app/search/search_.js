angular.module('app.search', ['ngCordova.plugins.toast'])

    .config(function ($stateProvider) {
        $stateProvider
            .state('app.search-saved', {
                url: '/search/saved',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'app/search/search-saved.html'
                    }
                },
                controller: 'SearchSavedCtrl'
            })
            .state('app.search-index', {
                url: '/search/index',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'app/search/search.html'
                    }
                },
                controller: 'SearchIndexCtrl'
            })
            .state('app.search-map', {
                url: '/search/map',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'app/search/map-search.html'
                    }
                },
                controller: 'SearchMapCtrl'
            })

            .state('app.results-map', {
                url: '/search/map',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'app/search/map-results.html'
                    }
                },
                controller: 'ResultsInMapsCtrl'
            })

            .state('app.search-result', {
                url: '/search/result',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'app/search/result.html'
                    }
                },
                controller: 'SearchResultsCtrl'
            });
    })

    .controller('SearchIndexCtrl', function ($scope, $state, $ionicLoading, $ionicModal, FilterService,FilterService, Location) {

        var address = FilterService.address();
        var res = address.full.split(",");
        var filter = FilterService.filter();


        // Title busca filtro
        $scope.title_bairro = res[0];
        $scope.title_tipo = "";

        if(filter.selectedSearchType.value === 0){
           $scope.title_tipo = "Aluguel";
        }else{
           $scope.title_tipo = "Compra";  

        }


        $ionicLoading.show({
            content: 'Carregando',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });


        /** Recebendo informações do webservice da Apsa, e preenchendo os campos **/
        var servicesDataPromise = FilterService.loadData();
        //var filter = {};

        $scope.filter = FilterService.filter();


        servicesDataPromise.then(function (data) {

            $scope.filter.realtyTypes = FilterService.getRealtyTypes();
            //selecionado
            $scope.filter.selectedRealtyType = $scope.filter.realtyTypes[0];

            $scope.filter.realtyPrices = FilterService.getRealtyPrices();
            var realtyPricesSize = $scope.filter.realtyPrices.length - 1;

            $scope.filter.selectedMinRealtyPrice = $scope.filter.realtyPrices[0];
            $scope.filter.selectedMaxRealtyPrice = $scope.filter.realtyPrices[realtyPricesSize];


            $scope.filter.areaSizes = FilterService.getAreaSizes();
            $scope.filter.selectedRealtyMinArea = $scope.filter.areaSizes[0];
            $scope.filter.selectedRealtyMaxArea = $scope.filter.areaSizes[0];


            $scope.filter.orderByOptions = FilterService.getOrderByOptions();
            $scope.filter.selectedOrderBy = $scope.filter.orderByOptions[0];

            $scope.filter.rooms = FilterService.getRoomOptions();

            $scope.filter.selectedRoom = $scope.filter.rooms[0];

            $scope.filter.spots = FilterService.getSpotsOptions();
            $scope.filter.selectedSpot = $scope.filter.spots[0];

            $scope.filter.realtyCode = '';


            console.log($scope.filter.selectedSpot);


            /* After load all Promises */
            $ionicLoading.hide();

        });

        $scope.doRealtySearch = function () {
            $state.go('app.search-result');
        };


        // Load the modal from the given template URL
       $ionicModal.fromTemplateUrl('templates/helpModal.html', function($ionicModal) {
           
            $scope.modal = $ionicModal;

          }, 
          {

           scope: $scope,
           animation: 'slide-in-up'
          });  



    })



    .controller('SearchResultsCtrl', function($scope, $state, $stateParams, $ionicLoading, $ionicHistory, $ionicModal, FilterService, Location, LocationService, Search, Favorites, Searches) {


        $scope.favorites = Favorites.all();
        $scope.savedSearches = Searches.all();
        var favidsArr = Favorites.favids();

        
        $scope.isFavorited = [];

        var responseArr = [];
        $scope.distance = [];

        var i = 0;

        var filter = FilterService.filter();
        var address = FilterService.address();
        var res = address.full.split(",");




        
        //TODO COMPLETAR
        var mySearch = {
            TipoImovel: filter.selectedRealtyType.Codigo,
            TipoImovelDescricao: filter.selectedRealtyType.Descricao,
            Relevante: filter.selectedOrderBy.name,
            ValorMin: filter.selectedMinRealtyPrice.Descricao,
            ValorMax: filter.selectedMaxRealtyPrice.Descricao,
            AreaMin: filter.selectedRealtyMinArea.name,
            AreaMax: filter.selectedRealtyMaxArea.name,
            Quartos: filter.selectedRoom,
            Vagas: filter.selectedSpot,
            Bairro: res[0],
            Cidade: res[1],
            UF: res[2],
            Full: res[0] + ', ' + res[1] + '/' + res[2],
        };





        if (filter.realtyCode != '') {

            var res = address.full.split(",");



            Search.setMethod(filter.selectedSearchType.value == 0 ? 'BuscarImoveisAluguelPorCodigo' : 'BuscarImoveisVendaPorCodigo');
            Search.setQuery({CodigoImovel: filter.realtyCode, UF: res[2].trim()});
            
            mySearch.CodigoImovel = filter.realtyCode;


        } else {


            Search.setMethod('BuscarImoveisAluguel');
            var res = address.full.split(",");



            Search.setQuery({
                TipoImovel: filter.selectedRealtyType.Codigo,
                Bairro: res[0],
                Cidade: res[1].trim(),
                UF: res[2].trim()
            });


            
            // APAGAR 
            console.log('Query: ' + JSON.stringify({
                    TipoImovel: filter.selectedRealtyType.Codigo,
                    Bairro: res[0],
                    Cidade: res[1].trim(),
                    UF: res[2].trim()
                }));

        }


 
        var promise1 = Search.loadData();
         
        $ionicHistory.clearCache();
        $scope.results = [];
        $scope.filter = FilterService.filter();

        $ionicLoading.show({
            content: 'Carregando',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });



        $ionicModal.fromTemplateUrl('templates/modalNotFound.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });




        promise1.then(function () {

                       // Pegando a minha possição
           var location = new Location();
           location.getPosition().then(function() { 
                my_latitude = location.position.latitude;
                my_longitude = location.position.longitude;


                        responseArr = Search.result();
                        $ionicLoading.hide();
                        $scope.populateList(my_latitude,my_longitude);
                        $scope.searchResult = responseArr.length;

            });

        }, function () {
            $ionicLoading.hide();
            $scope.modal.show();

        });


        $scope.populateList = function(my_latitude, my_longitude) {
                         
                        var from = my_latitude + ',' + my_longitude;     


                        for (c = 0; c < responseArr.length; c++) {

                            var _code = responseArr[i].CodigoImovel;

                            $scope.isFavorited.push((favidsArr.indexOf(_code) > -1) ? true : false)

                            var _address = responseArr[i].Endereco;

                            var lat_imovel = responseArr[i].CoordenadasGeograficas[0];
                            var long_imovel =  responseArr[i].CoordenadasGeograficas[1];

                            var to = lat_imovel + ',' + long_imovel; 
                            var distanceMatrix = LocationService.getDistanceMatrix(from, to); 


                            distanceMatrix.then(function(response){
                            
                                 var row = response.data.rows[0];
                                 $scope.distance.push(row.elements[0].distance.text);

                                   

                                 $ionicLoading.hide();


                            }, function() {
                    
                            });


                            $scope.results.push({
                                        id: i,
                                        code: _code,
                                        title: _address.TipoLogradouro + ' ' + _address.Logradouro + ' - ' + _address.Bairro,
                                        price: responseArr[i].PrecoLocacao,
                                        realtyType: responseArr[i].TipoImovel,
                                        area: responseArr[i].AreaUtil,
                                        dorms: responseArr[i].QtdDormitorios,
                                        suites: '',
                                        spots: responseArr[i].QtdVagas,
                                        cond: responseArr[i].PrecoCondominio,
                                        photos: responseArr[i].Fotos
                         
                                    });
                                

                            i = i + 1;
                        }

            

            $scope.$broadcast('scroll.infiniteScrollComplete');
        }



        $scope.canWeLoadMoreContent = function () {
            return (i >= responseArr.length) ? false : true;
        }

        $scope.goDetails = function (_realtyCode) {
            $state.go('app.realty-index', {'realtyCode': _realtyCode});
        };


        $scope.saveSearch = function () {

            $scope.savedSearches.push(mySearch);
            
            // 
            Searches.save($scope.savedSearches);
        };


        $scope.goMaps = function(){
             $state.go('app.results-map');
        }

       
        $scope.favoriteRealtyID = function(status,realtyCode,index) {

        console.log("STATUS: " + status  +  " REALTYCODE: " + realtyCode + " Index:" + index);
   

        //$scope.favorites.push($scope.realty);
        //Favorites.save($scope.favorites);

        var pos = favidsArr.indexOf(realtyCode);

        console.log('POS: ' + favidsArr.indexOf(realtyCode));
        
        if (status) {

            $scope.favorites.push($scope.results[index]);
            Favorites.save($scope.favorites);

        } else {

            $scope.favorites.splice(pos, 1);

            //$state.go($state.current, {}, {reload: true});

            Favorites.save($scope.favorites);
        }
      };


    })
    .controller('SearchMapCtrl', function($scope, $state, $ionicLoading,GoogleMaps, Location, Search, FilterService,$cordovaToast , $cordovaDevice) {

        var filter = FilterService.filter();
        var googleMaps;

        $scope.range = 5;


        // var overlay;
        // var points = [];
        // var circle;
        // var circleBounds;
        // var arrMarkers = new Array(0); // array com os pontos representando os imóveis
        // var myLatlng;
        // var iw = null;



        $ionicLoading.show({
            content: 'Carregando',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });


        $scope.$watch('range', function (value) {



        }, true);

        
        google.maps.Circle.prototype.contains = function(latLng) {
         return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
        }



        //var lat = position.coords.latitude;
        //var long = position.coords.longitude;
        //var googleMaps = new GoogleMaps(lat,long);

  var startSearch = function(){


        var location = new Location();
        location.getPosition().then(function() {

            var lat = location.position.latitude;
            var long = location.position.longitude;

            googleMaps = new GoogleMaps(lat,long);

            location.getReverse(lat,long).then(function(results) {

                var arrAddress = results[0].address_components;
                var bairro;
                var cidade;
                var uf;



                angular.forEach(arrAddress, function (item, pos) {

                    if (item.types.indexOf('sublocality_level_1') > -1) // Bairro
                        bairro = item.long_name;

                    if (item.types.indexOf('administrative_area_level_2') > -1) // Cidade
                        cidade = item.long_name;

                    if (item.types.indexOf('administrative_area_level_1') > -1) // UF
                        uf = item.short_name;

                });



                            // Serviço busca

                             Search.setMethod('BuscarImoveisPorCoordenadasGeograficas');

                             Search.setQuery({
                                 Latitude: -23.002983,
                                 Longitude: -43.315733,
                                 Raio: $scope.range
                             });


                             Search.loadData().then(function(){

                                 responseArr = Search.result();
                                 points =  [];


                                 for (i = 0; i < responseArr.length; i++) {

                                      latitude = responseArr[i].CoordenadasGeograficas[0];
                                      longitude = responseArr[i].CoordenadasGeograficas[1];

                                      console.log(latitude +','+ longitude);

                                     points.push(new google.maps.LatLng(latitude,longitude));
                                
                                 }

                                
                                 googleMaps.placeRealties(points);

                                 $ionicLoading.hide();

                             });


                     });
                  });

                };




                $scope.onLoadSearch = function(){
                    console.log($scope.range + ' KM');
                    startSearch();
               }


               startSearch();



    })






    .controller('ResultsInMapsCtrl',function($scope, $state, $ionicLoading, $stateParams, ResultsInMap,$ionicModal, Location ,Search, FilterService ){


     
        var filter = FilterService.filter();
        var address = FilterService.address();
        var res = address.full.split(",");
       
        var responseArr;
        var points =  [];
        var realtyCode = [];
        var price = [];
        var ResultsInMap;

        $ionicLoading.show({
            content: 'Carregando',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

         

         
        // MODAL
        $ionicModal.fromTemplateUrl('app/modals/mapResultModal.html', {
           scope: $scope
        })
        .then(function(modal) {
            $scope.resultModal = modal;
        });

        $scope.resultMapModal = function(){
            $scope.resultModal.show();
        };


        var setMap = function(index, points, code, price) {

                var iconFile = 'https://dl.dropboxusercontent.com/u/30914005/house-icon2.png';
        
                marker = new google.maps.Marker({
                  position: points,
                  animation: google.maps.Animation.DROP,
                  icon:iconFile,
                  map: map,
                  title: "R$ " + price
                });
                marker.setMap(map);

                google.maps.event.addListener(marker, "click", function (e) {
                     $scope.resultMapModal();

                     var t = responseArr[index].TipoImovel;
                     $scope.tipodeimovel = "";
                     if(t == 2)
                        $scope.tipodeimovel = "Apartamento Padrão"
                     if(t == 5)
                        $scope.tipodeimovel = "Apart hotel"


                     
                     $scope.codeimovel = code;
                     $scope.endereco = responseArr[index].Endereco.EnderecoFormatado;
                     $scope.precolocacao = responseArr[index].PrecoLocacao;
                     $scope.qntquartos = responseArr[index].QtdDormitorios;
                     $scope.qntvagas = responseArr[index].QtdVagas;
                     $scope.areautil  = responseArr[index].AreaUtil;
                     $scope.imagemimovel = responseArr[index].Fotos[0].URLArquivo;

                     console.log($scope.codeimovel);

                   });

            };






        var googleMap = function(lat,long){

                myLatlng = new google.maps.LatLng(lat,long);

                var mapOptions = {
                    center: myLatlng,
                    zoom: 13,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControl: false,
                    scaleControl: false,
                    draggable: true,
                    maxZoom: 18
                };
                 
                 map = new google.maps.Map(document.getElementById("map"),
                 mapOptions);
                 map.setCenter(myLatlng);

        };


        // Abrir página de detalhe  
        $scope.goDetail = function() {
            var el = document.querySelector('#code-imovel');
            $state.go('app.realty-index', {'realtyCode': el.dataset.code});
        };



        var location = new Location();

        location.getPosition().then(function() {

            var lat = location.position.latitude;
            var long = location.position.longitude;

            

            // googleMaps = new ResultsInMap(lat,long);

            location.getReverse(lat,long).then(function(results) {

                 Search.setQuery({
                     Bairro: res[0],
                     Cidade: res[1],
                     UF: res[2]
                 });



                 Search.loadData().then(function(){

                     responseArr = Search.result();
                     googleMap(responseArr[0].CoordenadasGeograficas[0],responseArr[0].CoordenadasGeograficas[1]);



                     for (i = 0; i < responseArr.length; i++) {

                         latitude = responseArr[i].CoordenadasGeograficas[0];
                         longitude = responseArr[i].CoordenadasGeograficas[1];

                         points.push(new google.maps.LatLng(latitude,longitude));
                         realtyCode.push(responseArr[i].CodigoImovel);
                         price.push(responseArr[i].PrecoLocacao);
                         setMap(i, points[i], realtyCode[i], price[i]);
                        
                     }

            
                         $ionicLoading.hide();

                 });


            });

        });
               
    })




    .controller('SearchSavedCtrl', function ($scope, $state, Searches, FilterService) {


        var address = FilterService.address();
        var filter = FilterService.filter();

        $scope.savedSearches = Searches.all();

        $scope.filter = FilterService.filter();
        $scope.address = FilterService.address;



        $scope.openSearchSaved = function(index){

              var mySearchs = {

                     tipo_imovel: $scope.savedSearches[index].TipoImovel,
                     tipo_imovel_descricao: $scope.savedSearches[index].TipoImovelDescricao,
                     relevante: $scope.savedSearches[index].Relevante,
                     valorMin: $scope.savedSearches[index].ValorMin,
                     valorMax: $scope.savedSearches[index].ValorMax,
                     areaMax: $scope.savedSearches[index].AreaMax,
                     areaMin: $scope.savedSearches[index].AreaMin,
                     bairro: $scope.savedSearches[index].Bairro,
                     cidade: $scope.savedSearches[index].Cidade,
                     uf: $scope.savedSearches[index].UF,
                     full: $scope.savedSearches[index].Full,
                     vagas: $scope.savedSearches[index].Vagas.value,
                     quartos: $scope.savedSearches[index].Quartos.value
                     
                };


                    $scope.filter.selectedRealtyType = mySearchs.tipo_imovel;
                    $scope.filter.selectedMinRealtyPrice = mySearchs.valorMin;
                    $scope.filter.selectedMaxRealtyPrice = mySearchs.valorMax;
                    $scope.filter.selectedRealtyMinArea =  mySearchs.areaMin;
                    $scope.filter.selectedRealtyMaxArea =  mySearchs.areaMax; 
                    // $scope.filter.selectedOrderBy = 
                    $scope.filter.selectedRoom = mySearchs.quartos;
                    $scope.filter.selectedSpot = mySearchs.vagas;

                    $scope.address.bairro =  mySearchs.bairro;
                    $scope.address.cidade =  mySearchs.cidade;
                    $scope.address.uf =  mySearchs.cidade.uf;
                    $scope.address.full = mySearchs.full;

                    console.log(mySearchs.full);

                    // Abra a tela de resultados
                     $state.go('app.search-result');
             

        }

    });























