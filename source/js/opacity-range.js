var opacityRange = (function() {
    var
        app,
        self,
        startX,
        x,
        toggle,
        scale,
        bar,
        lastPosX,
        cursorX,
        rangControls,
        $document;
  
   app = {
    // метод инициалицации модуля
    init: function() {
      startX = 0,
      x = 0,
      toggle = $('.toggle'),
      scale = $('.scale'),
      bar = $('.bar'),
      rangControls = $('.range-controls'),
      $document = $(document),
      lastPosX = 0,
      cursorX,

      self = this;

      self.events();
    },

    // метод содержащий все события модуля
    events: function() {
      rangControls.on('mousedown', toggle, function (event) {
        event.preventDefault();
        startX = event.screenX - x;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        x = event.screenX - startX;

        if ((x > -5) && (x < toggle.parent()[0].offsetWidth - 15)) {
          toggle.css( 'left', x );
          
        lastPosX = ~~( toggle.css('left') );
        bar.css('width', lastPosX);
        $('.wm').css('opacity', lastPosX / toggle.parent()[0].offsetWidth);
        $('.many-wm-wrap').css('opacity', lastPosX / toggle.parent()[0].offsetWidth);
        }
      };

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      };
    },
     
  };
  app.init();
}());