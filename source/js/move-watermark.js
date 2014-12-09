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

        $('.spinner-group').on('click', 'a', function(e) {
            e.preventDefault()

            var direction = this.getAttribute('data-direction');
            self.move(direction);
            self.refreshBoard();
        });
    },

    // Попиксельное изменение позиции
    // direction - направление смещения
    move: function(direction) {

        switch(direction) {
            case 'x-up':
                left += 1;
                break;
            case 'x-down':
                left -= 1;
                break;
            case 'y-up':
                top += 1;
                break;
            case 'y-down':
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

    // Установка позиции вотермарка
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
  return app;
}());
