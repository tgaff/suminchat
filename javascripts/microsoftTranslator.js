// javascript
var MSTranslator = {};


MSTranslator.accessToken = null;
MSTranslator.MSTranslatorKeyExpiresAt = 0;

// milliseconds before the key should expire that we mark it expired
MSTranslator.keySafetyMarginMS = 15*1000; // seconds * 1000 = milliseconds

//get access token
MSTranslator.getTranslatorKey = function() {
  var self = this;
  var request = $.ajax({
    type: 'POST',
    url: '/MSTranslatorKey',
    dataType: 'json',
    success: function(msg) {
      if(msg) {
        //__list_msg = msg;
        self.accessToken = msg['access_token'];
        self.setupTranslatorKeyExpiration(msg);
        console.log(msg);
      } else {
        // FIXME: something better
        alert("error" + msg);
        self.translatorKeyRequest = null;
      }
    }
  });
  this.translatorKeyRequest = request;
  return request;
}
// text, callbackName, from, to
// text: text to translate,
// callbackName: name of a callback function microsoft will call,
// from: the language to translate from
// to: the language to translate to
MSTranslator.translate = function(text, callbackName, from, to) {
  //first make sure we have a key, then call the REAL translate
  var self = this;
  MSTranslator.doubleCheckKey().done(function() {
    self.realTranslate(text, callbackName, from, to)} );
};
// the REAL translate.  // note, fails miserably if you don't have a key
MSTranslator.realTranslate = function(text, callbackName, from, to) {
  if (from==to) { return(false); } //no point in translating this
  var s = document.createElement("script");
  s.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate" +
      "?appId=Bearer " + encodeURIComponent(MSTranslator.accessToken) +
      "&from=" + encodeURIComponent(from) +
      "&to=" + encodeURIComponent(to) +
      "&text=" + encodeURIComponent(text) +
      "&oncomplete=" + encodeURIComponent(callbackName);
  document.body.appendChild(s);
};
MSTranslator.setupTranslatorKeyExpiration = function(msg) {
  var self = this;
  var remainingTime = 0;
  if (msg['expires_in']) {
    remainingTime = parseInt(msg['expires_in'])*1000;
    self.MSTranslatorKeyExpiresAt = Date.now() + (remainingTime - self.keySafetyMarginMS);
    console.log('MSTranslator key expires in ' + (remainingTime - self.keySafetyMarginMS + ' at ' + self.MSTranslatorKeyExpiresAt ));
    // get a new key when this times out
    setTimeout(function() { self.expireTranslatorKey(); },
              (remainingTime - self.keySafetyMarginMS)
    );
  } else {
    console.log('MSTranslator: expires_in message non-comprehensible: ['+ msg['expires_in'] + ', lost, confused.');
    expireTranslatorKey();
  };
};
MSTranslator.expireTranslatorKey = function() {
  console.log('expiring MSTranslator key');
  this.MSTranslatorKey = null;
  this.MSTranslatorKeyExpiresAt = Date.now();
  // for now we'll automatically get a new key but this is likely something we should do
  // at the translate() step, so that it's only done for active users.
  this.getTranslatorKey();
};
// returns a promise for a new translator key request
MSTranslator.doubleCheckKey = function() {
  if (this.translatorKeyRequest != null) {
    console.log('notice: MSTranslator key request pending, please wait');
    return this.translatorKeyRequest;
  }
  if (this.MSTranslatorKeyExpiresAt < Date.now()) {
    console.log('notice: MSTranslator key was expired, renewing');
    return this.getTranslatorKey();
  };
  if (this.accessToken == null) {
    console.log('notice: MSTranslator key was null, renewing');
    return this.getTranslatorKey();
  };
  // we're good here, return a completed promise
  console.log('double check is all good');
  return $.Deferred().resolve().promise();
};
