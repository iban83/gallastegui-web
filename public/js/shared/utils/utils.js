var angularUtils = angular.module('angularUtils', []);

angularUtils.constant("constants", 
		{'MAIL_CONTACT': 'hola@casildadecora.com',
		 'SERVER_URL' : 'http://127.0.0.1:3000'
		});

angularUtils.factory('postEmailForm', ['$http', '$rootScope', function($http, $rootScope, emailData){
	
	
   return {		   
	   
     sendEmail: function(isValid, emailData, notifyAlert) {

		if (! isValid) {
			if (notifyAlert) {
				alert('Rellena todos los campos para envial el email');
			}
			return;		
		} 
	
       //$http.post("/postEmail/", emailData).success(callback);
    	 var email = emailData;
    	 
    	 $http.post("/postEmail", {params: {emailData : emailData}}).
			success(function(data, status, headers, config) {
			    // this callback will be called asynchronously
			    // when the response is available
				var m = 'Mail enviado con éxito a \"' + email.to + '\"';
				//alert(message); 
				$rootScope.$broadcast('messageEmail',  { message: { msg: 'Tu consulta ha sido enviada. Nos pondremos en contacto contigo en un breve plazo de tiempo.<BR><BR>Muchas gracias.'} });
				$rootScope.$broadcast('clearEmailData');
			}).
			error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
				alert('ERROR al enviar el mail. Código: ' + status);
			});	    	 
     },
     
     sendNewsletter: function(isValid, emailData, notifyAlert) {
 	
        //$http.post("/postEmail/", emailData).success(callback);
     	 var email = emailData;
     	 
     	 $http.post("/cpanel/sendNewsletter", {params: {emailData : emailData}}).
 			success(function(data, status, headers, config) {
 			    // this callback will be called asynchronously
 			    // when the response is available
 				var m = 'Mail enviado con éxito a \"' + email.to + '\"';
 				//alert(message); 
 				$rootScope.$broadcast('messageEmail',  { message: { msg: 'Tu consulta ha sido enviada. Nos pondremos en contacto contigo en un breve plazo de tiempo.<BR><BR>Muchas gracias.'} });
 				$rootScope.$broadcast('clearEmailData');
 			}).
 			error(function(data, status, headers, config) {
 			    // called asynchronously if an error occurs
 			    // or server returns response with an error status.
 				alert('ERROR al enviar el mail. Código: ' + status);
 			});	    	 
      }
   }
}]);