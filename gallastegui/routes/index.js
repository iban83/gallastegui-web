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
	res.render('servicios/mantenimiento', { title: 'Mantenimiento' });
});
router.get('/servicios/energia.html', function(req, res) {
	res.render('servicios/energia', { title: 'Mantenimiento' });
});
router.get('/servicios/ingenieria.html', function(req, res) {
	res.render('servicios/ingenieria', { title: 'Mantenimiento' });
});
router.get('/servicios/galeria.html', function(req, res) {
	res.render('servicios/galeria', { title: 'Mantenimiento' });
});
router.get('/empresa/bolsadeempleo.html', function(req, res) {
	res.render('empresa/bolsadeempleo', { title: 'Mantenimiento' });
});
router.get('/empresa/contacto.html', function(req, res) {
  res.render('empresa/contacto', { title: 'Mantenimiento' });
});
router.get('/empresa/corporacion.html', function(req, res) {
  res.render('empresa/corporacion', { title: 'Mantenimiento' });
});


module.exports = router;
