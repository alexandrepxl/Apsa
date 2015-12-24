angular.module('app.config',[])
.constant('method', {
	'rent' : {
		'searchByCode' :  'BuscarImoveisAluguelPorCodigo',
		'searchByFilter' : 'BuscarImoveisAluguel',
	},
	'sell' : {
		'searchByCode' :  'BuscarImoveisAluguelPorCodigo',
		'searchByFilter' : 'BuscarImoveisAluguel' 
	}
});