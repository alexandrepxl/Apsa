angular.module('app.register', [])

.config(function ($ionicConfigProvider, $stateProvider) {

        $stateProvider
            .state('app.register', {
                url: '/register',
                cache:false,
                views: {
                    'menuContent': {
                        templateUrl: 'app/register/register.html',
                    }
                },
                controller:'registerCtrl'
            })

    })


.controller('registerCtrl', function($scope){


})