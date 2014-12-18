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
                    var data = src.split("|"),
                            loadPic = $('<img/>').attr('src', data[2]), // Создание картинки с путем
                            loadPicName = this.files[0].name, // Имя картинки
                            valid = true,// Флаг
                            MAXWIDTH = 650,
                            MAXHEIGHT = 535,
                            scale = 0;

                    if(data[0] > MAXWIDTH) {
                        loadPic.css('max-width', MAXWIDTH + 'px');
                        scale = (data[0] - MAXWIDTH)/MAXWIDTH;
                    }
                    if(data[1] > MAXHEIGHT) {
                        loadPic.css('max-height', MAXHEIGHT+ 'px');
                        scale = (data[1] - MAXHEIGHT)/MAXHEIGHT;
                    }

                    console.log(scale);




                    $('#img').remove(); // Удалить предыдущую картинку
                    loadPic.prependTo($('.img-area')).attr('id', 'img'); // вставить в начало mg-area

                    $.each(pics, function (index, val) {
                        var pic = $(val), // инпут
                                val = pic.val(); // значение инпута
                        if (val.length === 0) { // если значение инпута пустое
                            pic
                                .closest('.form-group') // в родителях .form-group
                                .find(wrap) // найти wrap
                                .addClass('error'); // добавить класс
                            valid = false;
                        } else {
                           pic
                                .closest('.form-group')
                                .find(wrap)
                                .removeClass('error') // удалить класс
                                .text(loadPicName); // показать имя
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
               pics.fileupload(defObj);
       }
   }

  app.init();
  return {};
}());