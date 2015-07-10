// javascript
var translator = {};


translator.accessToken = null;
translator.translatorKeyExpiresAt = 0;

// milliseconds before the key should expire that we mark it expired
translator.keySafetyMarginMS = 15*1000; // seconds * 1000 = milliseconds

//get access token
translator.getTranslatorKey = function() {
  $.ajax({
    type: 'POST',
    url: '/translatorkey',
    dataType: 'json',
    success: function(msg) {
      if(msg) {
        __list_msg = msg;
        translator.accessToken = msg['access_token'];
        translator.setupTranslatorKeyExpiration(msg);
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
translator.translate = function(text, callbackName, from, to) {
  translator.doubleCheckKey();
  if (from==to) { return(false); } //no point in translating this
  var s = document.createElement("script");
  s.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate" +
      "?appId=Bearer " + encodeURIComponent(translator.accessToken) +
      "&from=" + encodeURIComponent(from) +
      "&to=" + encodeURIComponent(to) +
      "&text=" + encodeURIComponent(text) +
      "&oncomplete=" + callbackName;
  document.body.appendChild(s);
};
translator.setupTranslatorKeyExpiration = function(msg) {
  var self = this;
  var remainingTime = 0;
  if (msg['expires_in']) {
    remainingTime = parseInt(msg['expires_in'])*1000;
    self.translatorKeyExpiresAt = Date.now() + (remainingTime - self.keySafetyMarginMS);
    console.log('translator key expires in ' + (remainingTime - self.keySafetyMarginMS + ' at ' + self.translatorKeyExpiresAt ));
    // get a new key when this times out
    setTimeout(function() { self.expireTranslatorKey(); },
              (remainingTime - self.keySafetyMarginMS)
    );
  } else {
    console.log('translator: expires_in message non-comprehensible: ['+ msg['expires_in'] + ', lost, confused.');
    expireTranslatorKey();
  };
};
translator.expireTranslatorKey = function() {
  console.log('expiring translator key');
  this.translatorKey = null;
  this.translatorKeyExpiresAt = Date.now();
  // for now we'll automatically get a new key but this is likely something we should do
  // at the translate() step, so that it's only done for active users.
  this.getTranslatorKey();
};
translator.doubleCheckKey = function() {
  if (this.translatorKeyExpiresAt < Date.now()) {
    debugger;
    console.log('notice: translator key was expired, renewing');
    this.getTranslatorKey();
  };
  if (this.accessToken == null) {
    console.log('notice: translator key was null, renewing');
    this.getTranslatorKey();
  };
};
