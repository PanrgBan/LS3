'use strict';

var moveWatermark = (function() {
  var
      // Рабочие переменные
      app,
      self,

      // Изображения
      img,
      wm,

      // Панели отображения позиции
      boardX,
      boardY,

      // Различные размеры для
      // выравнивания вотермарка
      sectorW,
      sectorH,
      oneSectorW,
      oneSectorH,
      maxWidth,
      maxHeight,

      // Шаг позиции и расстояния
      // от вотермарка до границ
      stepX = 0,
      stepY = 0,
      top = 0,
      left = 0,

      repeatTimer,
      // Колличество секторов
      quantitySectors = 3;

  app = {

    // Инициалицация модуля
    init: function() {
      self = this;
      img = $('#img');
      wm = $('#wm');
      boardX = $('#board-x');
      boardY = $('#board-y');

      self.events();
      self.getInfo();
      self.doOneStep();
      self.refreshBoard();
    },

    // События модуля
    events: function() {
      $('.move-field').on('click', 'td', function(e) {
        e.preventDefault();

        var $this = $(this);

        $this
          .parents('table')
          .find('td')
          .removeClass('active');

        $this.addClass('active');

        stepX = +this.getAttribute('data-x'),
        stepY = +this.getAttribute('data-y');
        self.doOneStep();
        self.refreshBoard();
      });

      $('.spinner-group').on('mousedown', 'a', function(e) {
        e.preventDefault()

        // отключаем анимацию
        wm.css('transition', 'none');

        var direction = this.getAttribute('data-direction');
        self.move(direction);
        self.refreshBoard();

        repeatTimer = setTimeout(function() {
          repeatTimer = setInterval(function() {
            self.move(direction);
            self.refreshBoard();
          }, 0);
        }, 400);
      });

      $('.spinner-group').on('mouseup', 'a', function(e) {

        clearInterval(repeatTimer);
        wm.css('transition', '');
      })
    },

    // Попиксельное изменение позиции
    // direction - направление смещения
    move: function(direction) {

      switch(direction) {
        case 'right':
          left += 1;
          break;
        case 'left':
          left -= 1;
          break;
        case 'bottom':
          top += 1;
          break;
        case 'top':
          top -= 1;
          break;
        default:
          stepX = 0;
          stepY = 0;
      }

      self.setPos();
    },

    // Изменение позиции по секторам
    doOneStep: function() {
      if (typeof stepX !== 'number') stepX = 0;
      if (typeof stepY !== 'number') stepY = 0;

      left = oneSectorW + sectorW * stepX;
      top = oneSectorH + sectorH * stepY;

      self.setPos();
    },

    setPos: function() {
      // Проверяем чтобы вотермарк не
      // выходил за границы изображения
      if ( left < 0 ) left = 0;
      if ( top < 0 ) top = 0;
      if ( left > maxWidth ) left = maxWidth;
      if ( top > maxHeight ) top = maxHeight;

      wm.css({
        'left': left,
        'top': top
      })
    },

    // Получение необходимой информации
    // о изобажениях и секторах
    getInfo: function() {
      var
        // Размеры основного изображения
        widthImg = img.width(),
        heightImg = img.height(),

        // Размеры вотермарка
        widthWm = wm.width(),
        heightWm = wm.height();

      // Размеры сектора
      sectorW = ~~( widthImg / quantitySectors );
      sectorH = ~~( heightImg / quantitySectors );

      // Расстояния для центрироания
      // вотермарка в секторе
      oneSectorW = ~~( ( sectorW - widthWm ) / 2 );
      oneSectorH = ~~( ( sectorH -  heightWm) / 2 );

      // Максимальное расстояние чего-то там
      maxWidth = widthImg - widthWm;
      maxHeight = heightImg - heightWm;
    },

    // Изменение значения позиции
    refreshBoard: function() {
      boardX.text(left);
      boardY.text(top);
    }
  };

  // инициализируем модуль
  setTimeout(function() {
    app.init();
  }, 700)

  // возвращаем объект с публичными методами
  return {};
}());
;'use strict';

var module = (function() {
    var
        app,
        self,
        pics = $('.fileupload'),
        wrap = $('.upload-wrapper'),
        defObj = {
                url: 'php/upload.php',
                type: 'POST',
                success: function () {
                    var picName = this.files[0].name,
                            valid = true;
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
        };


   app = {
    init: function() {
      self = this;

      self.events();
    },

    events: function() {
        pics.fileupload(defObj);
    }
  };

  app.init();
  return {};
}());