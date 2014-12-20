'use strict';

var module = (function() {
    var
        app,
        self,
        pics = $('.fileupload'),
        wrap = $('.upload-wrapper'),
        GLOBALSCALE,
        defObj = {
<<<<<<< HEAD
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
=======
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
>>>>>>> 286b8757d89f2e75ef0c7171e325a6caf8959165
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