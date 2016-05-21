var express = require('express');
var router = express.Router();
var mailer = require ('../config/mailer');


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
	res.render('index', { title: 'Express' });
});
router.get('/servicios/mantenimiento.html', function(req, res) {
	res.render('servicios/mantenimiento', { title: 'Mantenimiento Integral Avanzado, un nuevo concepto de mantenimiento.' });
});
router.get('/servicios/energia.html', function(req, res) {
	res.render('servicios/energia', { title: 'Energía e iluminación.' });
});
router.get('/servicios/automatizacion.html', function(req, res) {
	res.render('servicios/automatizacion', { title: 'Automatización y robótica' });
});
router.get('/servicios/galeria.html', function(req, res) {
	res.render('servicios/galeria', { title: 'Proyectos destacados' });
});
router.get('/empresa/bolsadeempleo.html', function(req, res) {
	res.render('empresa/bolsadeempleo', { title: 'Bolsa de empleo' });
});
router.get('/empresa/contacto.html', function(req, res) {
  res.render('empresa/contacto', { title: 'Contacta con Gallastegui' });
});
router.get('/empresa/corporacion.html', function(req, res) {
  res.render('empresa/corporacion', { title: 'Gallastegui' });
});


module.exports = router;
