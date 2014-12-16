'use strict';

var module = (function() {
    var
        app,
        self,
        pics = $('.fileupload'),
        wrap = $('.upload-wrapper'),
        defObj = {
                url: 'php/upload.php',
                type: 'POST',
                success: function (src) {
                    var loadPic = $('img').attr('src', src),
                    picName = this.files[0].name,
                            valid = true;

                    console.log(loadPic);
                    loadPic.prependTo($('.img-area'));

                    $.each(pics, function (index, val) {
                        var pic = $(val),
                                val = pic.val();
                        if (val.length === 0) {
                            pic
                                .closest('.form-group')
                                .find(wrap)
                                .addClass('error');
                            valid = false;
                        } else {
                           pic
                                .closest('.form-group')
                                .find(wrap)
                                .removeClass('error')
                                .text(picName);
                        }});
                    return valid;
                    // Подключаем вотермарк
            }
        }


   app = {
    init: function() {
      self = this;

      self.events();
    },

    events: function() {
        pics.fileupload((defObj));
    }
  };

  app.init();
  return {};
}());