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

        // Объекты изображений
        img,
        wm,

        // Различные размеры для
        // выравнивания вотермарка
        sectorW,
        sectorH,
        onesectorW,
        onesectorH,
        maxWidth,
        maxHeight,

        // Колличество секторов
        quantitySectors = 3;

   app = {
    // Инициалицация модуля
    init: function() {
        self = this;
        img = $('#img');
        wm = $('#wm');

        self.getInfo();
        self.setPos(0, 0);
        self.events();
    },

    // События модуля
    events: function() {
        $('.move-field').on('click', 'td', function(e) {
            e.preventDefault();

            var
                $this = $(this),
                posX = this.getAttribute('data-x'),
                posY = this.getAttribute('data-y');
                console.log(posY);

            $this
                .parents('.move-field')
                .find('td')
                .removeClass('active');

            $this.addClass('active');

            self.setPos(posX, posY);
        });
    },

    // Установка позиции вотермарка
    setPos: function(x, y) {
        var
            allW = onesectorW + sectorW * x,
            allH = onesectorH + sectorH * y;

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
        onesectorW = ( sectorW - widthWm ) / 2;
        onesectorH = ( sectorH -  heightWm) / 2;

        // Максимальное расстояние чего-то там
        maxWidth = widthImg - widthWm;
        maxHeight = heightImg - heightWm;
    }
  };

  // инициализируем модуль
  setTimeout(function() {
    app.init();
  }, 700);
  // возвращаем объект с публичными методами
  return app;
}());
