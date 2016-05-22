angular.module('web')

//Servicio compartido mediante factory, con los siguientes objetivos:
//
//- Obtener los productos de la base de datos
//- Permitir la comunicacion entre controllers
//
.factory('sharedService', ['$rootScope', '$http', '$window',  function ($rootScope, $http, $window) {

	
	var productConstants = "";
	var sharedService = {};
	
	//Variable para almacenar los mensajes que se van a mostrar en el cotroller
	var messageToShow = "";



	
	// Inicializa la imagen de perfil subida por fileUpload
	sharedService.setImageProfileUrl = function(imgUrl) {
		sharedService.imageProfileUrl = imgUrl;		
	}
	
	sharedService.saveUserData = function(customer, oldPassword, newPassword) {
		
		var urlAction = '/cpanel/customer/save';

		console.log("service:save - customer._id: " + customer._id);
		console.log("service:save - customer: " + JSON.stringify(customer));

		$http.post(urlAction, {
			params: customer,
			oldPassword: oldPassword,
			newPassword: newPassword }
		).success(function(data) {
			console.log("Respuesta SUCCESS de /customer/save: --> " + data);

			console.log("tipo devuelto: " + typeof(data));

			try {
				if (typeof(data) === 'string') {

					//Devuelve string con el error
					if (data.indexOf("Error") == 0) {
						sharedService.notifyError(data);	
					} else {
						sharedService.notifyError("Error desconocido");		   		    		
					}

				} else if (typeof(data) === 'object') {

					//Refrescamos la lista de Usuarios
					sharedService.notifyMessage("Datos modificados con éxito");
				} else {
					sharedService.notifyError("Objeto desconocido!!");
				}

				sharedService.setIsProcessingSave(false);
				
			} catch (err) {
				sharedService.notifyError("Exception: " + err.message);

				sharedService.setIsProcessingSave(false);
			}			    				    	
		}).error(function(data) {
			sharedService.notifyError("Error al guardar. Por favor, revisa los datos introducidos: " + data);
			console.log("Respuesta ERROR de /customer/save: --> " + data);
			sharedService.setIsProcessingSave(false);
		});
	}	
	
	sharedService.saveAddressData = function(customer, addressType) {
		
		var urlAction = '/cpanel/customer/saveAddress';

		console.log("service:save - customer._id: " + customer._id);
		console.log("service:save - customer: " + JSON.stringify(customer));

		$http.post(urlAction, { 
			params: customer, 
			addressType: addressType }
		).success(function(data) {
			console.log("Respuesta SUCCESS de /customer/saveAddress: --> " + data);

			console.log("tipo devuelto: " + typeof(data));

			try {
				if (typeof(data) === 'string') {

					//Devuelve string con el error
					if (data.indexOf("Error") == 0) {
						sharedService.notifyError(data);	
					} else {
						sharedService.notifyError("Error desconocido");		   		    		
					}

				} else if (typeof(data) === 'object') {

					//Refrescamos la lista de Usuarios
					sharedService.notifyMessage("Dirección modificada con éxito");
				} else {
					sharedService.notifyError("Objeto desconocido!!");
				}

				sharedService.setIsProcessingSave(false);
				
			} catch (err) {
				sharedService.notifyError("Exception: " + err.message);

				sharedService.setIsProcessingSave(false);
			}			    				    	
		}).error(function(data) {
			sharedService.notifyError("Error al guardar. Por favor, revisa los datos introducidos: " + data);
			console.log("Respuesta ERROR de /customer/save: --> " + data);
			sharedService.setIsProcessingSave(false);
		});
	}	

	//
	// Funcion para llamar a resetSavingData desde el otro controller
	//
	sharedService.setIsProcessingSave = function (isProcessingSave) {
		//alert('enviando: ' + isProcessingSave);
		$rootScope.$broadcast('resetSavingData', {isProcessingSave: isProcessingSave});
	};
	

	
	
	
	//
	// Funcion para llamar a clear del dialogo
	//
	sharedService.clear = function () {
		$rootScope.$broadcast('clear');
	}
	
	//
	// Envia por proadcast el mensaje 'error' a sus listeners, y el error en la variable 'error'
	sharedService.notifyError = function(error) {
		sharedService.messageToShow = error;
		$rootScope.$broadcast('error');		
	}

	//
	// Envia por proadcast el mensaje 'message' a sus listeners, y el mensaje en la variable 'message'
	sharedService.notifyMessage = function(message) {
		sharedService.messageToShow = message;
		$rootScope.$broadcast('message');		
	}


	 
	

	/***
	 * 
	 * COMENTARIOS
	 * 
	 */

	sharedService.postComment = function(comment, blogPost) {	

		$http.post('/postComment/' + blogPost._id, { 
			params: {
				blogPost: blogPost, comment : comment
			}
		}).success(function(data) {
			console.log("Respuesta SUCCESS de article.postComment: --> " + data);

			console.log("tipo devuelto: " + typeof(data));

			try {
				if (typeof(data) === 'string') {

					//Devuelve string con el error
					if (data.indexOf("ERROR") == 0) {
						sharedService.notifyError("Ocurrió un error al publicar el comentario. Por favor, contacta con tu administrador");			    		
					} else {
						//Devuelve objeto con el document. Cerramos el dialogo
						//$('#modalCreateCustomer').modal('hide');
						
						//sharedService.notifyMessage("Comentario publicado con éxito");

						//Refrescamos la lista de Usuarios
//						sharedService.fetch();

						$rootScope.$broadcast('postComment');
					}

				} else {
					sharedService.notifyError("Error desconocido!!");
				}
			} catch (err) {
				sharedService.notifyError("Exception: " + err.message);
			}			    				    	
		}).error(function(data) {
//			$('#modalCreateProduct').modal('hide');
			sharedService.notifyError("Error al publicar el comentario. Por favor, revisa los datos introducidos: " + data);
			console.log("Respuesta ERROR de postComment: --> " + data);
		});
	}	
	

	/**
	 * Envía el correo de eliminación de cuenta al usuario
	 */
	sharedService.sendDeleteAccountEmail = function() {
		console.log("en sendDeleteAccountEmail");
		$http.post('/requestDeleteAccount/' , { 
				params: {
					
				}
			}).success(function(data) {
				console.log("Respuesta SUCCESS de deleteAccount: --> " + data);

				console.log("tipo devuelto: " + typeof(data));

				try {
					$rootScope.$broadcast('onAccountDeleted');	
					
				} catch (err) {
					sharedService.notifyError("Exception: " + err.message);
				}			    				    	
			}).error(function(data) {
//				$('#modalCreateProduct').modal('hide');
				sharedService.notifyError("Error al eliminar la cuenta de usuario. Por favor, consulta con Moet");
				console.log("Respuesta ERROR de deleteAccount: --> " + data);
			});
		}
	
	
	return sharedService;
}]);
