'use strict';

var module = (function() {
    var
        app,
        self;

   app = {
    init: function() {
      self = this;

      self.events();
    },

    events: function() {
      $('.fileupload').fileupload({
          url: 'php/upload.php',
          type: 'POST',
          success: function () {
              console.log('succes');
          }
      });
    }
  };

  app.init();
  return {};
}());