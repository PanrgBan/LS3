'use strict';

// ***Перемещение водяного знака***
var moveWatermark = (function() {
    // Обьявляем пустые переменные, для последующей с ними работы
    var
        app,
        self,
        flag = true,
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

      // вызываем метод который понавешает события модуля
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
  app.init();
  // возвращаем объект с публичными методами
  return app;
}());
// ***Перемещение водяного знака***