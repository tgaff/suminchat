// javascript
var translator = {};


translator.accessToken = null;
translator.translatorKeyExpired = true;

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
translator.translate = function(text, callback) {
  var from = "en", to = "es";

  var s = document.createElement("script");
  s.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate" +
      "?appId=Bearer " + encodeURIComponent(translator.accessToken) +
      "&from=" + encodeURIComponent(from) +
      "&to=" + encodeURIComponent(to) +
      "&text=" + encodeURIComponent(text) +
      "&oncomplete=" + callback.name;
  document.body.appendChild(s);
}
translator.setupTranslatorKeyExpiration = function(msg) {
  var self = this;
  var remainingTime = 1;
  if (msg['expires_in']) {
    remainingTime = msg['expires_in'];
    this.translatorKeyExpired = false;
    console.log(1000*remainingTime - this.keySafetyMarginMS);
  }
  setTimeout(function() { self.expireTranslatorKey(); },
   (1000*remainingTime - this.keySafetyMarginMS)
  );
}
translator.expireTranslatorKey = function() {
  console.log('expiring key');
  this.translatorKey = null;
  this.translatorKeyExpired = true;
  // for now we'll automatically get a new key but this is likely something we should do
  // at the translate() step, so that it's only done for active users.
  this.getTranslatorKey();
}

