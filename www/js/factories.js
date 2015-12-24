var apsaFactories = angular.module('app.Factories', ['angularSoap','ngCordova','maps.controllers']); 
// TODO: Rename maps.controllers module 


/*=============================================================
=================(0)MENU ITEMS FACTORY SERVICE=================
=============================================================*/
apsaFactories.factory('MenuFactory', function(){
    var menuOpenArea = [
        {id: "0", icon: "ion-ios-search-strong", name: "Procurar imóveis", url: "homepage"},
        {id: "1", icon: "ion-ios-star-outline", name: "Imóveis salvos", url: "savedProperties"},
        {id: "2", icon: "ion-ios-film-outline", name: "Buscas salvas", url: "savedSearches"},
        {id: "3", icon: "ion-ios-paperplane-outline", name: "Lançamentos", url: "latestReleases"},
        {id: "4", icon: "ion-ios-lightbulb-outline", name: "Tutorial", url: "tutorial"},
        {id: "4", icon: "ion-thumbsup", name: "Avalie nosso aplicativo", url: "thumbsUp"}
    ];

    return {menuOpenArea: menuOpenArea};
});

/*=============================================================
=============(1)SEARCH PARAMETERS FACTORY SERVICE==============
=============================================================*/
apsaFactories.factory('SearchFactory', ['$soap',function($soap){

    var base_url = "http://wsapsa.hmg.marlin.com.br/APSA_WS_Servicos/APSAServicos.asmx"; 

    var imovel = {codigo: ''};
    
    var address = {};
        address.text = '';
    

    var searchTypes = [
        {value: 0, name: 'Alugar'},
        {value: 1, name: 'Comprar'}
    ];
    searchTypes.currentType = searchTypes[0];

    var orderTypes = [
        {value: "relevante", name: "Mais Relevante"},
        {value: "menorp", name: "Menor Preço"},
        {value: "maiorp", name: "Maior Preço"},
        {value: "menora", name: "Menor Área"},
        {value: "maiora", name: "Maior Área"}
    ];
    orderTypes.currentOrderType = orderTypes[0];


    var searchByMinArea = [
        {value: "qualquer", name: "Qualquer"},
        {value: "50", name: "50m"},
        {value: "60", name: "60m"},
        {value: "70", name: "70m"},
        {value: "80", name: "80m"}
    ];
    searchByMinArea.currentMinArea = searchByMinArea[0];

    var searchByMaxArea = [
        {value: "qualquer", name: "Qualquer"},
        {value: "50", name: "50m"},
        {value: "60", name: "60m"},
        {value: "70", name: "70m"},
        {value: "80", name: "80m"}
    ];
    searchByMaxArea.currentMaxArea = searchByMaxArea[0];

    var rooms = [
        {value: 1, name: '1+'},
        {value: 2, name: '2+'},
        {value: 3, name: '3+'},
        {value: 4, name: '4+'},
        {value: 5, name: '5+'}
    ];
    rooms.currentRoom = rooms[0];

    var spots = [
        {value: 0, name: '0+'},
        {value: 1, name: '1+'},
        {value: 2, name: '2+'},
        {value: 3, name: '3+'},
        {value: 4, name: '4+'}
    ];
    spots.currentSpot = spots[0];

    /*var SearchFactory = {};

    SearchFactory.realtyTypes = {
        
        selectedPropertyType: undefined

    };*/

    var sharedObject = {};
    var filter = {};
    var realtyTypes = {};

    var propertyTypes = function() {
        var method = (searchTypes.currentType.value == 0) ? 'BuscarFiltrosTipoImovelAluguel' : 'BuscarFiltrosTipoImovelVenda';

        return $soap.post(base_url,method).then(function(response) {

            if (Object.keys(response) == 'ApsaRetorno') {
                return false;

            } else {

                realtyTypes = response.ArrayOfFiltroTipoImovel;
                selectedRealtyType =  realtyTypes[0];
                
                return realtyTypes;
            }
            
        });
    };
    
    return {
        imovel: imovel,
        setRealtyCode: function(value) {
            imovel.codigo = value;
        },
        address: address,
        setAddress: function(value) {
            address.text = value
        },
        searchTypes: searchTypes,
        propertyTypes: propertyTypes,
        orderTypes: orderTypes,
        searchByMinValue: function() {

            var searchByMinValue = [];
            var method = (searchTypes.currentType.value == 0 ) ? 'BuscarFiltrosValorImovelAluguel' : 'BuscarFiltrosValorImovelVenda';

            return $soap.post(base_url, method).then(function(response) {

                if (Object.keys(response) == 'ApsaRetorno') {
                    return searchByMinValue;

                } else {

                    searchByMinValue = response.ArrayOfFiltroValorImovel;
                    searchByMinValue.currentMinValue = searchByMinValue[0];
                    return searchByMinValue;
                }
            });
        },
        searchByMaxValue: function() {
            
            var searchByMaxValue = [];
            var method = (searchTypes.currentType.value == 0 ) ? 'BuscarFiltrosValorImovelAluguel' : 'BuscarFiltrosValorImovelVenda';

            return $soap.post(base_url, method).then(function(response) {

                if (Object.keys(response) == 'ApsaRetorno') {
                    return searchByMaxValue;

                } else {

                    searchByMaxValue = response.ArrayOfFiltroValorImovel;
                    searchByMaxValue.currentMaxValue = searchByMaxValue[0];
                    return searchByMaxValue;
                }
            });


        },
        searchByMinArea: searchByMinArea,
        searchByMaxArea: searchByMaxArea,
        rooms: rooms,
        spots: spots,
        SetSelectedType: function(value) {
            sharedObject.SelectedType = value;
        },
        GetSelectedType: function() {
            return sharedObject.SelectedType
        },
        addFilter: function(key, value) {
            filter[key] = value;
        },
        filter: filter,
    };

}]);

/*=============================================================
===============(2)SEARCH RESULT FACTORY SERVICE================
=============================================================*/
apsaFactories.factory('ResultsFactory', ['SearchFactory','testService', '$soap', function($SearchFactory, $testService, $soap){
    
    var base_url = "http://wsapsa.hmg.marlin.com.br/APSA_WS_Servicos/APSAServicos.asmx"; 
    
    var searchRealtiesByCode = function() {

            var codigo = $SearchFactory.imovel.codigo;
            var method = ($SearchFactory.searchTypes.currentType.value == 0 ) ? 'BuscarImoveisAluguelPorCodigo' : 'BuscarImoveisVendaPorCodigo';
            
            return $soap.post(base_url, method, {CodigoImovel: codigo, UF: 'RJ'}).then(function(response) {

                if (Object.keys(response) == 'ApsaRetorno') {

                    var results = [];

                    console.log('ApsaRetorno' + JSON.stringify(response));
                    return results;

                } else {

                    results = [];

                    responseArr = response.ArrayOfImovel;
                    
                    for(i=0;i<responseArr.length;i++){

                        o = {};
                        o.id = i;
                        o.title = responseArr[i].Endereco + ' - ' + responseArr[i].Bairro;
                        o.price  = responseArr[i].PrecoLocacao;
                        //o.realtyType = responseArr[i].TipoImovel;
                        
                        o.realtyType = 'Apartamento';

                        o.code = responseArr[i].CodigoImovel;
                        o.area = responseArr[i].AreaUtil;
                        o.dorms = responseArr[i].QtdDormitorios;
                        o.suites = '0';
                        o.spots = responseArr[i].QtdVagas;
                        o.rentPrice = responseArr[i].PrecoLocacao;
                        o.distance = '300';
                        o.photos = responseArr[i].Fotos;

                        //console.log('RealtiesByCode Count ' + JSON.stringify(responseArr[i].Fotos));
                        
                        results.push(o);
                        
                    }

                    return results;
                }
            });

    };

    var searchRealtysByFilter = function() {

        var method = ($SearchFactory.searchTypes.currentType.value == 0 ) ? 'BuscarImoveisAluguel' : 'BuscarImoveisVenda';
        //var selectedRealtyType = $SearchFactory.GetSelectedType();
        var filter = $SearchFactory.filter;
        var address = $testService.getMyAddress();

        var query = {};

            query.TipoImovel = filter.realtyType;
            //query.ValorLocacaoInicial = filter.startValue;
            //query.ValorLocacaoFinal = filter.endValue;
            //query.QuantidadeDormitorios = filter.roomsCount;
            //query.QuantidadeVagas = filter.spotsNumber;
            //query.AreaConstruida = filter.area;

            query.Cidade = address.Cidade;
            query.Bairro = address.Bairro; 
            query.UF = address.UF;

        return $soap.post(base_url, method, query).then(function(response) {

            var results = [];

            if (Object.keys(response) == 'ApsaRetorno') {

                console.log('ApsaRetorno' + JSON.stringify(response));
                
                return results;

            } else {

                results = [];

                responseArr = response.ArrayOfImovel;
                //console.log('IMOVEIS ARRAY: ' + JSON.stringify(responseArr));
                
                for(i=0;i<10;i++){

                    o = {};
                    o.id = i;
                    o.title = responseArr[i].Endereco + ' - ' + responseArr[i].Bairro;
                    o.price  = responseArr[i].PrecoLocacao;
                    
                    //o.realtyType = responseArr[i].TipoImovel;
                    o.realtyType = 'Apartamento';

                    o.code = responseArr[i].CodigoImovel;
                    o.area = responseArr[i].AreaUtil;
                    o.dorms = responseArr[i].QtdDormitorios;
                    o.suites = '0';
                    o.cond = responseArr[i].PrecoCondominio;
                    o.spots = responseArr[i].QtdVagas;
                    o.rentPrice = responseArr[i].PrecoLocacao;
                    o.distance = '500';
                    o.image = {};
                    o.photos = responseArr[i].Fotos;
                    
                    //fotosArr = responseArr[i].Fotos;
                    //console.log('Fotos ARR Lenght ' + fotosArr.length);

                    results.push(o);
                    
                }

                return results;
            }

        });
        
    };

    return {
        searchRealties: function() {
            //console.log('SearchRealties: ' + $SearchFactory.currentType);

            var codigo = $SearchFactory.imovel.codigo;
            return (typeof codigo  !== "undefined" && codigo) ? searchRealtiesByCode() : searchRealtysByFilter();

        },

    };


}]);