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
                    var mainWrap = wrap.closest('.upload__pic'),
                            data = src.split("|"),
                            loadPic = $('<img/>').attr('src', data[2]), // Создание картинки с путем
                            loadPicName = this.files[0].name, // Имя картинки
                            valid = true,// Флаг
                            MAXWIDTH = 650,
                            MAXHEIGHT = 535,
                            SCALE = 0;

                    console.log(this);

                    if(data[0] > MAXWIDTH) {
                        loadPic.css('max-width', MAXWIDTH + 'px');
                        SCALE = (data[0] - MAXWIDTH)/MAXWIDTH;
                    }
                    if(data[1] > MAXHEIGHT) {
                        loadPic.css('max-height', MAXHEIGHT+ 'px');
                        SCALE = (data[1] - MAXHEIGHT)/MAXHEIGHT;
                    }

                    $('#img').remove(); // Удалить предыдущую картинку
                    loadPic.prependTo($('.img-area')).attr('id', 'img'); // вставить в начало mg-area

                    mainWrap
                        .removeClass('disabled')
                            .find(pics)
                                .removeClass('disabled-input');



                    $.each(pics, function (index, val) {
                        var pic = $(val), // инпут
                                val = pic.val(); // значение инпута
                        if (val.length === 0) { // если значение инпута пустое

                            valid = false;
                        } else {

                        }});
                    return valid;
                    // Подключаем вотермарк
            }
        }


   app = {
       init: function () {
           self = this;

           self.events();
       },

       events: function () {
           pics.on('change', function(e) {
               $(this).fileupload(defObj);
           });
       }
   }

  app.init();
  return {};
}());