var apsaDirectives = angular.module('app.restricted.directives', []);

/*=============================================================
 =================(0)MENU ITEMS FACTORY SERVICE=================
 =============================================================*/
//Directive to create html content for the condos
apsaDirectives.directive('condos', function() {
    return {
        restric: 'E',
        templateUrl: 'app/restricted/condos.html'
    };
});

//Directive to create HTML content for the realties
apsaDirectives.directive('realties', function() {
    return {
        restric: 'E',
        templateUrl: 'app/restricted/realties.html'
    };
});