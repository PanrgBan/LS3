var opacityRange = (function () {
  // Обьявляем пустые переменные, для последующей с ними работы
  var
      app,
      self,
      flag,
      toggle,
      scale,
      bar,
      cursorPosX,
      lastPosX,
      watermarkOpacity,
      scalePosX,
      scaleWidth,
      scalePosStartX,
      scalePosEndX,
      toggleWidth;

  // объект с приватными методами
  app = {
    // метод инициалицации модуля
    init: function () {
      flag = false,
      toggle = $('.toggle'),
      scale = $('.scale'),
      bar = $('.bar'),
      cursorPosX,
      lastPosX,
      watermarkOpacity,
      scalePosStartX = parseInt(scale.offset().left),
      toggleWidth =  parseInt(toggle.css('width')),
      scalePosEndX = scalePosStartX + parseInt(scale.css('width')) - toggleWidth,
      toggleWidth =  parseInt(toggle.css('width'));

      self = this;

      // вызываем метод который понавешает события модуля
      self.events();
      // Также тут вызываем методы которые нужны для инициализации
    },

    // метод содержащий все события модуля
    events: function () {
      toggle.on('mousedown', function () {
        flag = true;
      });

      $('.range-controls').on('mousemove', function (e) {
        cursorPosX = e.pageX;

        if (flag) {

          if ((cursorPosX > scalePosStartX) && (cursorPosX < scalePosEndX)) {

            toggle.offset({left: cursorPosX});
            lastPosX = parseInt(toggle.css('left'));
            bar.css('width', lastPosX + 'px');
            $('.wm').css('opacity', lastPosX / 300);

          }
        }
      });

      $(document).on('mouseup', function () {
        flag = false;
      });

      scale.on('click', function () {
        if ((cursorPosX > scalePosStartX) && (cursorPosX < scalePosEndX)) {

          toggle.offset({left: cursorPosX});
          lastPosX = parseInt($(toggle).css('left'));
          bar.css('width', lastPosX + 'px');
          $('.wm').css('opacity', lastPosX / 300);

        }
      });
    }
  };

// инициализируем модуль
app.init();
}());