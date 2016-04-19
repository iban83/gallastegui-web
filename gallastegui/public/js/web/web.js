var webAppModule = angular.module('web', [
		                                     	   'angularUtils',
                                                   //'ui.bootstrap.typeahead', 
                                                 //  'ui.bootstrap.carousel',
                                                  // 'ui.bootstrap', 
                                                   'ngTouch',//Para habilitar swipe en carousel (angular-touch.min.js)
                                                   'dialogs.main', 
                                                   'pascalprecht.translate', 
                                                   'dialogs.default-translations',	
                                                //   'djds4rce.angular-socialshare', //social share
                                                //   'currencyUtils',
                                                   'fcsa-number'//Formateo de numeros
                                                 //  'angular-jqcloud'//Para nube de tags (blog)
                                           ]);

webAppModule.config(['fcsaNumberConfigProvider', function(fcsaNumberConfigProvider) {
	  fcsaNumberConfigProvider.setDefaultOptions({
		  maxDecimals: 2,
		  thousandsSeparator: '.',
		  decimalSeparator: ','
	  });
}]);

//angular.module('shop').run(function($FB){
//	  $FB.init('386469651480295');
//});
