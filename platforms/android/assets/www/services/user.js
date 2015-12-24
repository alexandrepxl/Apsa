angular.module('app.services.user', [])

    .service('UserService', function($soap, $q) {
        var name;
        var email;
        var profiles = [];
        var logged = false;
        var base_url = "http://wsapsa.hmg.marlin.com.br/APSA_WS_Servicos/APSAServicos.asmx";

        var user = {};
        var method = "ObterDadosUsuario";

        this.login = function(username, password) {

            $soap.setCredentials(username, password);

            return $soap.post(base_url,method);

        }

        this.user = function() {
            return user;
        }

    })


    .service('ListaCondoPerfilCondomino', function($soap, $q) {

        var base_url = "http://wsapsa.hmg.marlin.com.br/APSA_WS_Servicos/APSAServicos.asmx";

        var method = "ListarCondominiosUsuarioPerfilSindico";

        var condominios = {};

        this.condomino = function(username, password){

            $soap.setCredentials(username, password);

            return $soap.post(base_url, method);
        }

        this.condominios = function(){

            return  condominios;
        }



    })