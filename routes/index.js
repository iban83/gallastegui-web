var express = require('express');
var router = express.Router();
var mailer = require ('../config/mailer');


var description = 'Gallastegui: Proveedor global de servicios para la industria y la construcción. Instalaciones eléctricas. Mantenimiento industrial. Instalación de viviendas en construcción. Automatización y robótica.';
var descriptionEnergia = 'Gallastegui: Realizamos todo tipo de instalaciones eléctricas, cuadros de control y maniobra. Iluminación led y eficiencia energética en el área de Bilbao, Vizcaya y País Vasco.'
var descriptionAutomatizacion = '';
var descriptionMantenimiento = 'Gallastegui es líder en la prestación de servicios de mantenimiento en Bilbao. Diseñamos y ejecutamos planes de mantenimiento preventivo y correctivo en el tejido industrial vasco.';

var keywords = "GALLASTEGUI, ELECTRICIDAD, MANTENIMIENTO, INDUSTRIA, INSTALACIONES ELÉCTRICAS, AUTOMATIZACIÓN, ROBOTICA, LIMPIEZA INDUSTRIAL, BILBAO, BIZKAIA, VIZCAYA";
var keywordsMantenimiento = "GALLASTEGUI, MANTENIMIENTO, PREVENTIVO, CORRECTIVO, MECÁNICO, ELÉCTRICO, HIDRAÚLICO, REPARACIÓN, MECANIZADOS, BOBINADOS, REPARACION MOTORES, LIMPIEZAS";
var keywordsEnergia = "GALLASTEGUI, ILUMINACION, LED, INSTALACIONES ELÉCTRICAS, ELECTRICIDAD, CUADROS ELÉCTRICOS, PLACAS SOLARES, EFICIENCIA ENERGÉTICA, ENERGÍA";
var keywordsAutomatizacion = "";


/***************
 * UTILS ROUTES *
 ***************/
router.post('/postEmail', function(req, res) {
	//Your NodeMailer logic comes here
	//Prueba sendmail
	console.log("ANTES del get mail");

	var mail = req.body.params.emailData;
	
	console.log("req.body.params.emailData " + req.body.params.emailData);
	
//	mail = {
//		    from: 'info@gallastegui.eu',
//		    to: 'ivan.rodriguez@gallastegui.eu', // comma separated list
//		    subject: 'Subject Line',
//		    text: 'Text contents.',
//		    html: '<b>Text contents.</b>'
//		  };
		  

	console.log("emailData: " + mail.toString);
	
	mail.to = "ivan.rodriguez@gallastegui.eu";

	mailer.smtpTransporter.sendMail(mail, function(error, response){
		
		if(error){
			
			console.log(error);
			res.send(500);
			
		} else {
			
			console.log("Message sent: " + response);
			res.status(200).end();
		}    

	});
	console.log("Mail enviado. a la espera de respuesta...");
});

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { 	title: 'Gallastegui - Mantenimiento industrial, iluminación y energía, automatización y robótica.' 
							, description: description
							, keywords: keywords
						});
});
router.get('/servicios/mantenimiento.html', function(req, res) {
	res.render('servicios/mantenimiento', { title: 'Mantenimiento Integral Avanzado, un nuevo concepto de mantenimiento.'
		, description: descriptionMantenimiento
		, keywords: keywordsMantenimiento

	});
});
router.get('/servicios/energia.html', function(req, res) {
	res.render('servicios/energia', { title: 'Energía e iluminación.' 
		, description: descriptionEnergia
		, keywords: keywordsEnergia

	});
});
router.get('/servicios/automatizacion.html', function(req, res) {
	res.render('servicios/automatizacion', { title: 'Automatización y robótica'
		, description: description
		, keywords: keywords
	});
});
router.get('/servicios/galeria.html', function(req, res) {
	res.render('servicios/galeria', { title: 'Proyectos destacados'
		, description: description
		, keywords: keywords
	});
});
router.get('/empresa/bolsadeempleo.html', function(req, res) {
	res.render('empresa/bolsadeempleo', { title: 'Bolsa de empleo' 
		, description: description
		, keywords: keywords
	});
});
router.get('/empresa/contacto.html', function(req, res) {
  res.render('empresa/contacto', { title: 'Contacta con Gallastegui' 
	  , description: description
	  , keywords: keywords

	});
});
router.get('/empresa/corporacion.html', function(req, res) {
  res.render('empresa/corporacion', { title: 'Gallastegui' 
	  , description: description
	  , keywords: keywords

	});
});


module.exports = router;
