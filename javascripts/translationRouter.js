/* Some translators require a callback function
 * the page calling Translator.translate should provide us with a callback function
 * the interface for such a function should be:
 *  function(translatedMessage, options) { // handle the translated message }
 * You can pass this to the Translator like:
 * Translator.translate(text, from, to, optionalCallBack, options) {}
 *
 * Any data you need available in your function must be passed through using the options object.
 * For example:
 *  function myCallback(translatedMessage, opts) {
 *    opts.db.send(translatedMessage);
 *  }
 *
 *  Translator.translate('hola', 'es', 'en', myCallback, { db: DBRef });
*/

var Translator = function() {
  // perform setup
  onload = function() {
    MSTranslator.getTranslatorKey();
  }
  //private functions  (they shouldn't NEED to be anonymous)

  var callMSTranslator = function(text, from, to, callbackName) {
    MSTranslator.translate(text, 'Translator.'+callbackName, from, to);
    //MSTranslator.translate(text, callbackName, from, to);
  }

  // create a unique name for functions
  var generateNewFunctionName = function() {
    var someRandomNumbers = Math.floor(Math.random() * 999) + 1;
    return 'translationCallback' + Date.now() + 'R' + someRandomNumbers;
  }

  // create a new callback function with the specified name
  var makeNewCallback = function(newFuncName, callbackFunc, options) {
    Translator[newFuncName] = function(translatedMessage) {
    return( callbackFunc(translatedMessage, options) );
    }
  }
  // PUBLIC
  return { //obj

    translate: function(text, from, to, callback, opts) {
      // route to appropriate translator
      if (opts === undefined) { var opts = {}; }

      if (from == 'ko') {
        switch (to)
        {
          case "zh-CHS":
            to = 'zh';
          case "en":
          case 'ja':
            this.translateWithNaverTranslator(text, from, to, callback, opts);
            return;
          default:
            break;
        }
      }
      if (to == 'ko') {
        switch (from) {
          case "zh-CHS":
            from = 'zh';
          case 'ja':
          case 'en':
            this.translateWithNaverTranslator(text, from, to, callback, opts);
            return;
          default:
            break;
        };
      }
      this.translateWithMSTranslator(text, from, to, callback, opts);

    },

    translateWithDefaultTranslator: function(text, from, to, callbackName, opts) {
      translateWithMSTranslator(text, from, to, callbackName, opts);
    },


    translateWithNaverTranslator: function(text, from, to, callback, opts) {
      var newFunc = generateNewFunctionName();
      makeNewCallback(newFunc, callback, opts);
      NaverTranslator.translate(text, from, to, callback, opts);
    },


    translateWithMSTranslator: function(text, from, to, callback, opts) {
      // register new function to call the callback
      var newFunc = generateNewFunctionName();
      makeNewCallback(newFunc, callback, opts);
      console.log('Translator generated new func name: ' + newFunc);

      // call the api for translation
      callMSTranslator(text, from, to, newFunc);
      // in turn the api calls back to newFunc(translatedMessage, opts)
    }


  }; // END RETURN of public items
}(); // END MODULE the key is executing it!



