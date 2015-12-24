angular.module('app.restricted.home', [])

    .config(function ($ionicConfigProvider, $stateProvider) {

        $stateProvider

            .state('app.home', {
                url: '/restricted/home',
                cache:false,
                views: {
                    'menuContent': {
                        templateUrl: 'app/restricted/home.html',
                    }
                },
                controller:'RestrictedHomeCtrl'
            })

            .state('app.condominio', {
                url: '/restricted/condominio',
                cache:false,
                views: {
                    'menuContent': {
                        templateUrl: 'app/restricted/condominio.html',
                    }
                },
                controller:'RestrictedCondominioCtr'
            })
    })




    .controller('RestrictedHomeCtrl', function($scope, $state, $ionicLoading, UserService) {


        var result = UserService.user;

        $scope.resultUser = {             
               id: result.Perfis.Perfil.Id,
               login: result.Login,
               email: result.Email,
               tipo_pessoa: result.TipoPessoa,
               tipo_nome: result.Perfis.Perfil.Nome,
               cpf: result.Cpf
        }



         // função para adicionar título de acordo com o usuário!
         $scope.title = function(){
            var titulo = "";
            if($scope.resultUser.id == 1)
                titulo = "Meus imóveis"
            if($scope.resultUser.id == 2)
                titulo = "Meus aluguéis"
            if($scope.resultUser.id == 5)
                titulo = "Condômino"

            return titulo;
        }



        // apagar ( Criar o service )

        $scope.realties = [{
            id: 0,
            address: 'R. SA FERREIRA, 228/903 - COPACABANA',
            contract: '23263',
            situation: 'Locado',
            tenant: 'Adriana Spinelli Soares Henriques',
            value: 'R$4.037,47',
            validity: '07/07/2011 a 06/01/2014',
            nextAdjustment: '07/07/2015'
          }];

          

        $scope.openCondominio = function(){

            $state.go('app.condominio');
        }


  






        // $ionicLoading.show({
        //         content: 'Carregando',
        //         animation: 'fade-in',
        //         showBackdrop: true,
        //         maxWidth: 200,
        //         showDelay: 0
        //     });


        // Teste para envio de mensagem 

        $scope.condominios = [{
                                condominio: "Condonio Jacamin", gerente: "Alexandre", agecia: 002, cota: 0022

                             },
                             {
                                condominio: "Condonio Jacamin", gerente: "", agecia: 002, cota: 0022

                             }
                            ]



        // ListaCondoPerfilCondomino.condomino('va3152', '123456').then(function(response) {

        //         ListaCondoPerfilCondomino.condominios = response.ArrayOfCondominio;

        //         $ionicLoading.hide();
        
        //         console.log("Resultado: " + response);

        //     }, function(response){

        //         alert(response);

        //         $ionicLoading.hide();

        //     });





        // $scope.checkProfile = function(){
            
        //     if(){

        //     }
        // }


  



        /*$ionicLoading.show({
            content: 'Carregando',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });*/



    })

     .controller('RestrictedCondominioCtrl',function ($scope) {
         
     });