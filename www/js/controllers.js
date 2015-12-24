var apsaCtrl = angular.module('app.controllers', ['ngCordova', 'maps.controllers']);
/*============================================================
=====================(1) MAIN CONTROLLER======================
============================================================*/
apsaCtrl.controller('godFather', 
    function($scope, $ionicModal, $ionicHistory, $state, MenuFactory, SearchFactory, testService, $cordovaGeolocation, $ionicLoading) {
    
    $ionicHistory.clearCache();

    $cordovaGeolocation
        .getCurrentPosition({
            timeout: 10000,
            enableHighAccuracy: false
        })
        .then(function(position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;

            testService.setMyLocation(lat,long);
        });


        testService.getReverseGeocoding().then(function(response) {
            SearchFactory.setAddress(response.data.results[0].address_components[0].long_name);
            testService.setMyAddress(response);
        });



   
    $scope.show = function() {
        $ionicLoading.show({
          template: 'Loading...'
        });
    };

    //Setup the menu items for the open area.
    $scope.menuOpenArea = MenuFactory.menuOpenArea;

    //Check if address is valid to popup a warning modal or goes to advanced search.
    $scope.address = SearchFactory.address;

    //Set and get the type of search.
    $scope.selectedType = SearchFactory.searchTypes;
    $scope.searchTypes = SearchFactory.searchTypes;

    //Create and call the modal template for warning empty search field.
    $ionicModal.fromTemplateUrl('templates/warningModal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    //Check if search is empty. If empty open warning modal, else go to advanced search.
    $scope.checkAddress = function() {
        if($scope.address.text == '') {
            $scope.modal.show();
        } else {
            //alert($scope.address.text);
            $scope.goAdvancedSearch = function() {
                $state.go('app.search-index');
            };
        }
    };

    //Go to map view to search by area
    $scope.goMapCreate = function(){
        $state.go('app.search-map');
    };

    //Go to login view
    $scope.goLogin= function(){
        $state.go('app.login');
    };

    //Go to register new user view
    $scope.goRegister= function() {
        $state.go('app.register');
    };

    $scope.goMaps = function(){
     console.log('fff');
     $state.go('app.mapResult');
     };
});

/*=============================================================
============(2) ADVANCED SEARCH SCREEN CONTROLLER==============
=============================================================*/
apsaCtrl.controller('advSearchCtrl', function($scope, $state, $stateParams, $ionicHistory, $ionicModal, SearchFactory, $ionicLoading, $q) {

   $ionicHistory.clearCache();

   $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

   var promise1 = SearchFactory.propertyTypes();
   var promise2 = SearchFactory.searchByMinValue();
   var promise3 = SearchFactory.searchByMaxValue();

   //console.log("searchTypes: " + $scope.selectedType.currentType.name);

    //Set ionic history and go back function to previous page. NOT NEEDED IF USING ION-NAV-BACK-BUTTON DIRECTIVE
    $scope.goBack = function() {
        $ionicHistory.goBack();
    };


    /**************************************************************
    **************CHECK THESE LINKS TO RESOLVE LATER***************
    http://stackoverflow.com/questions/27271917/html-select-doesnt-bind-to-controller-when-nested-in-ion-content
    http://codepen.io/TheCodeDestroyer/pen/jnpLq?editors=101
    **************************************************************/

    $scope.selectedType = SearchFactory.searchTypes;

    //Set select options items.
    /*TIPOS DE IMÓVEIS*/
    
    /*SearchFactory.propertyTypes().then(function(response) {

        data = response.ArrayOfFiltroTipoImovel;

        $scope.tipos = data;        
        $scope.selectedPropertyType = {
            currentPropertyType: data[0]
        };

    });*/

    $scope.imovel = SearchFactory.imovel;


    /*ORDENAR RESULTADOS POR*/
    $scope.ordens = SearchFactory.orderTypes;
    $scope.selectedOrderType = SearchFactory.orderTypes;

    /*DEFINIR VALOR MÍNIMO*/
    /*SearchFactory.searchByMinValue().then(function(response) {
        
        data = response.ArrayOfFiltroValorImovel;

        $scope.valoresMin = data        
        $scope.selectedMinValue = {
            currentMinValue: data[0]
        };

        $ionicLoading.hide();

    });*/

    $q.all([promise1, promise2, promise3]).then(function(data){
        
        var realtyTypes = data[0];
        var valoresMin = data[1];
        var valoresMax = data[2]
        

        $scope.realtyTypes = realtyTypes;
        $scope.realtyTypes.selectedRealtyType = realtyTypes[0];

        $scope.valoresMin = valoresMin;        
        $scope.selectedMinValue = valoresMin;

        /*DEFINIR VALOR MÁXIMO*/
        $scope.valoresMax = valoresMax;
        $scope.selectedMaxValue = valoresMax;


        /* After load all Promises */
        $ionicLoading.hide();

    });

    $scope.updateFilter = function(key) {

        console.log('updateFilter: ' + key);

        switch (key) {
          case "tipoImovel":
            SearchFactory.addFilter('realtyType', $scope.realtyTypes.selectedRealtyType.Codigo);
            break;
          case "minimoValor":
            console.log("Apples are $0.32 a pound.");
            break;
          case "maximoValor":
            console.log("Apples are $0.32 a pound.");
            break;
          case "minimaArea":
            console.log("Apples are $0.32 a pound.");
            break;
          case "maximaArea":
            console.log("Apples are $0.32 a pound.");
            break;
          case "roomNmb":
            console.log("Apples are $0.32 a pound.");
            break;
          case "spotNmb":
            console.log("Apples are $0.32 a pound.");
            break;
          default: 
            console.log("OK");
        }


    }

    

    /*DEFINIR ÁREA MÍNIMA*/
    $scope.areasMin = SearchFactory.searchByMinArea;
    $scope.selectedMinArea = SearchFactory.searchByMinArea;

    /*DEFINIR ÁREA MÁXIMA*/
    $scope.areasMax = SearchFactory.searchByMaxArea;
    $scope.selectedMaxArea = SearchFactory.searchByMaxArea;


    //Set return value for the number of rooms and car spots.
    $scope.rooms = SearchFactory.rooms;
    $scope.selectedRoom = SearchFactory.rooms;

    $scope.spots = SearchFactory.spots;
    $scope.selectedSpot = SearchFactory.spots;

    //Cancel search by code and return to parameters search
    $scope.whiteCover=angular.element(document.getElementById('whiteCover'));
    $scope.searchHintIcon=angular.element(document.getElementById('searchHint'));
    $scope.advSearch=angular.element(document.getElementById('advSearch'));
    $scope.searchHintBox=angular.element(document.getElementById('searchHintBox'));
    $scope.hintBox=false;

    $scope.cancelCodeSearch=function(){
        $scope.advSearch.removeClass('overHidden');
        $scope.popupFocus=angular.element(document.getElementById('popupFocus')).removeClass('popupFocus');
        if($scope.whiteCover.hasClass('whiteCover')){
            $scope.whiteCover.removeClass('whiteCover');
        }else if($scope.whiteCover.hasClass('blackCover')){
            $scope.whiteCover.removeClass('blackCover');
            $scope.searchHintIcon.removeClass('popupFocus');
            $scope.hintBox=false;
        }
        $scope.fixedBottom=angular.element(document.getElementById('advSearchButton')).removeClass('fixedBottom');
    };

    $scope.searchHint=function(){
        $scope.whiteCover.addClass('blackCover');
        $scope.searchHintIcon.addClass('popupFocus');
        $scope.hintBox=true;
    };

    //Set focus only at the search by code input.
    $scope.focusHere=function(){
        $scope.advSearch=angular.element(document.getElementById('advSearch')).addClass('overHidden');
        $scope.popupFocus=angular.element(document.getElementById('popupFocus')).addClass('popupFocus');
        $scope.whiteCover=angular.element(document.getElementById('whiteCover')).addClass('whiteCover');
        $scope.fixedBottom=angular.element(document.getElementById('advSearchButton')).addClass('fixedBottom');
        if($scope.hintBox=true){$scope.hintBox=false;};
        if($scope.whiteCover.hasClass('blackCover')){$scope.whiteCover.removeClass('blackCover')};
    };
    
    $scope.searchProperties=function(){
        $state.go('app.search-result');
    };
});

/*=============================================================
==============(3)SEARCH RESULT SCREEN CONTROLLER===============
=============================================================*/
apsaCtrl.controller('searchResultsCtrl', 
    function($scope, $state, $ionicSlideBoxDelegate, $ionicModal, SearchFactory, ResultsFactory, $ionicLoading, $q){

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    /*$scope.selectedPropertyType = SearchFactory.propertyTypes;
    $scope.selectedMaxValue = SearchFactory.searchByMaxValue;*/
    $scope.selectedRoom = SearchFactory.rooms;
    $scope.selectedSpot = SearchFactory.spots;
    /*$scope.selectedMaxArea = SearchFactory.searchByMaxArea;*/



    $scope.imovel = SearchFactory.imovel; //realtyCode
    $scope.realtyTypes = SearchFactory.realtyTypes;
    
    //console.log('scope ResultsFactory: ' + JSON.stringify($scope.realtyTypes));
    //console.log('SearchFactory.realtyTypes: ' + JSON.stringify(SearchFactory.realtyTypes));
    //console.log('scope SearchFactory.realtyTypes: ' + JSON.stringify(SearchFactory.realtyTypes));


    //$scope.searchResult = ResultsFactory.searchResult;

    $ionicModal.fromTemplateUrl('templates/saveSearchModal.html', {
        scope: $scope
    })
    .then(function(modal) {
        $scope.saveSearchModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modalNotFound.html', {
        scope: $scope
    })
    .then(function(modal) {
        $scope.notFoundModal = modal;
    });

    $scope.saveSearch=function(){
        $scope.saveSearchModal.show();
    };

    //Get the search results from factory service. 
    //searchRealtysByCode
    var promise1 = ResultsFactory.searchRealties();

    $q.all([promise1]).then(function(data) {
        
        $scope.results = data[0];
        $ionicLoading.hide();

      if(typeof data[0] != "undefined" && data[0] != null && data[0].length > 0){

           
        } else {

            $scope.notFoundModal.show();

        }

    });

    

    //See the search results on the map.
    $scope.goMaps=function(){
        $state.go('app.mapResult');
    };
    
    $scope.mapProperty = {
        /*image: $scope.results[0].image,
        title: $scope.results[0].title,
        room: $scope.results[0].room,
        spots: $scope.results[0].spots,
        area: $scope.results[0].area,
        price: $scope.results[0].rentPrice,
        distance: $scope.results[0].distance*/
    };

    $scope.propertySelected = false;
    $scope.closeProperty=function(){
        $scope.propertySelected=true;
    };

    //$scope.propertyPrice={price: $scope.results[0].rentPrice};

    //Go to the property details page.
    $scope.goDetails=function(realtyCode){
      
      SearchFactory.setRealtyCode(realtyCode);
      $state.go('app.propertyDetails');

    };
    $scope.navSlide = function(index){
        $ionicSlideBoxDelegate.slide(index, 1000);
    };


   
});


apsaCtrl.controller('realtyDetailsCtrl', function($scope, $state, $ionicModal, $ionicLoading, $ionicSlideBoxDelegate, SearchFactory, ResultsFactory, $q) {

    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);

    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      scaleControl: false,
      draggable: false,
      maxZoom: 16
    };

    var map = new google.maps.Map(document.getElementById("propertyMap"),
    mapOptions);

    /*var polyOptions = {
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3
    };*/


    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var promise1 = ResultsFactory.searchRealties();

    $q.all([promise1]).then(function(data) {
            
        results = data[0];
        
        var realty = {};
        var photos = {};

        
        realty.price = results[0].rentPrice;
        realty.code = results[0].code;
        realty.title = results[0].title;
        realty.realtyType = results[0].realtyType;; //TODO: create a method for convert 
        
        var areaFull = results[0].area.split(".");
        realty.area = areaFull[0];


        realty.dorms = results[0].dorms;
        realty.spots = results[0].spots;
        realty.suites = results[0].suites;
        realty.rentPrice = results[0].rentPrice;
        realty.distance = results[0].distance;

        realty.cond = results[0].distance;


        photos = results[0].photos;

        $scope.realty = realty;
        $scope.photos = photos;

        //console.log('Realty Details OBJ photos: ' + JSON.stringify($scope.photos));
        $ionicSlideBoxDelegate.update();
        $ionicLoading.hide();

    });

    $scope.navSlide = function(index){
        $ionicSlideBoxDelegate.slide(index, 1000);
    };

     $scope.goFullSlider = function(){
        $state.go('app.fullSlider');
    };


    $scope.propertyDetails={viewRetract: 'Ver mais detalhes'};
    $scope.detailedAttr=angular.element(document.getElementById('#detailedAttr'));
    $scope.viewRetractDetails=function(){
            $scope.propertyDetails={viewRetract: 'Retrair detalhes'};
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
    $ionicModal.fromTemplateUrl('templates/emailModal.html', {
        scope: $scope
    })
        .then(function(modal) {
            $scope.emailModal = modal;
        });
    $scope.mailModal=function(){
        $scope.emailModal.show();
    };
    $ionicModal.fromTemplateUrl('templates/sendMailModal.html', {
        scope: $scope
    })
        .then(function(modal) {
            $scope.sendMailModal = modal;
        });
    $scope.sendMail=function(){
        $scope.emailModal.hide();
        $scope.sendMailModal.show();
    };
    $ionicModal.fromTemplateUrl('templates/shareModal.html', {
        scope: $scope
    })
        .then(function(modal) {
            $scope.shareModal = modal;
        });
    $scope.shareIconsModal=function(){
        $scope.shareModal.show();
    };

});

/*=============================================================
===============(5) SAVED PROPERTIES CONTROLLER=================
=============================================================*/
apsaCtrl.controller('savedPropsCtrl', function($scope){

    
    var spec={id: 1, rooms: "2 quartos", spots: "1 vaga", area: "83m"};

    $scope.savedProps=[
        {id: 1, image: "../img/building.jpg", title:"Av. Nsa. Sra. de Copacabana - Copacabana - Rio de Janeiro - RJ", specs: spec, price:"200.000", distance: "54m", type: 'Aluguel'},
        {id: 2, image: "../img/building.jpg", title:"Campinho", specs: spec, price:"80.000", distance: "54m", type: 'Aluguel'},
        {id: 3, image: "../img/building.jpg", title:"Rio Bonito", specs: spec, price:"200.000", distance: "54m", type: 'Venda'},
        {id: 4, image: "../img/building.jpg", title:"Rua do Carmo", specs: spec, price:"80.000", distance: "54m", type: 'Aluguel'},
        {id: 5, image: "../img/building.jpg", title:"Rua Bento Lisboa - Catete", specs: spec, price:"200.000", distance: "54m", type: 'Venda'},
        {id: 6, image: "../img/building.jpg", title:"Av. das Américas - Barra da Tijuca", specs: spec, price:"80.000", distance: "54m", type: 'Venda'},
        {id: 7, image: "../img/building.jpg", title:"Rua Torre de Pedra - Praia da Brisa", specs: spec, price:"80.000", distance: "54m", type: 'Aluguel'},
        {id: 8, image: "../img/building.jpg", title:"Travessa dos Tamoios - Flamengo", specs: spec, price:"200.000", distance: "54m", type: 'Venda'},
        {id: 9, image: "../img/building.jpg", title:"Av. Vieira Souto - Quadra da Praia", specs: spec, price:"80.000", distance: "54m", type: 'Aluguel'},
        {id: 10, image: "../img/building.jpg", title:"Rua Farme de Amoedo - Ipanema - Rio de Janeiro - RJ", specs: spec, price:"2.700.000", distance: "103m", type: 'Venda'},
        {id: 11, image: "../img/building.jpg", title:"Rua dos Inválidos - Centro", specs: spec, price:"80.000", distance: "54m", type: 'Venda'}
    ];
});

/*=============================================================
================(6) SAVED SEARCHES CONTROLLER==================
=============================================================*/
/*apsaCtrl.controller('savedSearchesCtrl', function($scope){
    $scope.savedSearches= [
        {id: 0, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', propertyType: 'Apartamento', price: '200.000', rooms: '2', spots: '1', area: '82'},
        {id: 1, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', propertyType: 'Apartamento', price: '200.000', rooms: '2', spots: '1', area: '82'},
        {id: 2, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', propertyType: 'Apartamento', price: '200.000', rooms: '2', spots: '1', area: '82'},
        {id: 3, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', propertyType: 'Apartamento', price: '200.000', rooms: '2', spots: '1', area: '82'},
        {id: 4, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', propertyType: 'Apartamento', price: '200.000', rooms: '2', spots: '1', area: '82'},
        {id: 5, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', propertyType: 'Apartamento', price: '200.000', rooms: '2', spots: '1', area: '82'},
        {id: 6, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', propertyType: 'Apartamento', price: '200.000', rooms: '2', spots: '1', area: '82'},
        {id: 7, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', propertyType: 'Apartamento', price: '200.000', rooms: '2', spots: '1', area: '82'},
        {id: 8, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', propertyType: 'Apartamento', price: '200.000', rooms: '2', spots: '1', area: '82'},
        {id: 9, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', propertyType: 'Apartamento', price: '200.000', rooms: '2', spots: '1', area: '82'},
        {id: 10, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', propertyType: 'Apartamento', price: '200.000', rooms: '2', spots: '1', area: '82'},
        {id: 11, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', propertyType: 'Apartamento', price: '200.000', rooms: '2', spots: '1', area: '82'},
        {id: 12, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', propertyType: 'Apartamento', price: '200.000', rooms: '2', spots: '1', area: '82'}
    ];
});*/

/*=============================================================
================(7) LATEST RELEASES CONTROLLER=================
=============================================================*/
apsaCtrl.controller('latestReleasesCtrl', function($scope){
    $scope.latestReleases=[
        {id: 0, title: 'Rua Vilela Tavares - Meier Rio de Janeiro - RJ', rooms: '2', spots: '1', area: '82', price: '200.000', distance: '200m', image: '../img/release01.jpg'},
        {id: 1, title: 'Rua Vilela Tavares - Meier Rio de Janeiro - RJ', rooms: '2', spots: '1', area: '82', price: '200.000', distance: '200m', image: '../img/release01.jpg'},
        {id: 2, title: 'Rua Vilela Tavares - Meier Rio de Janeiro - RJ', rooms: '2', spots: '1', area: '82', price: '200.000', distance: '200m', image: '../img/release01.jpg'},
        {id: 3, title: 'Rua Vilela Tavares - Meier Rio de Janeiro - RJ', rooms: '2', spots: '1', area: '82', price: '200.000', distance: '200m', image: '../img/release01.jpg'},
        {id: 4, title: 'Rua Vilela Tavares - Meier Rio de Janeiro - RJ', rooms: '2', spots: '1', area: '82', price: '200.000', distance: '200m', image: '../img/release01.jpg'},
        {id: 5, title: 'Rua Vilela Tavares - Meier Rio de Janeiro - RJ', rooms: '2', spots: '1', area: '82', price: '200.000', distance: '200m', image: '../img/release01.jpg'},
        {id: 6, title: 'Rua Vilela Tavares - Meier Rio de Janeiro - RJ', rooms: '2', spots: '1', area: '82', price: '200.000', distance: '200m', image: '../img/release01.jpg'},
        {id: 7, title: 'Rua Vilela Tavares - Meier Rio de Janeiro - RJ', rooms: '2', spots: '1', area: '82', price: '200.000', distance: '200m', image: '../img/release01.jpg'},
        {id: 8, title: 'Rua Vilela Tavares - Meier Rio de Janeiro - RJ', rooms: '2', spots: '1', area: '82', price: '200.000', distance: '200m', image: '../img/release01.jpg'}
    ];
});

/*=============================================================
=====================(8) LOGIN CONTROLLER======================
=============================================================*/
apsaCtrl.controller('loginCtrl', function($scope, $state){
    $scope.goPswdRec= function() {
        $state.go('app.pswdRecovery');
    };
});

/*=============================================================
 =====================(9) REGISTER CONTROLLER======================
 =============================================================*/
apsaCtrl.controller('registerCtrl', function($scope){



});

/*=============================================================
 =====================(10) REGISTER CONTROLLER======================
 =============================================================*/
apsaCtrl.controller('pswdRecoveryCtrl', function($scope){

});