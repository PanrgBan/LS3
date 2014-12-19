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
        rangeControls,
        $document;
  
   app = {
    // метод инициалицации модуля
    init: function() {
      startX = 210,
      x = 210,
      toggle = $('.toggle'),
      scale = $('.scale'),
      bar = $('.bar'),
      rangeControls = $('.range-controls'),
      $document = $(document),
      lastPosX = 0,
      toggle.css('left', startX),

      self = this;

      self.events();
    },

    // метод содержащий все события модуля
    events: function() {
      rangeControls.on('mousedown', function (event) {
        event.preventDefault();
        
        toggle.css('background-color', '#f97e76');
        startX = event.screenX - x;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
        
      scale.on('click', function(e) {
//        toggle.css('left', );
      });
        
      });

      function mousemove(event) {
        x = event.screenX - startX;
        if (( x > 0 ) && ( x < scale.width() )) {
          toggle.css('left', x);
          
          lastPosX = parseInt(toggle.css('left'));
          bar.css( 'width', lastPosX );
          $('.wm').css( 'opacity', lastPosX / scale.width() );
          $('.many-wm-wrap').css('opacity', lastPosX / scale.width());
        }
      };

      function mouseup() {
        toggle.css('background-color', '#9eb2c0');
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      };
    },
     
  };
  app.init();
}());