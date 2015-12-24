angular.module('app.services.search', [])

.service('FilterService', function($soap, $q) {
	
  var base_url = "http://wsapsa.hmg.marlin.com.br/APSA_WS_Servicos/APSAServicos.asmx";
  //var base_url = "http://areaexclusiva.apsa.com.br/wsapsa/APSAServicos.asmx";

  var _filter = {
      selectedSearchType:'',
      selectedRealtyType:'',
      selectedMinRealtyPrice:'',
      selectedMaxRealtyPrice:'',
      selectedRealtyMinArea:'',
      selectedRealtyMaxArea:'',
      selectedOrderBy:'',
      realtyCode:''
  };

  var address = {
    bairro:'',
    cidade:'',
    uf:'',
    full:''
  };

  var searchTypes = [

      {value: 0, name: 'Alugar'},
      {value: 1, name: 'Comprar'}
  ];

  searchTypes.currentType = searchTypes[0];

  var _realtyTypes = {};
  var _minValue = {};
  var _realtyPrices = {};

  var areaSizes = [
  {value: "qualquer", name: "Qualquer"},
  {value: "50", name: "50m"},
  {value: "60", name: "60m"},
  {value: "70", name: "70m"},
  {value: "80", name: "80m"}
  ];

  var orderByOptions = [
  {value: "relevante", name: "Mais Relevante"},
  {value: "menorp", name: "Menor Preço"},
  {value: "maiorp", name: "Maior Preço"},
  {value: "menora", name: "Menor Área"},
  {value: "maiora", name: "Maior Área"}
  ];

  

  var rooms = [
  {value: 1, name: '1+'},
  {value: 2, name: '2+'},
  {value: 3, name: '3+'},
  {value: 4, name: '4+'},
  {value: 5, name: '5+'}
  ];


  var spots = [
  {value: 0, name: '0+'},
  {value: 1, name: '1+'},
  {value: 2, name: '2+'},
  {value: 3, name: '3+'},
  {value: 4, name: '4+'}
  ];

  /**
   *  Filtro Tipos de Imóveis [ Apartamentos / Apart-Hotel ] etc
   *  Se o serviço retornar vazio poderá gerar um erro
   **/
  var loadRealtyTypes = function() {

    var deferred = $q.defer();
    var method = (_filter.selectedSearchType.value == 0) ? 'BuscarFiltrosTipoImovelAluguel' : 'BuscarFiltrosTipoImovelVenda';
    _realtyTypes = [{"Codigo":"0","Descricao":"Não Definido"}];

    //alert(_filter.selectedSearchType.value == 0 ? 'BuscarFiltrosTipoImovelAluguel' : 'BuscarFiltrosTipoImovelVenda');

    $soap.post(base_url,method)
    .then(function(response) {

      if (response.ArrayOfFiltroTipoImovel !== undefined) {
        _realtyTypes = response.ArrayOfFiltroTipoImovel;
      }

     deferred.resolve();    

   }, function(response) {

     deferred.reject('Error loading data from BuscarFiltrosTipoImovelAluguel');    

   });

    return deferred.promise;
  }

    /**
     * Valores das propriedades,  para filtros de valor máximo e mínimo
     * Caso o serviço da APSA esteja retornando vazio, poderá gerar um erro no app
     */
  var loadRealtyValues = function() {

    var deferred = $q.defer();
    var method = (_filter.selectedSearchType.value == 0 ) ? 'BuscarFiltrosValorImovelAluguel' : 'BuscarFiltrosValorImovelVenda';
    _realtyValues  = [];


    $soap.post(base_url,method)
    .then(function(response) {

     if (response.ArrayOfFiltroValorImovel !== undefined) {
         _realtyValues = response.ArrayOfFiltroValorImovel;
     }

     deferred.resolve();    

   }, function(response) {

     deferred.reject('Error loading data from BuscarFiltrosValorImovelAluguel');    

   });

    return deferred.promise;

  }

  var loadRealtyPrices = function() {

    var deferred = $q.defer();
    var method = (_filter.selectedSearchType.value == 0 ) ? 'BuscarFiltrosValorImovelAluguel' : 'BuscarFiltrosValorImovelVenda';
    _realtyPrices = [];

    $soap.post(base_url,method)
    .then(function(response) {

    if (response.ArrayOfFiltroValorImovel !== undefined) {
        _realtyPrices = response.ArrayOfFiltroValorImovel;
    }

     deferred.resolve();    

   }, function(response) {

     deferred.reject('Error loading data from BuscarFiltrosValorImovel');    

   });

    return deferred.promise;

  }


  this.loadData = function() {

    var deferred = $q.defer();
    var loadRealtyTypesPromise = loadRealtyTypes();
    var loadRealtyValuesPromise = loadRealtyValues();
    var loadRealtyPricesPromise = loadRealtyPrices();

    $q.all([
     loadRealtyTypesPromise, 
     loadRealtyValuesPromise,
     loadRealtyPricesPromise]).then(function(data){

       deferred.resolve();

     }, function (error) {

       deferred.reject(error);
       console.log('FilterService loadData: ' + error);

     });

     return deferred.promise;

   }

   this.getRealtyTypes = function() {

    return _realtyTypes;
  }

  this.getRealtyPrices = function() {

    return _realtyPrices;
  }

  this.getSearchTypes = function() {
    return searchTypes;
  }

  this.getRoomOptions = function() {

    return rooms;
  }

  this.getSpotsOptions = function() {

    return spots;
  }

  this.getOrderByOptions = function() {

    return orderByOptions;
  }

  this.getAreaSizes = function() {

    return areaSizes;
  }

  /*this.setAddress = function(_address) {
    this.address = _address;
  }*/

  this.address = function() {

    return address;
  }

  this.filter = function() {

    return _filter;
  }


})

.factory('Favorites', function() {
  return {
    
      all: function() {
        var realties = window.localStorage['realties'];
        if (realties) {
          return angular.fromJson(realties);
        }
        return [];
      },
      save: function(realties) {
        window.localStorage['realties'] = angular.toJson(realties);

        console.log("Realties: " + angular.toJson(realties));

      },
      delete: function() {
        window.localStorage.removeItem('realties');
      },
      favids: function() {

          var items = this.all();
          var favids =[];

          for (i=0; i<items.length;i++) {
            
            favids.push(items[i].code);

          }

          return favids; 
      }
  }
})

.factory('Searches', function() {

    return {
        all: function() {
            var searches = window.localStorage['searches'];
            if (searches) {
                return angular.fromJson(searches);
            }
            return [];
        },
        save: function(searches) {
             window.localStorage['searches'] = angular.toJson(searches)
        },
        delete: function() {
            window.localStorage.removeItem('searches');
        },
    }
})



.service('Search', function($soap, $q, FilterService) { // RENOMEAR FilterService PARA FILTERSERVICE

  var base_url = "http://wsapsa.hmg.marlin.com.br/APSA_WS_Servicos/APSAServicos.asmx";
  //var base_url = "http://areaexclusiva.apsa.com.br/wsapsa/APSAServicos.asmx";

  var method;
  var address = FilterService.address;
  var _filter = FilterService.filter();
  var responseArr = [];
  var query;
  

  this.loadData = function() {

    var deferred = $q.defer();

    $soap.post(base_url,method,query)
    .then(function(response) {

     if (response.ArrayOfImovel !== undefined) {
         responseArr = response.ArrayOfImovel;
     }

     deferred.resolve();    

    }, function(response) {

      deferred.reject('Error loading data from searchRealtiesByFilter');    

    });

    return deferred.promise;

  }

  this.setQuery = function(_query) {
    query = _query;
  }

  this.setMethod = function(_method) {
    method = _method;
  }

  this.result = function() {
    return responseArr;
  }

})

.factory('SearchFactory', function($soap, $q, FilterService) {
  
  var base_url = "http://wsapsa.hmg.marlin.com.br/APSA_WS_Servicos/APSAServicos.asmx";
  //var base_url = "http://areaexclusiva.apsa.com.br/wsapsa/APSAServicos.asmx";

  var responseArr = [];

  return {
    loadData: function(method, query) {

      var deferred = $q.defer();

      $soap.post(base_url,method,query)
      .then(function(response) {

       if (response.ArrayOfImovel !== undefined) {
           responseArr = response.ArrayOfImovel;
       }

       deferred.resolve();    

      }, function(response) {

        deferred.reject('Error loading data from searchRealtiesByFilter');    

      });

      return deferred.promise;
    },
    getResult: function() {
      return responseArr;
    }
  }

})

// This should be on map Services //
.factory('LocationService', function($http) {

  var api_key = 'AIzaSyC_Um7H7bwlY3KWRD0us7dUEs1bvJuPLoo';

  var gmapsUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
  var apiDistanceMatrix = 'https://maps.googleapis.com/maps/api/distancematrix/json?';


  return {
    getGeocoding: function(address) {

      var gmapsService = gmapsUrl + 'address=' + address + '&key=' + api_key + '&result_type=neighborhood|locality|country|administrative_area_level_1';

      return $http.get(gmapsService);

    },
    getReverseGeocoding: function(lat,lgt) {

      var gmapsService = gmapsUrl + 'latlng=' + lat + ',' + lgt + '&key=' + api_key + '&result_type=neighborhood';
      return $http.get(gmapsService);

    },

    getDistanceMatrix: function(from, to) {

      //var from = '-22.9442686,-43.1774267';
      //var to = 'Sao Paulo';

      var gmapsService = apiDistanceMatrix + 'origins=' + from + '&destinations=' + to + '&mode=driving';

      return $http.get(gmapsService);

    }

  }

});








