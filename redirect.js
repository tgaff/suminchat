// routeFrom = regex or string (uses String.match)
// routeTo = another path
function redirect(routeFrom, routeTo) {
  var redirectToSomething = function(clientReq, res, next) {
    if (clientReq.url.match(routeFrom)) {
      console.log('redirecting from ' + clientReq.url + ' to ' + routeTo);
      res.writeHead(301, {Location: routeTo});
      res.end();
    } else {
      next();
    };
  };
  return redirectToSomething;
};
module.exports = redirect;
