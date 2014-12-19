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
<<<<<<< HEAD
      rangControls.on('mousedown', toggle, function (event) {
=======
      rangeControls.on('mousedown', function (event) {
>>>>>>> 6f79021c5ff3c7c864a669c506a9d9f41bb9954f
        event.preventDefault();
        
        toggle.css('background-color', '#f97e76');
        startX = event.screenX - x;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
<<<<<<< HEAD
=======
        
      scale.on('click', function(e) {
//        toggle.css('left', );
      });
        
>>>>>>> 6f79021c5ff3c7c864a669c506a9d9f41bb9954f
      });

      function mousemove(event) {
        x = event.screenX - startX;
<<<<<<< HEAD

        if ((x > -5) && (x < toggle.parent()[0].offsetWidth - 15)) {
          toggle.css( 'left', x );
          
        lastPosX = ~~( toggle.css('left') );
        bar.css('width', lastPosX);
        $('.wm').css('opacity', lastPosX / toggle.parent()[0].offsetWidth);
        $('.many-wm-wrap').css('opacity', lastPosX / toggle.parent()[0].offsetWidth);
=======
        if (( x > 0 ) && ( x < scale.width() )) {
          toggle.css('left', x);
          
          lastPosX = parseInt(toggle.css('left'));
          bar.css( 'width', lastPosX );
          $('.wm').css( 'opacity', lastPosX / scale.width() );
          $('.many-wm-wrap').css('opacity', lastPosX / scale.width());
>>>>>>> 6f79021c5ff3c7c864a669c506a9d9f41bb9954f
        }
      };

      function mouseup() {
<<<<<<< HEAD
=======
        toggle.css('background-color', '#9eb2c0');
>>>>>>> 6f79021c5ff3c7c864a669c506a9d9f41bb9954f
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      };
    },
     
  };
  app.init();
}());