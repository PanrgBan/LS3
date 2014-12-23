'use strict';

!function () {

    var
        MAXHEIGHT = 535, // высота рабочей области
        MAXWIDTH = 650,  // ширина рабочей области
        tiling = false,  // режим замощения
        moveWm,          // модуль перемещения
        opacityWm,       // модуль прозрачности
        upload,          // загрузка на сервер
        getImg,          // получение изображения

        WM,       // объект вотермарка
        WMGrid;   // объект с сеткой из вотеров

    //=================================
    // Перемещение вотера
    //=================================

  moveWm = (function() {
    var
        // Рабочие переменные
        app, self, timer,

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
        imgWidth,
        imgHeight,
        wmWidth,
        wmHeight,
        sectorWidth,
        sectorHeight,
        sectorCenterWidth,
        sectorCenterHeight,
        maxWidth,
        maxHeight,
        dragX,
        dragY,
        countXWm,
        countYWm,
        wmWrapWidth,
        wmWrapHeight,

        // Шаг позиции и расстояния
        // от вотермарка до границ
        stepX = 0,
        stepY = 0,
        top = 0,
        left = 0,
        // расстояние между
        // вотерами в сетке
        marginX = 0,
        marginY = 0,

        // Колличество секторов
        quantitySectors = 3,
        // Множитель увеличения полотна замощения О_о
        multipleTiling = 1.5;

    app = {
      events: function() {

        // ====================================
        // Таблица
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

        // ====================================
        // события дропа одиночного воттера
        WM.on('mousedown', function(){
            WM.css('transition', 'none');
        });

        WM.on('mouseup', function(){
            WM.css('transition', '');
        });

        // ====================================
        // Спинер
        $('.spinner-group').on('mousedown', 'a', function(e) {
          e.preventDefault()
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

        // ====================================
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
                $(".move-spinner").find(".pos-x").find("label").html("X");
                $(".move-spinner").find(".pos-y").find("label").html("Y");

                manyWaterField && manyWaterField.hide()
                WMGrid && WMGrid.hide()
                WM.show();
            } else {
              // режим наложения множественного воттера
                tiling = true;
                WM.hide();
                field.find('td').removeClass('active');
                $(".move-spinner").find(".pos-x").find("label").html("<img src='/images/top-bottom.jpg'>");
                $(".move-spinner").find(".pos-y").find("label").html("<img src='/images/left-right.jpg'>");

                if ( manyWaterField ){
                  // если крест создан, показываем
                  manyWaterField.show();
                } else {
                  // крест не создан - создаём
                  field.append("<div class='many-water-field'></div>");
                  manyWaterField = $('.many-water-field');
                  manyWaterField
                    .append("<div class='many-water-field-y'><span></span></div>")
                    .append("<div class='many-water-field-x'><span></span></div>");
                  manyWaterFieldX = $('.many-water-field-y').find('span');
                  manyWaterFieldY = $('.many-water-field-x').find('span');
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
              break;
            case 'left':
              marginY -= 1;
              break;
            case 'top':
              marginX -= 1;
              break;
            case 'bottom':
              marginX += 1;
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

        left = sectorCenterWidth + sectorWidth * stepX;
        top = sectorCenterHeight + sectorHeight * stepY;

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
        imgWidth = img.width(),
        imgHeight = img.height(),

        // Размеры вотермарка
        wmWidth = WM.width(),
        wmHeight = WM.height();

        // Размеры сектора
        sectorWidth = ~~( imgWidth / quantitySectors );
        sectorHeight = ~~( imgHeight / quantitySectors );

        // Расстояния для центрироания
        // вотермарка в секторе
        sectorCenterWidth = ~~( ( sectorWidth - wmWidth ) / 2 );
        sectorCenterHeight = ~~( ( sectorHeight -  wmHeight) / 2 );

        // Максимальное расстояние чего-то там
        maxWidth = imgWidth - wmWidth;
        maxHeight = imgHeight - wmHeight;
      },

      // Изменение значения позиции
      refreshBoard: function(x,y) {
          if(!x || !y){
            if ( !tiling ) {
              boardX.text(left);
              boardY.text(top);
            } else {
              boardX.text( ~~(marginY) );
              boardY.text( ~~(marginX) );

              manyWaterFieldX.css( "width", marginX + '%' );
              manyWaterFieldY.css( "height", marginY + '%' );
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

        // количество вотеров по x/y
        countXWm = ~~( imgWidth / wmWidth ) * 2;
        countYWm = ~~( imgHeight / wmHeight ) * 2;

        // ширина/длина обертки
        wmWrapWidth = countXWm * wmWidth;
        wmWrapHeight = countYWm * wmHeight;

        var
            wmSrc = WM.attr('src'),

            // Сдвиг враппера в центр
            leftWmWrap = (wmWrapWidth/2) - (imgWidth/2),
            topWmWrap = (wmWrapHeight/2) - (imgHeight/2),

            // колличество воттеров
            countWm = countXWm * countYWm;

          // для ограничения драга нашего каскада с воттерами внутри изображения
          dragX = wmWrapWidth - imgWidth;
          dragY = wmWrapHeight - imgHeight;

        // плодим воттеры
        for( var i = 0; i < countWm; i++ ){
          WMGrid.append('<div class="many-wm-wrap-item"></div>');
        }

        WMGrid.css({
          width: wmWrapWidth,
          height: wmWrapHeight,
          top: -topWmWrap,
          left: -leftWmWrap
        });

        $('.many-wm-wrap-item').css({
          background: "url(" + wmSrc + ") no-repeat",
          width: wmWidth,
          height: wmHeight
        });

        $('.many-wm-wrap').on('mouseover',function(e){
            $('.many-wm-wrap').draggable({
                scroll: false,
                drag:function(event, ui){
                  var newWmWrapWidth = WMGrid.width(),
                      newWMWrapHeight = WMGrid.height();
                  dragX = newWmWrapWidth - imgWidth;
                  dragY = newWMWrapHeight - imgHeight;
                  if(ui.position.left > 0) ui.position.left = 0;
                  if(ui.position.top > 0) ui.position.top = 0;
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
          marginTop: marginY,
          marginLeft: marginX,
          marginBottom: marginY,
          marginRight: marginX
        });
          var newWmWrapWidth = wmWrapWidth + ( countXWm * marginX * 2 ),
              newWMWrapHeight = wmWrapHeight + (countYWm * marginY * 2);
          dragX = newWmWrapWidth - imgWidth;
          dragY = newWMWrapHeight - imgHeight;

          WMGrid.css({
              width: newWmWrapWidth,
              height: newWMWrapHeight
          });
      }
    };

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
          posX: left / MAXWIDTH * 100,
          posY: top / MAXHEIGHT * 100,
          marginX: marginX,
          marginY: marginY
        }
      }
    };
  }());

    //=================================
    // Прозрачность вотера
    //=================================

    opacityWm = (function () {
        var
            app, self,
            rangeControls,
            bar,
            scale,
            toggle,

            opacity = .7,
            scaleWidth,
            leftEdge,
            rightEdge,
            $document;

        app = {
            events: function () {

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
                    opacity = pos / scaleWidth;

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

            moveOpacity: function () {
                var pos = scaleWidth * opacity;

                toggle.css('left', pos);
                bar.css('width', pos + 5);

                self.setOpacity();
            },

            setOpacity: function () {
                if (tiling) WMGrid.css('opacity', opacity);
                else WM.css('opacity', opacity);
            }
        };

        return {
            init: function () {
                self = app;
                rangeControls = $('.range-controls');
                toggle = rangeControls.find('.toggle');
                bar = rangeControls.find('.bar');
                scale = rangeControls.find('.scale');
                $document = $(document);

                scaleWidth = scale.width();
                leftEdge = scale.offset().left;
                rightEdge = leftEdge + scaleWidth;

                self.events();
                self.moveOpacity();
            },

            setOpacity: app.setOpacity,

            getOpacity: function () {
                return opacity;
            }
        };
    }());


    //=================================
    // Отправка изображений на сервер
    //=================================

    upload = (function () {
        var
            app, self,
            pics = $('.fileupload'),
            wrap = $('.upload-wrapper'),
            GLOBALSCALE,
            //delObj = {
            //    mainImg: '123',
            //    wtImg: '456'
            //},
            defObj = {
                url: 'php/upload.php',
                type: 'POST',
                //data: 'obj=' + JSON.stringify(app.delObj),
                //dataType: 'JSON',
                success: function (src) {
                    var
                        data = JSON.parse(src),
                        loadPicWidth = data.width,
                        loadPicHeight = data.height,
                        loadPicPath = $('<img/>').attr('src', data.path),
                        loadPicName = data.fileName,
                        inputName = data.inputName,

                        changeWm = function () {
                            if ( WM ) { WM.remove(); }

                            loadPicPath.appendTo($('.img-area')).attr('id', 'wm').addClass('wm');
                            loadPicPath.css({
                                'width': loadPicWidth * GLOBALSCALE + 'px',
                                'height': loadPicHeight * GLOBALSCALE + 'px'
                            })
                        },

                        changeInputName = function () {
                            $('input[name = ' + inputName + ']').closest('.form-group').find(wrap).text(loadPicName);
                        };

                    if (inputName === 'userfile') {
                        $('#img').remove();
                        loadPicPath.prependTo($('.img-area')).attr('id', 'img');

                        if (loadPicHeight > MAXHEIGHT || loadPicWidth > MAXWIDTH) {
                            if (loadPicWidth > loadPicHeight) {
                                //TODO
                                $('.img-area').css('height', '');
                                loadPicPath.css('width', 100 + '%');
                                GLOBALSCALE = MAXWIDTH / loadPicWidth;
                            } else {
                                loadPicPath.css('height', 100 + '%');
                                //TODO
                                $('.img-area').css('height', 100 + '%');
                                // console.log(2134);
                                GLOBALSCALE = MAXHEIGHT / loadPicHeight;
                            }
                            // console.log(GLOBALSCALE);
                        }
                        $('.upload__pic')
                            .removeClass('disabled')
                            .find(pics)
                            .removeClass('disabled-input');
                        changeInputName();
                    } else {
                        changeWm();
                        changeInputName();

                        // инизиализируем модули
                        initGlobal();
                        console.log(123);
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


    //=================================
    // Загрузка изображений
    //=================================

    getImg = (function () {
        var app = {
            init: function () {
                app.setUpListeners();
            },

            setUpListeners: function () {
                $('form.send').on('submit', app.createImg);
            },

            createImg: function (e) {
                e.preventDefault();

                var move = moveWm.getPosition();

                if (move.tiling) {
                    var marginX = move.marginX;
                    var marginY = move.marignY;
                }

                var dataObj = {
                    opacity: opacityWm.getOpacity(),
                    deltaX: move.posX,
                    deltaY: move.posY,
                    image: $('#img').attr('src'),
                    watermark: $('#wm').attr('src')
                };
                //$.ajax({
                //    url: 'php/create-img.php',
                //    type: 'POST',
                //    data: 'data=' + JSON.stringify(dataObj),
                //    success: function () {
                //        console.log('yes');
                //    },
                //    dataType: 'JSON'
                //});
                $.get("php/create-img.php", dataObj, function (src) {
                    window.location.href = src;
                });
            }
        }
        app.init();
        return {}
    })();


    // вызываем после загрузки изображений на сервер
    function initGlobal() {
        WM = $('.wm');
        moveWm.init();
        opacityWm.init();
    }

    setTimeout(function () {
        initGlobal();
    }, 500);

}()