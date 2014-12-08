'use strict';

// ***Перемещение водяного знака***
/*var moveWatermark = (function() {
    // Обьявляем пустые переменные, для последующей с ними работы
    var
        app,
        self,
        originPic = $('.work-area').children('img'),
        waterMark = $('.work-area').children('div.wrap-watermark').children('img');

   app = {
    // метод инициалицации модуля
    init: function() {
      self = this;
        $( ".spinner" ).spinner({
            min: 0,
            max:3
        });

      self.events();
      self.wrapWtm();
    },

    // метод содержащий все события модуля
    events: function() {
        $('.pane-wrap').children('a').on('click', self.selectPos);
    },
    wrapWtm: function() {
        var posOrigin = originPic.position();
        waterMark.parent().width(originPic.width()).height(originPic.height()).css({"top":posOrigin.top, "left":posOrigin.left});
    },
    selectPos: function(e) {
        var pos = $(e.target).data('pos');
        waterMark.removeClass().addClass(pos).css(self.correctWater(pos, waterMark.width(), waterMark.height()));
        $(this).parent().children('a').removeClass();
        e.target.className = 'active';
        return false;
    },
    correctWater: function (pos,width,height){
        var marginWater = {};
        switch (pos) {
            case 'center-top':
                marginWater.marginLeft = -(width/2);
                marginWater.marginTop = 0;
                break;
            case 'left-center':
                marginWater.marginLeft = 0;
                marginWater.marginTop = -(height/2);
                break;
            case 'center-center':
                marginWater.marginLeft = -(width/2);
                marginWater.marginTop = -(height/2);
                break;
            case 'right-center':
                marginWater.marginLeft = 0;
                marginWater.marginTop = -(height/2);
                break;
            case 'center-bottom':
                marginWater.marginLeft = -(width/2);
                marginWater.marginTop = 0;
                break;
            default:
                marginWater.marginLeft = 0;
                marginWater.marginTop = 0;
                break;
        }
        return marginWater;
    }
  };

  // инициализируем модуль
  // app.init();
  // возвращаем объект с публичными методами
  return app;
}());*/
// ***Перемещение водяного знака***

var moveWatermark2 = (function() {
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

        // Колличество секторов
        quantitySectors = 3;

   app = {
    // Шаг позиции вотермарка
    stepX: 0,
    stepY: 0,

    // Инициалицация модуля
    init: function() {
        self = this;
        img = $('#img');
        wm = $('#wm');
        boardX = $('#board-x');
        boardY = $('#board-y');

        self.getInfo();
        self.setPos();
        self.events();
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

            self.stepX = +this.getAttribute('data-x'),
            self.stepY = +this.getAttribute('data-y');
            self.setPos();
            self.refreshBoard();
        });

        $('.spinner-group').on('click', 'a',function(e) {
            e.preventDefault()

            var direction = this.getAttribute('data-direction');
            self.doOneStep(direction);
            self.refreshBoard();

            // TODO Переделать
            var tds = $('.move-field').find('td').removeClass('active');
            tds.each(function() {
                if ( $(this).attr('data-x') == self.stepX ){
                    if ( $(this).attr('data-y') == self.stepY ) {
                        $(this).addClass('active');
                    }
                }
            })
        });
    },

    // Изменение позиции на один шаг
    // direction - направление шага
    doOneStep: function(direction) {

        switch(direction) {
            case 'x-up':
                self.stepX += 1;
                if (self.stepX >= quantitySectors) self.stepX = 0;
                break;
            case 'x-down':
                self.stepX -= 1;
                if (self.stepX < 0) self.stepX = quantitySectors - 1
                break;
            case 'y-up':
                self.stepY += 1;
                if (self.stepY >= quantitySectors) self.stepY = 0;
                break;
            case 'y-down':
                self.stepY -= 1;
                if (self.stepY < 0) self.stepY = quantitySectors - 1
                break;
            default:
                self.stepX = 0;
                self.stepY = 0;
        }
        self.setPos();
    },

    // Установка позиции вотермарка
    setPos: function() {
        // Проверяем являются ли stepX и stepY числами
        if (typeof self.stepX !== 'number') self.stepX = 0;
        if (typeof self.stepY !== 'number') self.stepY = 0;

        var
            allW = oneSectorW + sectorW * self.stepX,
            allH = oneSectorH + sectorH * self.stepY;

        // Проверяем чтобы вотермарк не
        // выходил за границы изображения
        if ( allW < 0 ) allW = 0;
        if ( allH < 0 ) allH = 0;
        if ( allW > maxWidth ) allW = maxWidth;
        if ( allH > maxHeight ) allH = maxHeight;

        wm.css({
            'left': allW,
            'top': allH
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
        sectorW = Math.round( widthImg / quantitySectors );
        sectorH = Math.round( heightImg / quantitySectors );

        // Расстояния для центрироания
        // вотермарка в секторе
        oneSectorW = ( sectorW - widthWm ) / 2;
        oneSectorH = ( sectorH -  heightWm) / 2;

        // Максимальное расстояние чего-то там
        maxWidth = widthImg - widthWm;
        maxHeight = heightImg - heightWm;
    },

    // Изменение значения позиции
    refreshBoard: function() {
        boardX.text(self.stepX);
        boardY.text(self.stepY);
    }
  };

  // инициализируем модуль
    app.init();
  // возвращаем объект с публичными методами
  return app;
}());
;'use strict';

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