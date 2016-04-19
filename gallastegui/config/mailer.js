/*** 
 *
 * Modulo encargado del envío de correos electrónicos mediante nodemailer
 * 
 * 
 */
var nodemailer = require('nodemailer');

//Para el envío mediante SMTP
var smtpTransport = require('nodemailer-smtp-transport');
//Para el envío mediante SMTP Pool (email masivo)
var smtpPoolTransport = require('nodemailer-smtp-pool');



var path = require('path');
var templatesDir = path.resolve(__dirname, '..', 'templates');
var emailTemplates = require('email-templates');

//Module configuration
//---------------------

var options = {
		host : 'smtp.mailgun.org',
		port : 587,					// port for secure SMTP
		secureConnection: true,	// TLS requires secureConnection to be false
		auth: {
		  user: 'postmaster@gallastegui.eu',
		  pass: 'c5add83d465e473d4687776cf9612703'   
		 },
//		tls: {
//			rejectUnauthorized: false,
//			ciphers:'SSLv3'
//		},
		debug : true
};

var smtpConfig = {
	    host: 'smtp.gmail.com',
	    port: 465,
	    secure: true, // use SSL
		auth : {
			user: 'ivan.rodriguez@gallastegui.eu',				//'i.montehermoso@globec.es',
			pass: '1v4ng4ll4st3gu1'							//'1m4n0lgl0b3c786'
		}
	};


var smtpTransporter
    , message;

var nodemailer = require('nodemailer');
//send mail with password confirmation
//var smtpTransporter = nodemailer.createTransport( {
// service:  'Mailgun',
// auth: {
//  user: 'postmaster@sandbox48b0d92c38ad4c2aa929ea2fc145d573.mailgun.org',
//  pass: 'ab47644f2425efa3da3c95334dd6a294'   
// }
//});

message = {
    from: 'info@gallastegui.eu',
    to: 'ivan.rodriguez@gallastegui.eu', // comma separated list
    subject: 'Subject Line',
    text: 'Text contents.',
    html: '<b>Text contents.</b>'
  };
  
 

//Creamos el transporter SMTP normal
var smtpTransporter = nodemailer.createTransport(smtpTransport(options));

//Creamos el transporter SMTP para Pooled Connections
var smtpPoolOptions = options;
smtpPoolOptions.maxConnections = 5;
smtpPoolOptions.maxMessages= 10;
console.log("smtpPoolOptions: " + JSON.stringify(smtpPoolOptions));
var smtpPoolTransporter = nodemailer.createTransport(smtpPoolTransport(smtpPoolOptions));

console.log("mailer.js cargado OK");


//module.exports = transporter;
module.exports.smtpTransporter = smtpTransporter;
module.exports.smtpPoolTransporter = smtpPoolTransporter;


var EmailAddressRequiredError = new Error('email address required');

exports.sendOne = function (templateName, locals, fn) {
	// make sure that we have an user email
	if (!locals.email) {
		return fn(EmailAddressRequiredError);
	}
	// make sure that we have a message
	if (!locals.subject) {
		return fn(EmailAddressRequiredError);
	}
	emailTemplates(templatesDir, function (err, template) {
		if (err) {
			//console.log(err);
			return fn(err);
		}
		// Send a single email
		template(templateName, locals, function (err, html, text) {
			if (err) {
				//console.log(err);
				return fn(err);
			}
			// if we are testing don't send out an email instead return
			// success and the html and txt strings for inspection
			if (process.env.NODE_ENV === 'test') {
				return fn(null, '250 2.0.0 OK 1350452502 s5sm19782310obo.10', html, text);
			}
			//var transport = defaultTransport;
			var transport = smtpTransporter;
			
			transport.sendMail(
//					{
//				from: 'Moet <' + options.auth.user + '>',		//options.auth.user, 		//config.mailer.defaultFromAddress,
//				to: locals.email,
//				subject: locals.subject,
//				html: html,
//				// generateTextFromHTML: true,
//				text: text
//			}
					message
			, function (err, responseStatus) {
				if (err) {
					console.log("Error al enviar correo: " + err);
					return fn(err);
				}
				console.log("No ha habido error: " + err);

				return fn(null, responseStatus.message, html, text);
			});
		});
	});
}
