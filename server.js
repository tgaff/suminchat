// THIS MAY BE DEPRECATED IF WE KEEP THE GULP CONFIG
// TODO: switch heroku over to gulp too...?

var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();
var getTranslatorKey = require('./translator-key.js');
var redirectToChat = require('./redirect.js')(/\/$/, '/chat.html');

console.log("ITS ALIVE!!!!!!! !!!!!!!");


var port = (process.env.PORT || 8000);

app.use(getTranslatorKey);
app.use(redirectToChat);

app.use(serveStatic(__dirname)).listen(port);
