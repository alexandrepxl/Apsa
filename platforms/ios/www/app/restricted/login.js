angular.module('app.restricted.login', [])
    .config(function ($ionicConfigProvider, $stateProvider) {

        $stateProvider
            .state('app.login', {
                url: '/login',
                cache:false,
                views: {
                    'menuContent': {
                        templateUrl: 'app/restricted/login.html',
                    }
                },
                controller:'LoginCtrl'
            })

            .state('app.profile', {
                url: '/profile',
                cache:false,
                views: {
                    'menuContent': {
                        templateUrl: 'app/restricted/profile.html',
                    }
                },
                controller:'ProfileCtrl'
            })
    })

    .controller('LoginCtrl', function($scope,$state,$ionicLoading, UserService) {

        $scope.loginUser = function() {

            $ionicLoading.show({
                content: 'Carregando',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });




            UserService.login('va3152', '123456').then(function(response) {

                UserService.user = response.Usuario;

                $ionicLoading.hide();
                $state.go('app.home');

                console.log(response);

            }, function(response){

                alert(response);

                $ionicLoading.hide();

            });

        };

    });