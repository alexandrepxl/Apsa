angular.module('app.home', [])

.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider, $controllerProvider) {
	// remove back button text completely
        $ionicConfigProvider.backButton.previousTitleText(false).text('');
        $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'app/home/menu.html',
            controller:'HomeCtrl'
        })

        .state('app.homepage', {
            url: '/homepage',
            cache:false,
            views: {
                'menuContent': {
                    templateUrl: 'app/home/homepage.html'
                }
            }
        })

        $urlRouterProvider.otherwise('/app/homepage');
        //$urlRouterProvider.otherwise('/app/logged/reports');
        $controllerProvider.allowGlobals();
})

.factory('MenuFactory', function(){
    
    var menuOpenArea = [
        {id: "0", icon: "ion-ios-search-strong", name: "Procurar imóveis", url: "homepage"},
        {id: "1", icon: "ion-ios-star-outline", name: "Imóveis salvos", url: "realty/saved"},
        {id: "2", icon: "ion-ios-film-outline", name: "Buscas salvas", url: "search/saved"},
        //{id: "3", icon: "ion-ios-paperplane-outline", name: "Lançamentos", url: "latestReleases"},
        {id: "4", icon: "ion-ios-lightbulb-outline", name: "Tutorial", url: "tutorial"},
        {id: "4", icon: "ion-thumbsup", name: "Avalie nosso aplicativo", url: "thumbsUp"},
        {id: "5", icon: "ion-ios-lightbulb-outline", name: "Área Logada - Extrato", url: "logged/reports"}
    ];

    return {menuOpenArea: menuOpenArea};
})

.controller('HomeCtrl', function($scope, $state, $ionicHistory, $ionicModal, $ionicLoading, FilterService, MenuFactory, Location) {
	
    $ionicHistory.clearCache(); 

    $ionicModal.fromTemplateUrl('templates/locationsModal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
	
	//Setup the menu items for the open area.
    $scope.menuOpenArea = MenuFactory.menuOpenArea;

    var filter = {};
	$scope.filter = FilterService.filter();

	var address = {};
	$scope.address = FilterService.address();

    $scope.searchTypes = FilterService.getSearchTypes();

    
    $scope.filter.selectedSearchType = $scope.searchTypes[0];
    
    $ionicModal.fromTemplateUrl('templates/locationsModal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });


    $scope.goMapCreate = function(){
        $state.go('app.search-map');
    };

    //Go to login view
    $scope.goLogin = function(){
        $state.go('app.login');
    };

    //Go to register new user view
    $scope.goRegister = function() {
         $state.go('app.register');
    };

    $scope.requestLatLong = function() {


        var loc = new Location();
        //console.log('teste fora: ' + loc.getData());

        loc.getPosition().then(function() {

            console.log('location then: ' + JSON.stringify(loc));

            //console.log('reverse ' + JSON.stringify());

            loc.getByAddress('Avenida das Bauhineas');

            //$ionicLoading.hide();
        });



    };

    $scope.goAdvancedSearch = function() {

    };
    
})

.controller('LocationsModalController', function($scope, $state, FilterService) {

    
    $scope.address = FilterService.address();

    $scope.setLocation = function(item){
      
        FilterService.address = item;
        
        $scope.modal.hide();
        $state.go('app.search-index');
  
        console.log('LocationsModalController: ' + JSON.stringify(FilterService.address));
      
    }


});






