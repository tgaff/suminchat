var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();
var getTranslatorKey = require('./translator-key.js');

console.log("ITS ALIVE!!!!!!! !!!!!!!");


function redirectToChat(clientReq, res, next) {
  console.log(clientReq.url);
  if (clientReq.url == '/') {
    res.writeHead(301, {Location: '/chat.html'});
    res.end();
  } else {
    next();
  };
}
var port = (process.env.PORT || 8080);
app.use('/translatorkey', getTranslatorKey);
app.use('/', redirectToChat);

app.use(serveStatic(__dirname)).listen(port);
