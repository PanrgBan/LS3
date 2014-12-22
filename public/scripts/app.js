'use strict';

!function() {

  var
      moveWm, // модуль перемещения
      opacityWm, // модуль прозрачности

      WM,
      WMGrid,
      tiling = false;


  //=================================
  // Перемещение вотера
  //=================================

  moveWm = (function() {
    var
        // Рабочие переменные
        app,
        self,
        timer,

        // Изображения
        img,
        field,

        // Панели отображения позиции
        boardX,
        boardY,

        // Крест =)
        manyWaterField,
        manyWaterFieldX,
        manyWaterFieldY,

        // Различные размеры для
        // выравнивания вотермарка
        // Размеры основного изображения
        widthImg,
        heightImg,
        widthWm,
        heightWm,
        sectorW,
        sectorH,
        oneSectorW,
        oneSectorH,
        maxWidth,
        maxHeight,
        marginX,
        marginY,
        dragX,
        dragY,
        countXWm,
        countYWm,
        countWm,

        // Шаг позиции и расстояния
        // от вотермарка до границ
        stepX = 0,
        stepY = 0,
        top = 0,
        left = 0,

        // Колличество секторов
        quantitySectors = 3,
        // Множитель увеличения полотна замощения О_о
        multipleTiling = 1.5;

    app = {
      events: function() {
        // Таблица  ====================
        field.on('click', 'td', function(e) {
          e.preventDefault();
          if ( !tiling ){
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
          }
        });

        // события дропа одиночного воттера
        WM.on('mousedown', function(){
            WM.css('transition', 'none');
        });

        WM.on('mouseup', function(){
            WM.css('transition', '');
        });

        // Спинер =======================
        $('.spinner-group').on('mousedown', 'a', function(e) {
          e.preventDefault()

          // отключаем анимацию
          WM.css('transition', 'none');

          var direction = this.getAttribute('data-direction');

          self.repeat(null, function() {
            self.move(direction);
            self.refreshBoard();
          });
        });

        $('.spinner-group').on('mouseup', 'a', function(e) {
          clearInterval(timer);
          WM.css('transition', '');
        });

        $('.spinner-group').on('mouseleave', 'a', function() {
          clearTimeout(timer);
          WM.css('transition', '');
        });

        // Переключалка режимов наложения воттера
        $('.control').on('click','a', function(e){
            e.preventDefault();

            var $this = $(this);

            $this
              .addClass('active')
              .siblings()
              .removeClass('active');

            if ( $this.hasClass('one') ) {
              // режим наложения одиночного воттера
                tiling = false;
                field.find('td').eq(0).trigger('click');

                manyWaterField && manyWaterField.hide()
                WMGrid && WMGrid.hide()
                WM.show();
            } else {
              // режим наложения множественного воттера
                tiling = true;
                WM.hide();
                field.find('td').removeClass('active');

                if ( manyWaterField ){
                  // если крест создан, показываем
                  manyWaterField.show();
                } else {
                  // крест не создан - создаём
                  field.append("<div class='many-water-field'></div>");
                  manyWaterField = $('.many-water-field');
                  manyWaterField
                    .append("<div class='many-water-field-x'><span></span></div>")
                    .append("<div class='many-water-field-y'><span></span></div>");
                  manyWaterFieldX = $('.many-water-field-x').find('span');
                  manyWaterFieldY = $('.many-water-field-y').find('span');
                }

                if(WMGrid){
                  // если обертка каскадом воттеров существует - показываем
                  WMGrid.show();
                  self.setPosMany();
                }else{
                  //если не существует - создаём
                  self.manyWater();
                }
              self.refreshBoard();
            }

            // устанавливаем прозрачность
            opacityWm.setOpacity();
        });
      },

      // Попиксельное изменение позиции
      // direction - направление смещения
      move: function( direction ) {
        if ( !tiling ) {
          switch ( direction ) {
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
        } else {
          switch ( direction ) {
            case 'right':
              marginY += 1;
                dragY += countXWm;
              break;
            case 'left':
              marginY -= 1;
                dragY -= countXWm;
              break;
            case 'top':
              marginX += 1;
                dragX += countYWm;
              break;
            case 'bottom':
              marginX -= 1;
                dragX -= countYWm;
              break;
            default:
              marginX = 0;
              marginY = 0;
          }
          self.setPosMany();
        }
      },

      // Изменение позиции по секторам
      doOneStep: function() {
        if (typeof stepX !== 'number') stepX = 0;
        if (typeof stepY !== 'number') stepY = 0;

        left = oneSectorW + sectorW * stepX;
        top = oneSectorH + sectorH * stepY;

        self.setPos();
      },

      // Устанавливаем позицию вотермарка
      setPos: function() {
        // Проверяем чтобы вотермарк не
        // выходил за границы изображения
        if ( left < 0 ) left = 0;
        if ( top < 0 ) top = 0;
        if ( left > maxWidth ) left = maxWidth;
        if ( top > maxHeight ) top = maxHeight;

        WM.css({
          'left': left,
          'top': top
        })
      },

      // Получение необходимой информации
      // о изобажениях и секторах
      getInfo: function() {
        // Размеры основного изображения
        widthImg = img.width(),
        heightImg = img.height(),

        // Размеры вотермарка
        widthWm = WM.width(),
        heightWm = WM.height();

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
      refreshBoard: function(x,y) {
          if(!x || !y){
            if ( !tiling ) {
              boardX.text(left);
              boardY.text(top);
            } else {
              boardX.text( ~~(marginX) );
              boardY.text( ~~(marginY) );

              manyWaterFieldX.css( "height", marginX + '%' );
              manyWaterFieldY.css( "width", marginY + '%' );
            }
          }else{
              boardX.text(x);
              boardY.text(y);
          }
      },

      // Повтор функции каждые 40мс
      // i - задержка начала рекурсии
      // handler - повторяемая функция
      repeat: function( i, handler ) {
        i = i || 500;

        clearTimeout(timer);
        timer = self.delay(function() {
          self.repeat(40, handler)
        }, i);

        handler();
      },

      // Задержка вызова функции
      delay: function( handler, delay ) {
        return setTimeout( handler, delay || 0 );
      },

      // множественная накладка водянного знака
      manyWater: function(){
        WMGrid = $('<div>', {
          'class': 'many-wm-wrap'
        });

        $('.img-area').append( WMGrid );

        var
            wmSrc = WM.attr('src'),

        // увеличиваем размеры обертки воттеров
            wmWrapWidth = widthImg * multipleTiling,
          wmWrapHeight = heightImg * multipleTiling,

            // считаем кол-во воттеров, которые влезают в области нашего изображения
            countXWmL = ~~( widthImg / widthWm ),
            countYWmL = ~~( heightImg / heightWm );

          // считаем кол-во воттеров, которые влезают в обертку
          countXWm = ~~( wmWrapWidth / widthWm);
          countYWm = ~~( wmWrapHeight / heightWm );
          // выносим отдельно, чтобы ипользовать в др. ф-ции
          countWm = countXWm * countYWm;
        // считаем отступы для ровного заполнения воттерами большой картинки
        marginX = ( widthImg / countXWmL ) - widthWm;
        marginY = ( heightImg / countYWmL ) - heightWm;

          // для ограничения драга нашего каскада с воттерами внутри изображения
          dragX = (countXWm * widthWm + marginX) - widthImg;
          dragY = (countYWm * heightWm + marginY) - heightImg;

        // плодим воттеры
        for( var i = 0; i < countWm; i++ ){
          WMGrid.append('<div class="many-wm-wrap-item"></div>');
        }

        WMGrid.css({
          width: wmWrapWidth,
          height: wmWrapHeight
        });

        $('.many-wm-wrap-item').css({
          background: "url(" + wmSrc + ") no-repeat",
          width: widthWm,
          height: heightWm,
          marginTop: marginY/2,
          marginLeft: marginX/2,
          marginBottom: marginY/2,
          marginRight: marginX/2
        });

          $('.many-wm-wrap').on('mouseover',function(e){
              $('.many-wm-wrap').draggable({
                  scroll: false,
                  drag:function(event, ui){
                      if(ui.position.left > 0) ui.position.left = 0;
                      if(ui.position.top > 0) ui.position.top = 0;
                      /* Это наработки, пока не обращать внимание, уберу как разберусь!
                      Ок, нет проблем
                      countXWm = parseInt( wmWrapWidth / (widthWm + marginX));
                      countYWm = parseInt( wmWrapHeight / (heightWm + marginY));
                      dragX = (countXWm * widthWm + marginX) - widthImg;
                      dragY = (countYWm * heightWm + marginY) - heightImg;
                      console.log(dragX);*/
                      if(ui.position.left < (-dragX)) ui.position.left = (-dragX);
                      if(ui.position.top < (-dragY)) ui.position.top = (-dragY);
                  }
              });
          });
      },

      // двигаем наш каскад воттеров
      setPosMany: function(){
        if ( marginX < 0 ) marginX = 0;
        if ( marginY < 0 ) marginY = 0;
        if ( marginX > 100 ) marginX = 100;
        if ( marginY > 100 ) marginY = 100;

        $('.many-wm-wrap-item').css({
          marginTop: marginX/2,
          marginLeft: marginY/2,
          marginBottom: marginX/2,
          marginRight: marginY/2
        });
      }
    };

    // инициализируем модуль

    // возвращаем объект с публичными методами
    return {
      init: function() {
        self = app;
        img = $('#img');
        field = $('.move-field');
        boardX = $('#board-x');
        boardY = $('#board-y');

        self.events();
        self.getInfo();
        self.doOneStep();
        self.refreshBoard();

        WM.draggable({
            containment: ".img-area",
            scroll: false,

            drag:function(event, ui){
                self.refreshBoard(ui.position.left, ui.position.top)
            },

            stop: function(event, ui){
                left = ui.position.left;
                top = ui.position.top;
            }
        });
      },

      getPosition: function() {
        return {
          tiling: tiling,
          posX: left,
          posY: top,
          marginX: marginX,
          marginY: marginY
        }
      }
    };
  }());


  //=================================
  // Прозрачность вотера
  //=================================

  opacityWm = (function() {
    var
        app,
        self,
        toggle,
        scale,
        bar,
        rangeControls,

        opacity = .7,
        scaleWidth,
        leftEdge,
        rightEdge,
        $document;
  
    app = {
      events: function() {

        rangeControls.on('mousedown', function (e) {
          e.preventDefault();
          WM.css('transition', 'none');

          toggle.css('background-color', '#f97e76');

          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });



        //========================================

        function mousemove(e) {
          var pos = e.screenX - leftEdge;
          opacity = pos/scaleWidth;

          if (( e.screenX > leftEdge ) && ( e.screenX < rightEdge )) {
            self.moveOpacity();
          }
        };

        function mouseup() {
          toggle.css('background-color', '');
          WM.css('transition', '');
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
        };
      },

      moveOpacity: function(e) {
        var pos = scaleWidth * opacity;

        toggle.css('left', pos);
        bar.css( 'width', pos + 5);

        self.setOpacity();
      },

      setOpacity: function() {
        if ( tiling ) WMGrid.css( 'opacity', opacity );
        else WM.css( 'opacity', opacity );
      }
    };

    return {
      init: function() {
        self = app;
        toggle = $('.toggle');
        bar = $('.bar');
        scale = $('.scale');
        rangeControls = $('.range-controls');
        $document = $(document);

        scaleWidth = scale.width();
        leftEdge = scale.offset().left;
        rightEdge = leftEdge + scaleWidth;

        self.events();
        self.moveOpacity();
      },

      setOpacity: app.setOpacity,

      getOpacity: function() {
        return opacity;
      }
    };
  }());



  /* Получение инфы о вотере
    
    // возвращает объект
    // tiling - boll (замощение on/off)
    // posX
    // poxY
    // если включен режим замощения следующие переменные заполняются, иначе undefined
    // marginX - расстояние между вотерами по горизинтали
    // marginY - расстояние между вотерами по вертикали
    moveWm.getPosition();

    // возвращает число
    opacityWm.getOpacity();
  */

  // вызываем после загрузки изображений на сервер
  function initGlobal() {
    WM = $('.wm');
    moveWm.init();
    opacityWm.init();
  }

  // тест функции. 
  setTimeout(function() {
    initGlobal();
  }, 500);
}();"use strict";

var getImg = (function () {
    var app = {
        init: function () {
            app.setUpListeners();
        },
        setUpListeners: function () {
            $('form.send').on('submit', app.createImg);
        },
        createImg: function (e) {
            e.preventDefault();

            var dataObj = {
                opacity : 1,
                deltaX: 50,
                deltaY: 50,
                image: $('#img').attr('src') ,
                watermark: $('#wm').attr('src')
            }

            $.ajax({
                url: 'php/create-img.php',
                type: 'POST',
                data: 'data='+ JSON.stringify(dataObj),
                dataType: 'JSON',
                success: function (src) {

                }
            });
        }
    }
    app.init();
    return {}
})();
;'use strict';

var module = (function() {
    var
        app,
        self,
        pics = $('.fileupload'),
        wrap = $('.upload-wrapper'),
        GLOBALSCALE,
        defObj = {
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
}());