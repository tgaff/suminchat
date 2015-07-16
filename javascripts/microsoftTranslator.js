// javascript
var MSTranslator = {};


MSTranslator.accessToken = null;
MSTranslator.MSTranslatorKeyExpiresAt = 0;

// milliseconds before the key should expire that we mark it expired
MSTranslator.keySafetyMarginMS = 15*1000; // seconds * 1000 = milliseconds

//get access token
MSTranslator.getTranslatorKey = function() {
  $.ajax({
    type: 'POST',
    url: '/MSTranslatorkey',
    dataType: 'json',
    success: function(msg) {
      if(msg) {
        __list_msg = msg;
        MSTranslator.accessToken = msg['access_token'];
        MSTranslator.setupTranslatorKeyExpiration(msg);
        console.log(msg);
      } else {
        alert("error" + msg);
      }
    }
  });
}
// text, callbackName, from, to
// text: text to translate,
// callbackName: name of a callback function microsoft will call,
// from: the language to translate from
// to: the language to translate to
MSTranslator.translate = function(text, callbackName, from, to) {
  MSTranslator.doubleCheckKey();
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
MSTranslator.doubleCheckKey = function() {
  if (this.MSTranslatorKeyExpiresAt < Date.now()) {
    console.log('notice: MSTranslator key was expired, renewing');
    this.getTranslatorKey();
  };
  if (this.accessToken == null) {
    console.log('notice: MSTranslator key was null, renewing');
    this.getTranslatorKey();
  };
};
