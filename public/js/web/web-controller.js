
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
	
//		alert('!$scope.contactForm.$valid: ' + !$scope.contactForm.$valid);
		
		if (!isValid) {
//			alert('isValid: ' + isValid);
//			dialogs.error("Error", "Por favor, rellena todos los campos correctamente");
			return;
		}
//		alert("es valido");
		var emailData = {
			    from: $scope.mail.from,
			    to: "Gallastegui <" + constants.MAIL_CONTACT + ">",
			    subject: "Contacto web: " + $scope.mail.name + " asunto: " + $scope.mail.subject ,
			    text: $scope.mail.from + " escribió: " + $scope.mail.text
			};

		$scope.sendingMail = true;
		postEmailForm.sendEmail(isValid, emailData);
	}

	$scope.$on('messageEmail', function(event, args) {
		alert("Mensaje enviado corréctamente");
		//dialogs.notify("Información", args.message.msg);
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

