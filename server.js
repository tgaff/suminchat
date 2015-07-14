var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();
var getTranslatorKey = require('./translator-key.js');
var redirectToChat = require('./redirect.js')(/\/$/, '/chat.html');

console.log("ITS ALIVE!!!!!!! !!!!!!!");


var port = (process.env.PORT || 8080);
app.use('/translatorkey', getTranslatorKey);
app.use(redirectToChat);

app.use(serveStatic(__dirname)).listen(port);
