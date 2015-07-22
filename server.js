// THIS MAY BE DEPRECATED IF WE KEEP THE GULP CONFIG
// TODO: switch heroku over to gulp too...?

var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();
var getTranslatorKey = require('./MSTranslatorKey.js');
var redirectToChat = require('./redirect.js')(/\/$/, '/chat.html');
var naver = require('./naverTranslatorServer.js');

console.log("ITS ALIVE!!!!!!! !!!!!!!");


var port = (process.env.PORT || 8000);
app.use('/getNaverTranslation', naver.getTranslation);
app.use(getTranslatorKey);
app.use(redirectToChat);

app.use(serveStatic(__dirname)).listen(port);
