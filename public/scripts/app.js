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
        WMGrid,   // объект с сеткой из вотеров
        init = false;

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
        countXWm,
        countYWm,
        wmWrapWidth,
        wmWrapHeight,
        newWmWrapWidth,
        newWmWrapHeight,

        // Шаг позиции и расстояния
        // от вотермарка до границ
        stepX = 0,
        stepY = 0,
        top = 0,
        left = 0,
        posTilingX = 0,
        posTilingY = 0,
        // расстояние между
        // вотерами в сетке
        marginX = 0,
        marginY = 0,

        // Колличество секторов
        quantitySectors = 3,
        // Множитель увеличения полотна замощения О_о
        multipleTiling = 2;

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

        WM.draggable({
            containment: ".img-area",
            scroll: false,

            drag:function(event, ui){
              left = ui.position.left;
              top = ui.position.top;
              self.refreshBoard()
            }
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

                if ( WMGrid ) {
                  WMGrid.hide()
                  manyWaterField.hide()
                }

                WM.show();
            } else {
              // режим наложения множественного воттера
                tiling = true;
                WM.hide();
                field.find('td').removeClass('active');

                $(".move-spinner")
                  .find(".pos-x")
                  .find("label")
                  .html("<img src='/images/top-bottom.jpg'>");
                $(".move-spinner")
                  .find(".pos-y")
                  .find("label")
                  .html("<img src='/images/left-right.jpg'>");

                if ( WMGrid ){
                  manyWaterField.show();
                  WMGrid.show();
                  self.setPosTiling();
                } else {
                  self.createCross();
                  self.createTiling();
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
          self.setPosTiling();
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
      refreshBoard: function() {
        if ( tiling ) {
          boardX.text( marginY );
          boardY.text( marginX );
        } else {
          boardX.text( left );
          boardY.text( top );

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

      //==========================================
      // Функции замощения

      createCross: function() {
        manyWaterField = $('<div>', {
          'class': 'many-water-field'
        }).append("<div class='many-water-field-y'><span></span></div>")
          .append("<div class='many-water-field-x'><span></span></div>");

        $('.move-field-wr').append( manyWaterField );

        manyWaterFieldX = $('.many-water-field-y').find('span');
        manyWaterFieldY = $('.many-water-field-x').find('span');
      },

      // множественная накладка водянного знака
      createTiling: function(){
        WMGrid = $('<div>', {
          'class': 'many-wm-wrap'
        });

        $('.img-area').append( WMGrid );

        // количество вотеров по x/y
        countXWm = ~~( imgWidth / wmWidth ) * multipleTiling;
        countYWm = ~~( imgHeight / wmHeight ) * multipleTiling;

        // ширина/длина обертки
        wmWrapWidth = countXWm * wmWidth;
        wmWrapHeight = countYWm * wmHeight;

        newWmWrapWidth = wmWrapWidth;
        newWmWrapHeight = wmWrapHeight;

        // Сдвиг враппера в центр
        posTilingX = -(( wmWrapWidth / 2 ) - ( imgWidth / 2 ));
        posTilingY = -(( wmWrapHeight / 2 ) - ( imgHeight / 2 ));

        var
            wmSrc = WM.attr('src'),
            // колличество воттеров
            countWm = countXWm * countYWm;


        // плодим воттеры
        for( var i = 0; i < countWm; i++ ){
          WMGrid.append($('<img>', {
            src: wmSrc,
            'class': 'many-wm-wrap-item',
            style: 'width:' + wmWidth + 'px; height:' + wmHeight + 'px;'
          }));
        }

        WMGrid.css({
          width: wmWrapWidth,
          height: wmWrapHeight,
          top: posTilingY,
          left: posTilingX
        });

        $('.many-wm-wrap').on('mouseover',function(e){
            $('.many-wm-wrap').draggable({
                scroll: false,
                drag: function(event, ui){

                  var
                      stopDragX = imgWidth - newWmWrapWidth,
                      stopDragY = imgHeight - newWmWrapHeight;

                  if(ui.position.left > 0) ui.position.left = 0;
                  if(ui.position.top > 0) ui.position.top = 0;
                  if( ui.position.left < stopDragX ) ui.position.left = stopDragX;
                  if( ui.position.top < stopDragY ) ui.position.top = stopDragY;

                  posTilingX = ui.position.left;
                  posTilingY = ui.position.top;
                }
            });
        });
      },

      // двигаем наш каскад воттеров
      setPosTiling: function(){
        if ( marginX < 0 ) marginX = 0;
        if ( marginY < 0 ) marginY = 0;
        if ( marginX > 100 ) marginX = 100;
        if ( marginY > 100 ) marginY = 100;

        manyWaterFieldX.css( "width", marginX + '%' );
        manyWaterFieldY.css( "height", marginY + '%' );

        $('.many-wm-wrap-item').css({
          marginBottom: marginY,
          marginRight: marginX
        });

          newWmWrapWidth = wmWrapWidth + ( countXWm * marginX );
          newWmWrapHeight = wmWrapHeight + (countYWm * marginY );

          WMGrid.css({
              width: newWmWrapWidth,
              height: newWmWrapHeight
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
      },

      getPosition: function() {
        return tiling
          ? {
            tiling: true,
            posTilingX: posTilingX,
            posTilingY: posTilingY,
            marginX: marginX,
            marginY: marginY
          }
          : {
            posX: left / MAXWIDTH * 100 + '%',
            posY: top / MAXHEIGHT * 100 + '%',
          };
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
                return opacity*100;
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

            defObj = {
                url: 'php/upload.php',
                type: 'POST',

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

                            if ( !GLOBALSCALE ) return;

                            loadPicPath.css({
                                'width': loadPicWidth * GLOBALSCALE,
                                'height': loadPicHeight * GLOBALSCALE
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
                                GLOBALSCALE = MAXHEIGHT / loadPicHeight;
                            }
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
      var
          btnReset = $('.btn-reset');

        var app = {
            init: function () {
                app.setUpListeners();
            },

            setUpListeners: function () {
                btnReset.on('click', function(e) {
                  e.preventDefault(e);
                  alert('Я скоро буду работать. Обещаю!');
                });
                $('form.send').on('submit', app.createImg);
            },

            createImg: function (e) {
                e.preventDefault();

                if ( !init ) return;

                var
                    move = moveWm.getPosition(),
                    dataObj = {
                      opacity: opacityWm.getOpacity(),
                      image: $('#img').attr('src'),
                      watermark: $('#wm').attr('src'),
                    };

                if ( move.tiling ) {
                  dataObj.tiling = true;
                  dataObj.posTilingX = move.posTilingX;
                  dataObj.posTilingY = move.posTilingY;
                  dataObj.marginX = move.marginX;
                  dataObj.marginY = move.marginY;
                } else {
                  dataObj.deltaX = move.posX;
                  dataObj.deltaY = move.posY;
                }

                console.log(dataObj);

                $.post("php/create-img.php", dataObj, function (src) {
                    location.href = 'php/show.php';
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
        init = true;
    }

    initGlobal();
}()