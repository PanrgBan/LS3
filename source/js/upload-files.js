'use strict';

var module = (function() {
    var
        app,
        self,
        pics = $('.fileupload'),
        wrap = $('.upload-wrapper'),
        DATA,
        GLOBALSCALE,
        defObj = {
            url: 'php/upload.php',
            type: 'POST',
            //TODO нужно организовать проверку инпута!!!
            success: function (src) {
                var
                    mainWrap = wrap.closest('.upload__pic'),
                    data = src.split("|"),
                    // Создание картинки с путем
                    loadPic = $('<img/>').attr('src', data[2]),
                    // Имя картинки
                    loadPicName = this.files[0].name,
                    valid = true,// Флаг
                    MAXWIDTH = 650,
                    MAXHEIGHT = 535,
                    SCALE = 0;

                    console.log(this);
                    DATA = data;

                // Удалить предыдущую картинку
                $('#img').remove();
                // вставить в начало mg-area
                loadPic.prependTo($('.img-area')).attr('id', 'img');

                if(data[0] > MAXWIDTH) {
                    loadPic.css('max-width', MAXWIDTH + 'px');
                    SCALE = (data[0] - MAXWIDTH)/MAXWIDTH;
                }

                if(data[1] > MAXHEIGHT) {
                    loadPic.css('max-height', MAXHEIGHT+ 'px');
                    SCALE = (data[1] - MAXHEIGHT)/MAXHEIGHT;
                }

                mainWrap
                    .removeClass('disabled')
                    .find(pics)
                    .removeClass('disabled-input');

                GLOBALSCALE = SCALE;

                //} else {
                //    $('#wm').remove();
                //    loadPic.appendTo($('.img-area')).attr('id', 'img').addClass('.wm');
                //    loadPic.css({
                //        'max-width': GLOBALSCALE*100+'%',
                //        'max-height' : GLOBALSCALE*100+'%'
                //    });
                //    // Подключаем вотермарк
                //}
            }
        };


   app = {
       init: function () {
           self = this;

           self.events();
       },

       events: function () {
               pics.fileupload(defObj);
       }
   }

  app.init();
  return {};
}());