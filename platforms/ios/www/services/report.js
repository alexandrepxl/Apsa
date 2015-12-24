angular.module('app.services.report', [])

    .service('ReportService', function($soap, $http, UserService, CONFIG) {

        var base_url = "http://wsapsa.hmg.marlin.com.br/APSA_WS_Servicos/APSAServicos.asmx";
        var method = "ListarDadosExtratoProprietario";

        this.retrieveReportData = function() {

            //UserService
            //$soap.setCredentials(username, password);


            //TODO: remove this debug
            if (CONFIG.DEBUG) {


                return  $http.get('appdata/reports.json');



            } else {
                return $soap.post(base_url,method,{ano:'2015', mes:'08'});
            }



        }

    });