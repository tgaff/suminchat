var connect = require('connect');
var serveStatic = require('serve-static');
var https = require('https');
var app = connect();
var querystring = require('querystring');

console.log("ITS ALIVE!!!!!!! !!!!!!!");

function getTranslatorKey(clientReq, clientRes, next) {
  // there are multiple res and req variables here as we both receive
  // a request and send one to Microsoft.  We then use MS's response in
  // our response.  We'll call the local ones clientReq/clientRes and the
  // cycle with MS is msReq/msRes

  //var url = "https://datamarket.accesscontrol.windows.net/v2/OAuth2-13";

  //var url1 = 'https://api.datamarket.azure.com/Bing/MicrosoftTranslator/v1/Translate';

  //break the url into components for http request :-/
  var options = {
    host: 'datamarket.accesscontrol.windows.net',
    path: '/v2/OAuth2-13/',
    method: 'POST'
  }

  // ms token request input params
  var requestContent = {
    grant_type: 'client_credentials',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    scope: 'http://api.microsofttranslator.com'
  };
  if (!(requestContent.client_id && requestContent.client_secret)) {
    // throw?
    console.log('Required CLIENT_ID or CLIENT_SECRET environment keys not set; FAILING');
    next(); return;
  }

  var requiredData;
  // build the request object
  var msReq = https.request(options, function(msRes) {
    console.log('STATUS: ' + msRes.statusCode);
    console.log('HEADERS: ' + JSON.stringify(msRes.headers));
    msRes.setEncoding('utf8');
    msRes.on('data', function(chunk) {
      requiredData = parseTokenResponseData(chunk);

    // send the token back to the client
    clientRes.write(JSON.stringify(requiredData));  // hmm error handling?
    clientRes.end();
    });
  });
  msReq.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write the query input params into the request body
  msReq.write(querystring.stringify(requestContent));
  msReq.end(); //send to microsoft
};

function parseTokenResponseData(chunk) {
  var data = JSON.parse(chunk);
  console.log(data);
  return data;
}

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
