angular.module('app.restricted.report', [])
    .config(function ($ionicConfigProvider,$stateProvider, $controllerProvider) {
        $stateProvider
            .state('app.restricted-reports', {
                url: '/logged/reports',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'app/restricted/reports.html'
                    }
                },
                controller: 'RestrictedReportsCtrl'
            })
    })

    .controller('RestrictedReportsCtrl', function($scope, $state, $ionicLoading, ReportService, $http) {

        $ionicLoading.show({
         content: 'Carregando',
         animation: 'fade-in',
         showBackdrop: true,
         //maxWidth: 200,
         showDelay: 0
         });


        ReportService.retrieveReportData().then(function(response) {

            var ExtratoProprietario = response.data.ExtratoProprietario;

            var reportData = {
                LancamentosContratoImovel: ExtratoProprietario.LancamentosContratoImovel,
                LancamentosGerais: ExtratoProprietario.LancamentosGerais,
                LancamentosGeraisFuturos: ExtratoProprietario.LancamentosGeraisFuturos,
                LancamentosRemessa: ExtratoProprietario.LancamentosRemessa,
                LancamentosRemessaFuturos: ExtratoProprietario.LancamentosRemessaFuturos,
                Resumo: ExtratoProprietario.Resumo
            }

            $scope.data = reportData;

            $ionicLoading.hide();

        },function(response){

            console.log('ERRO: ' + JSON.stringify(response));
            $ionicLoading.hide();

        });

    })