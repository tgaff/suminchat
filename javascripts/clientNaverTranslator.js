//○ → curl --data "query=help%20me&srcLang=en&tarLang=ko" http://translate.naver.com/translate.dic
//

var NaverTranslator = function() {

  // PRIVATE
  //
  //
  //


  //PUBLIC
  //
  //
  return({
    translate: function(text, from, to, callback, opts) {
      $.ajax({
        type: 'GET',
        url: '/getNaverTranslation',
        data: { to: to,
                from: from,
                message: text
             },
        success: function(msg) {
          console.log(msg);
          callback(msg.translatedMessage, opts)
        }
      });



    }


  });
}();
