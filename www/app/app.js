angular.module('app', [
    'ionic', 
    'ionic.contrib.drawer', 
    'app.Factories', 
    'app.controllers', 
    'maps.controllers',
    'app.config',
    'app.services',
    'app.home',
    'app.search',
    'app.realty',
    'app.register',
    'app.restricted.login',
    'app.restricted.home',
    'app.restricted.report',
    'app.restricted.directives',
    'ngCordova'

])

.constant('CONFIG', { 'DEBUG':true })


.run(function($ionicPlatform) {

    $ionicPlatform.ready(function() {
        
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                // $cordovaPlugin.someFunction().then(success, error);
    

    if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

    }
    if(window.StatusBar) {
        StatusBar.styleDefault();
    }
});

})

.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider, $controllerProvider) {
        
        
});



