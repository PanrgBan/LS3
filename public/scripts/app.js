'use strict';

!function () {

  var
      MAXHEIGHT = 535, // высота рабочей области
      MAXWIDTH = 650,  // ширина рабочей области
      tiling = false,  // режим замощения
      moveWm,          // модуль перемещения
      opacityWm,       // модуль прозрачности

      wm,       // объект вотермарка
      wmWidth,
      wmHeight,
      wmGrid,   // объект с сеткой из вотеров
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

              clearTimeout(timer)
              wm.css('transition', 'all .3s')
              timer = setTimeout(function() {
                wm.css('transition', '')
              }, 400);

              stepX = +this.getAttribute('data-x'),
              stepY = +this.getAttribute('data-y');
              self.doOneStep();
          }
        });

        // ====================================
        // события дропа одиночного воттера
        wm.draggable({
            containment: ".img-area",
            scroll: false,

            drag:function(event, ui){
              self.savePos(ui.position.top, ui.position.left)
              self.refreshBoard()
            }
        });

        // ====================================
        // Спинер
        $('.spinner-group').on('mousedown', 'a', function(e) {
          e.preventDefault()
          wm.css('transition', 'none');

          var direction = this.getAttribute('data-direction');

          self.repeat(null, function() {
            self.move(direction);
          });
        });

        $('.spinner-group').on('mouseup', 'a', function(e) {
          clearInterval(timer);
        });

        $('.spinner-group').on('mouseleave', 'a', function() {
          clearTimeout(timer);
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

                if ( wmGrid ) {
                  wmGrid.hide()
                  manyWaterField.hide()
                }

                wm.show();
            } else {
              // режим наложения множественного воттера
                tiling = true;
                wm.hide();
                field.find('td').removeClass('active');

                $(".move-spinner")
                  .find(".pos-x")
                  .find("label")
                  .html("<img src='/images/top-bottom.jpg'>");
                $(".move-spinner")
                  .find(".pos-y")
                  .find("label")
                  .html("<img src='/images/left-right.jpg'>");

                if ( wmGrid ){
                  manyWaterField.show();
                  wmGrid.show();
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
        if ( tiling ) {
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
        } else {
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
        }
      },

      // Изменение позиции по секторам
      doOneStep: function() {
        if (typeof stepX !== 'number') stepX = 0;
        if (typeof stepY !== 'number') stepY = 0;

        var
            top =  sectorCenterHeight + sectorHeight * stepY,
            left =  sectorCenterWidth + sectorWidth * stepX;

        self.savePos(top, left);
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

        wm.css({
          'left': left,
          'top': top
        })

        self.refreshBoard();
      },

      // Получение необходимой информации
      // о изобажениях и секторах
      getInfo: function() {
        // Размеры основного изображения
        imgWidth = img.width(),
        imgHeight = img.height(),

        // Размеры сектора
        sectorWidth = ~~( imgWidth / quantitySectors );
        sectorHeight = ~~( imgHeight / quantitySectors );

        // Расстояния для центрироания
        // вотермарка в секторе
        sectorCenterWidth = ~~(( sectorWidth - wmWidth ) / 2 );
        sectorCenterHeight = ~~(( sectorHeight -  wmHeight) / 2 );

        // Максимальное расстояние чего-то там
        maxWidth = imgWidth - wmWidth;
        maxHeight = imgHeight - wmHeight;
      },

      // Рефреш инфы в спинере
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

      savePos: function(x, y) {
        left = y;
        top = x;
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
        wmGrid = $('<div>', {
          'class': 'many-wm-wrap'
        });

        $('.img-area').append( wmGrid );

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
            wmSrc = wm.attr('src'),
            // колличество воттеров
            countWm = countXWm * countYWm;


        // плодим воттеры
        for( var i = 0; i < countWm; i++ ){
          wmGrid.append($('<img>', {
            src: wmSrc,
            'class': 'many-wm-wrap-item',
            style: 'width:' + wmWidth + 'px; height:' + wmHeight + 'px;'
          }));
        }

        wmGrid.css({
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

                  if( ui.position.left > 0 ) ui.position.left = 0;
                  if( ui.position.top > 0 ) ui.position.top = 0;
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

        wmGrid.css({
            width: newWmWrapWidth,
            height: newWmWrapHeight
        });

        self.refreshBoard();
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

      resetPos: function() {

        if ( tiling ) {
          marginX = 0;
          marginY = 0;
          self.setPosTiling();
        } else {
          field.find('td').eq(0).trigger('click');
        }
      },

      getPosition: function() {
        return tiling
          ? {
            posTilingX: posTilingX,
            posTilingY: posTilingY,
            marginX: marginX / imgWidth * 100 + '%',
            marginY: marginY / imgHeight * 100 + '%'
          }
          : {
            posX: left / imgWidth * 100 + '%',
            posY: top / imgHeight * 100 + '%',
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
                  wm.css('transition', 'none');

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
              if (tiling) wmGrid.css('opacity', opacity);
              else wm.css('opacity', opacity);
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

  !function () {
      var
          app, self,
          pics = $('.fileupload'),
          wrap = $('.upload-wrapper'),
          imgArea = $('.img-area'),
          GLOBALSCALE = 1,

          defObj = {
              url: 'php/upload.php',
              type: 'POST',

              success: function (src) {
                  var
                      data = JSON.parse(src),
                      loadPicWidth = data.width,
                      loadPicHeight = data.height,
                      loadPicName = data.fileName,
                      loadImg = $('<img/>', {
                        src: data.path,
                        id: data.inputName,
                        'class': data.inputName
                      }),

                      changeInputName = function() {
                        var name = data.fileName
                        if ( name.length > 23 ) {
                          name = data.fileName.slice(0, 23) + '...';
                        }
                        $('input[name = ' + data.inputName + ']').closest('.form-group').find(wrap).text( name );
                      };

                  if (data.inputName === 'img') {
                      $('#img').remove();

                      loadImg.prependTo( imgArea );

                      if (loadPicHeight > MAXHEIGHT || loadPicWidth > MAXWIDTH) {
                          if (loadPicWidth > loadPicHeight) {
                              loadImg.css('width', MAXWIDTH);
                              GLOBALSCALE = MAXWIDTH / loadPicWidth;
                          } else {
                              loadImg.css('height', MAXHEIGHT);
                              GLOBALSCALE = MAXHEIGHT / loadPicHeight;
                          }
                      }

                      $('.upload__pic')
                          .removeClass('disabled')
                          .find(pics)
                          .removeClass('disabled-input');
                      changeInputName();
                  } else {
                    if ( wm ) { wm.remove(); }

                    wm = loadImg;
                    wmWidth = ~~( loadPicWidth * GLOBALSCALE );
                    wmHeight = ~~( loadPicHeight * GLOBALSCALE );

                    loadImg
                      .css({
                          'width': wmWidth,
                          'height': wmHeight
                      })
                      .appendTo( imgArea );

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
  }();


  //=================================
  // Загрузка готового изображения
  //=================================

  !function () {
    var
        btnReset = $('.btn-reset');

      var app = {
          init: function () {
              app.setUpListeners();
          },

          setUpListeners: function () {
              btnReset.on('click', function(e) {
                e.preventDefault(e);
                moveWm.resetPos();
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
                    watermark: wm.attr('src'),
                  };

              if ( tiling ) {
                dataObj.tiling = true;
                dataObj.posTilingX = move.posTilingX;
                dataObj.posTilingY = move.posTilingY;
                dataObj.marginX = move.marginX;
                dataObj.marginY = move.marginY;
              } else {
                dataObj.deltaX = move.posX;
                dataObj.deltaY = move.posY;
              }

              $('.loader-l').show();

              $.ajax({
                url: 'php/create-img.php',
                type: 'POST',
                data: dataObj,
                success: function() {
                  location.href = 'php/show.php';
                  $('.loader-l').hide();
                }
              });
          }
      }

      app.init();
      return {}
  }();



  function initGlobal() {
      moveWm.init();
      opacityWm.init();
      init = true;
  }
}()