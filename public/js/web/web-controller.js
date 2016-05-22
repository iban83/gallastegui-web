
angular.module('web')


.controller('blogPostListCtrl', ['$scope', '$http', 'sharedService', 'dialogs', function ($scope, $http, sharedService, dialogs) {

	$scope.words = [];
	
	$scope.getTags = function() {
		$http.get('/blog/tags', {params: {}})
	    .success(function(data) { 
	    		
	    	//alert("tags obtenidos de db: " + JSON.stringify(data));
	    	$scope.words = data.tags;			 
	    })
	    .error(function(data) {

	    	alert('Error al obtener los Tags del Blog');
	    	console.log('Error: ' + data);
	    });
	}
	
	$scope.getTags();
	
}])

//-------------------------------------------------------------------------------------------------------------------------------------------

.controller('mailCtrl', ['$scope', 'postEmailForm', 'dialogs', 'constants', function ($scope, postEmailForm, dialogs, constants) {

	$scope.mail = {};
	//Flag para deshabilitar el boton de enviar mail mientras se esta enviando uno
	$scope.sendingMail = false;
	
	
	
	//
	// Envia un mail de contacto a Casilda desde la página (email de contacto) 
	//
	$scope.sendMailContact = function(isValid) {
	
		//alert('!$scope.contactForm.$valid: ' + !$scope.contactForm.$valid);
		
//		alert('isValid: ' + isValid);
		if (!isValid) {
			dialogs.error("Error", "Por favor, rellena todos los campos correctamente");
			return;
		}
		alert("es valido");
		var emailData = {
			    from: $scope.mail.from,
//			    to: "Moet <imanol00@gmail.com>",//"Moet <info@casildadecora.com>",
			    to: "Moet <" + constants.MAIL_CONTACT + ">",
			    subject: "Email de contacto: " + $scope.mail.name,
			    text: $scope.mail.text
			    //html: "<b>Conoce Moet</b>"
			};

		$scope.sendingMail = true;
		postEmailForm.sendEmail(isValid, emailData);
	}

	$scope.$on('messageEmail', function(event, args) {
		dialogs.notify("Información", args.message.msg);
	});
	
	$scope.$on('clearEmailData', function(event, message) {
		$scope.mail = {};
		$scope.sendingMail = false;
});
	
}])

//-------------------------------------------------------------------------------------------------------------------------------------------

.controller('viewBlogPostCtrl', ['$scope', '$http', '$location', 'sharedService', 'dialogs', function ($scope, $http, $location, sharedService, dialogs) {

	$scope.words = [];
	
	$scope.getTags = function() {
		$http.get('/blog/tags', {params: {}})
	    .success(function(data) { 
	    		
	    	//alert("tags obtenidos de db: " + JSON.stringify(data));
	    	$scope.words = data.tags;			 
	    })
	    .error(function(data) {

	    	alert('Error al obtener los Tags del Blog');
	    	console.log('Error: ' + data);
	    });
	}
	
	$scope.getTags();
	
	//$scope.blogPost = null;
	$scope.comment = {};
	
	//Contador de las veces que se ha compartido en FB
	$scope.fbShares = 0;
	
	$scope.locationToShare = $location.absUrl();
	
	$scope.initBlogPost = function(blogPost) {
		
		if (blogPost._id != null) {
			
			$scope.blogPost = blogPost;
			$scope.blogPostTitle = blogPost.title;
			$scope.blogPostBody = blogPost.body;
			$scope.blogPostTags = blogPost.tags;
			
			//sharedService.setImages(blogPost.images);

						
		} else {
			$scope.isEditing = false;
		}
	};
	
	
	$scope.getComments = function() {
		//alert("usuario del comentario 0: " + $scope.blogPost.comments[0].user.name + " - comentario: " + $scope.blogPost.comments[0].body);
		return $scope.blogPost.comments;
	}

	/**
	 * Publica un comentario
	 */
	$scope.postComment = function(comment) {
		//console.log("postComment!! --> usuario: " + comment.userName + "\nemail: " + comment.email + "\nbody: " + comment.body);
		
		sharedService.postComment(comment, $scope.blogPost);
	}
	
	/**
	 * Limpia el formulario de comentario
	 */
	$scope.clearCommentForm = function(comment) {
		$scope.comment = {};
		$scope.postCommentForm.$setPristine();
	}

	//
	// Receptor del evento 'postComment': confirma el comentario y resetea el formulario
	//
	$scope.$on('postComment', function () {
		$scope.clearCommentForm();
		dialogs.notify("Publicar comentario", "Comentario publicado correctamente");
	});
	
}])


/**
 * Directiva para deshabilitar el botón de un formulario normal (no ajax) al ser enviado, y así prevenir el envío múltiple del formulario
 * 
 */
.directive('clickOnce', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var replacementText = attrs.clickOnce;

            element.bind('click', function() {
                $timeout(function() {
                    if (replacementText) {
                        element.html(replacementText);
                    }
                    element.attr('disabled', true);
                }, 0);
            });
        }
    };
})

//-------------------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------------------------

.controller('accountCtrl', ['$scope', 'dialogs', 'constants', 'sharedService', function ($scope, dialogs, constants, sharedService) {

	$scope.user = undefined;

	var ADDRESS_TYPE_0_SHIPPING = 0;
	var ADDRESS_TYPE_1_INVOICING = 1;
	
	//Flag para indicar que se están guardando los datos y se debe deshabilitar el botón
	$scope.isSavingData = false;


	//---------------------------- Para DatePicker ----------------------------------------------------------------------------------
	$scope.openBirthdayDate = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.initDateOpened = true;
	};
	
	//Seleccionamos el formato
	$scope.format = 'dd-MM-yyyy';

	//Fecha mínima: $scope.minDate
	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.dateOptions = {
			formatYear: 'yyyy',
			startingDay: 1			//Lunes
	};
	
	//-----------------------------------------------------------------------------------------------------------------
	
	
	$scope.init = function(user) {
		console.log('en account: ' + JSON.stringify(user));
		//alert (JSON.stringify(user));
		$scope.user = user;
		
		if ($scope.user.profilepic != null && $scope.user.profilepic != "") {
			$('.profile-pic').attr("src", $scope.user.profilepic);
            //$('<p/>').text($scope.user.profilepic).appendTo(document.body);
		} 
	}
	
	$scope.saveUserData = function(isUserValid) {
		$scope.isSavingData = true;
		if ($scope.validateUserFields($scope.user)) {
			//añadimos la imagen
			
			//console.log("sharedService.imageProfileUrl " + sharedService.imageProfileUrl );
			if (sharedService.imageProfileUrl != "") {
//				alert (sharedService.imageProfileUrl);
				$scope.user.profilepic = sharedService.imageProfileUrl;
			}
			//console.log("$scope.user.profilepic  " + $scope.user.profilepic  );

			
			
			sharedService.saveUserData($scope.user, $scope.oldPassword, $scope.newPassword);
		}
	}

	$scope.saveUserShippingAddress = function (isAddressValid) {
		//alert('en saveUserAddress: ' + JSON.stringify($scope.user.address));	
		$scope.isSavingData = true;			
		if ($scope.validateAddressFields($scope.user.shippingAddress)) {
			sharedService.saveAddressData($scope.user, ADDRESS_TYPE_0_SHIPPING);
		}
	}
	
	$scope.saveUserInvoicingAddress = function (isAddressValid) {
		//alert('en saveUserAddress: ' + JSON.stringify($scope.user.address));	
		$scope.isSavingData = true;			
		if ($scope.validateAddressFields($scope.user.shippingAddress)) {
			sharedService.saveAddressData($scope.user, ADDRESS_TYPE_1_INVOICING);
		}
	}

	$scope.validateUserFields = function(user) {
		if (user.name != null && user.name != "" &&
			user.lastname != null && user.lastname != "") {
			
			if ($scope.validatePasswords($scope.oldPassword, $scope.newPassword, $scope.newPasswordConfirm)) {
				return true;	
			} else {
				$scope.isSavingData = false;
				return false;
			}
			
		} else {
			alert('Por favor, rellena todos los campos');
			return false;
		}
	}
	
	$scope.validatePasswords = function(oldPassword, newPassword, newPasswordConfirm) {
//		console.log("oldPassword: " + oldPassword);
//		console.log("newPassword: " + newPassword);
//		console.log("newPasswordConfirm: " + newPasswordConfirm);
		
		//VAlidamos los passwords
		if (oldPassword != null || newPassword != null || newPasswordConfirm != null ) {
//			alert("HAy alguno != null");
			if (oldPassword == null || newPassword == null || newPasswordConfirm == null ) {
//				alert("HAy alguno == null");
				dialogs.error('Error', 'Por favor, introduce todos los campos de contraseña si deseas modificarla');
				return false;
			} else if (oldPassword == "" || newPassword == "" || newPasswordConfirm == "" ) {
//				alert("HAy alguno == ''");
				dialogs.error('Error', 'Por favor, introduce todos los campos de contraseña si deseas modificarla');
				return false;
				
			} else
				//Comprobamos que coincidan
				if (newPassword != newPasswordConfirm) {
					dialogs.error('Error', 'ERROR: Las contraseñas no coinciden');
					return false;					
				}
				else {
					console.log("oldPassword: " + oldPassword);
					console.log("newPassword: " + newPassword);
					console.log("newPasswordConfirm: " + newPasswordConfirm);
					
					return true;
				}
		} else {
//			alert("Todos los passwords vacios");
			//No hacemos nada
			console.log("Todos los passwords vacios");
			return true;
		}		
	}
	
	$scope.validateAddressFields = function(address) {
		if (address.street != null && address.street != "" &&
			address.number != null && address.number != "" &&
			address.floor != null && address.floor != "" &&
			address.postalCode != null && address.postalCode != "" &&
			address.city != null && address.city != "" &&
			address.province != null && address.province != "" 	) {
			return true;
		} else {
			alert('Por favor, rellena todos los campos');
			return false;
		}
	}	
	
	$scope.copyShippingAddress = function() {
		//Clonar objeto sin copiar la referencia
		$scope.user.invoicingAddress = JSON.parse(JSON.stringify($scope.user.shippingAddress));
	}
	
	//---------------------- Para eliminar cuenta ------------------------------------------------------------------------------------------------

	$scope.deleteAccount = function() {		
		dlg = dialogs.confirm('Eliminar Cuenta', "¿Deseas eliminar por completo tu cuenta de Moet? Perderás todos tus datos y tu histórico de compras");
	    dlg.result.then(function(btn){
			sharedService.sendDeleteAccountEmail();
	    },function(btn){
	    	//No hacemos nada
	    });
	}
	
	//
	// Receptor del evento 'resetSavingData': resetea el flag 'isSavingData'
	//
	$scope.$on('onAccountDeleted', function (event, message) {
		dialogs.confirm('Eliminar Cuenta', "Te hemos enviado un correo electrónico con las instrucciones que tienes que seguir para confirmar la eliminación de tu cuenta");
	});	
	//---------------------------------------------------------------------------------------------------------------------------------------------

	//
	// Receptor del evento 'resetSavingData': resetea el flag 'isSavingData'
	//
	$scope.$on('resetSavingData', function (event, message) {
		$scope.isSavingData = message.isProcessingSave;
	});	
	
	
	//Borramos la foto
	//
	//controlador de fileupload
	$('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
            	//console.log(JSON.stringify(file));
            	$('.profile-pic').attr("src", file.url + file._id);
               // $('<p/>').text(file.name).appendTo(document.body);
               // alert('imagen subida: ' + file.url + "::" + file._id);
            	sharedService.setImageProfileUrl(file.url + file._id);
            });
        }
    });		
}])


//------------------------------------------------------------------------------------------------------------------------------------

.controller('orderListCtrl', ['$scope', '$http', 'sharedService', 'dialogs', function ($scope, $http, sharedService, dialogs) {

	$scope.orders = [];
	
	$scope.init = function(orders) {
		$scope.orders = orders;
	}
	
	$scope.getStateDesc = function(state) {
		var stateDesc = "Desconocido";
		switch(state) {
		case 0:
			//Pendiente de Pago
			stateDesc = "Pendiente de Pago";
			break;
		case 1:
			//Procesado
			stateDesc = "Procesado";
			break;
		case 2: 
			//Enviado
			stateDesc = "Enviado";
			break;
		case 3: 
			//En tránsito
			stateDesc = "En tránsito";
			break;
		case 4: 
			//Entregado
			stateDesc = "Entregado";
			break;
		case 5: 
			//Rechazado
			stateDesc = "Rechazado";
			break;
		case 6: 
			//Devuelto
			stateDesc = "Devuelto";
			break;
		default:
			stateDesc = "Desconocido";
			//Salimos
			return;
		};
		
		return stateDesc ;
	}
	
}])

//------------------------------------------------------------------------------------------------------------------------------------

.controller('currentOrderCtrl', ['$scope', '$http', 'sharedService', 'dialogs', function ($scope, $http, sharedService, dialogs) {

	$scope.currentOrder;
		
	$scope.initOrder = function(order) {
		$scope.currentOrder = order;
//		alert("$scope.currentOrder: " + $scope.currentOrder);
//		alert("$scope.currentOrder.orderLines: " + $scope.currentOrder.orderLines);
	}	
	

	$scope.getStateDesc = function(state) {
		var stateDesc = "Desconocido";
		switch(state) {
		case 0:
			//Pendiente de Pago
			stateDesc = "Pendiente de Pago";
			break;
		case 1:
			//Procesado
			stateDesc = "Procesado";
			break;
		case 2: 
			//Enviado
			stateDesc = "Enviado";
			break;
		case 3: 
			//En tránsito
			stateDesc = "En tránsito";
			break;
		case 4: 
			//Entregado
			stateDesc = "Entregado";
			break;
		case 5: 
			//Rechazado
			stateDesc = "Rechazado";
			break;
		case 6: 
			//Devuelto
			stateDesc = "Devuelto";
			break;
		default:
			stateDesc = "Desconocido";
			//Salimos
			return;
		};
		
		return stateDesc ;
	}
}])

//-------------------------------------------------------------------------------------------------------------------------------------------

.controller('resetPasswordCtrl', ['$scope', 'dialogs', 'constants', 'sharedService', function ($scope, dialogs, constants, sharedService) {
	$scope.email = undefined;
	
	$scope.onClick = function() {
		if (! $scope.email) {
			dialogs.error("Error", "Por favor, introduce un mail");
		} else {
			alert ("OK");
		}
	}
}])

//------------------------------------------------------------------------------------------------------------------------------------
