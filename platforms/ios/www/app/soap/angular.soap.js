angular.module('angularSoap', [])

.factory("$soap",['$q',function($q){
	return {
		post: function(url, action, params){
			var deferred = $q.defer();
			
			//Create SOAPClientParameters
			var soapParams = new SOAPClientParameters();
			for(var param in params){
				soapParams.add(param, params[param]);
			}
			
			//Create Callback
			var soapCallback = function(e){

				if(e.constructor.toString().indexOf("function Error()") != -1){
					deferred.reject("An error has occurred.");
				} else {
					
					if (Object.keys(e) == 'ApsaRetorno') {

						//console.log('ApsaRetorno [angular.soap.js]: ' + 'rejected');

						console.log('Apsa Retorno ' + e.ApsaRetorno.Sucesso);

						if (e.ApsaRetorno.Sucesso == 'false') {
							deferred.reject("Return: False");
						} else {
							deferred.resolve(e);
						}
					} else {
						deferred.resolve(e);
					}
				}
			}
			
			SOAPClient.invoke(url, action, soapParams, true, soapCallback);

			return deferred.promise;
		},
		setCredentials: function(username, password){
			SOAPClient.username = username;
			SOAPClient.password = password;
		}
	}
}]);
