// Naver translator server-side communication.
//  This requires a server side module due to CORS.  Browsers can't directly contact Naver's translator.
//  We'll handle that here and pass it back to the browser.
//
//○ → curl --data "query=help%20me&srcLang=en&tarLang=ko" http://translate.naver.com/translate.dic
//
//
var http = require('http');
var querystring = require('querystring');
var url = require('url');

var request = require('request');

function parse(body) {
  var result = {};
  try{
    result = JSON.parse(body);
  } catch(e) {
    console.log('caught error in Naver response: ' + e);
    result.translatedMessage = 'Error in Naver Translation';
    result.error = e; //error in the above string(in this case,yes)!
  } finally {
    return result;
  };
};

function getTranslation(clientReq, clientRes, next) {
  // parse client request
  //console.log(clientReq.body());
  var query = querystring.parse(url.parse(clientReq.url).query);
  console.log(query);
  var message = query.message;
  var to = query.to;
  var from = query.from;

  if (from === undefined || to === undefined || message === undefined) {
    // return 400 Bad Request
    return400(clientRes);
    return;
  }

  // send to naver and reply
  var requestContent = {
    query: message,
    srcLang: from,
    tarLang: to
  };
  console.log(requestContent);
  request.post('http://translate.naver.com/translate.dic',
    { form: requestContent },
    function( error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        var parsedData = parse(body);

        var ourResponse = {
          error: parsedData.error,
          translatedMessage: parsedData.resultData,
          from: requestContent.srcLang,
          to: requestContent.tarLang,
          naverDir: parsedData.dir,
          naverResultCode: parsedData.resultCode
        }
        console.log('responding: ' + ourResponse);
        clientRes.writeHead(200, {"Content-Type": "application/json"});
        clientRes.write( JSON.stringify(ourResponse) );
        clientRes.end();
      } else {
        debugger;
      }
    }
  );
  return;
}

function return400(res) {
  res.writeHead(400);
  res.end();
}
function routeMatchingPath(req, res, next) {
  console.log(req.url);
  if (req.url.match(/^\/getNaverTranslation/i) != null) {
    getTranslation(req, res, next);
  } else {
    next();
  }
};
module.exports = {
  getTranslation: getTranslation,
  route: routeMatchingPath
} ;
