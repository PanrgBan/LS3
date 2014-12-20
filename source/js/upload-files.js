'use strict';

var module = (function() {
    var
        app,
        self,
        pics = $('.fileupload'),
        wrap = $('.upload-wrapper'),
        GLOBALSCALE,
        defObj = {
                url: 'php/upload.php',
                type: 'POST',
                success: function (src) {
                    console.log(JSON.parse(src));
                    var data = JSON.parse(src),
                            loadPicWidth = data.width,
                            loadPicHeight = data.height,
                            loadPicPath = $('<img/>').attr('src', data.path), // Создание картинки с путем
                            loadPicName = data.fileName, // Имя картинки
                            MAXWIDTH = 650,
                            MAXHEIGHT = 535,
                            inputName = data.inputName,
                            changeWm = function () {
                                $('#wm').remove();
                                loadPicPath.appendTo($('.img-area')).attr('id', 'wm').addClass('wm');
                                loadPicPath.css({
                                    'width': loadPicWidth*GLOBALSCALE+'px',
                                    'height' : loadPicHeight*GLOBALSCALE+'px'
                                });
                                console.log(GLOBALSCALE);
                                // Подключаем вотермарк
                            },
                            changeInputName = function () {
                                $('input[name = '+ inputName + ']').closest('.form-group').find(wrap).text(loadPicName);
                            };



                    if (inputName === 'userfile') {
                        $('#img').remove(); // Удалить предыдущую картинку
                        loadPicPath.prependTo($('.img-area')).attr('id', 'img'); // вставить в начало mg-area

                        if(loadPicHeight > MAXHEIGHT || loadPicWidth > MAXWIDTH) {
                            if (loadPicWidth > loadPicHeight) {
                                loadPicPath.css('width', MAXWIDTH + 'px');
                                GLOBALSCALE = MAXWIDTH/loadPicWidth;
                                console.log(GLOBALSCALE);
                            } else {
                                loadPicPath.css('height', MAXHEIGHT+ 'px');
                                GLOBALSCALE = MAXHEIGHT/loadPicHeight;
                            }
                        } else {
                            GLOBALSCALE = 1;
                            changeWm();
                        }

                        $('.upload__pic')
                            .removeClass('disabled')
                            .find(pics)
                            .removeClass('disabled-input');
                        changeInputName();

                    }  else {
                        changeWm();
                        changeInputName();
                    }
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