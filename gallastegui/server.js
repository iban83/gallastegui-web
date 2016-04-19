

#!/usr/bin/env node
var app = require('./app');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.listen( port, ipaddress, function() {
    console.log(("Hello world :: now is " + new Date()) + 'and server is listening on port ' + port);
});

//app.set('port', process.env.PORT || 3000);
//
//var server = app.listen(app.get('port'), function() {
//  debug('Express server listening on port ' + server.address().port);
//});
