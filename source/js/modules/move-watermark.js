'use strict';

var moveWatermark = (function() {
  var
      // Рабочие переменные
      app,
      self,
      timer,

      // Изображения
      img,
      wm,
      field,

      // Панели отображения позиции
      boardX,
      boardY,

      // Выбраный режим наложение воттермарка
      oneWater = true,
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

      // обертка множественного воттера
      wmWrap,

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
    // Инициалицация модуля


    // События модуля
    events: function() {
      // Таблица  ====================
      field.on('click', 'td', function(e) {
        e.preventDefault();
        if ( oneWater ){
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
        wm.on('mousedown', function(){
            // отключаем анимацию при драге
            wm.css('transition', 'none');
        });
        wm.on('mouseup', function(){
            // отключаем анимацию при драге
            wm.css('transition', '');
        });

      // Спинер =======================
      $('.spinner-group').on('mousedown', 'a', function(e) {
        e.preventDefault()

        // отключаем анимацию
        wm.css('transition', 'none');

        var direction = this.getAttribute('data-direction');

        self.repeat(null, function() {
          self.move(direction);
          self.refreshBoard();
        });
      });

      $('.spinner-group').on('mouseup', 'a', function(e) {
        clearInterval(timer);
        wm.css('transition', '');
      });

      $('.spinner-group').on('mouseleave', 'a', function() {
        clearTimeout(timer);
        wm.css('transition', '');
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
              oneWater = true;
              field.find('td').eq(0).trigger('click');

              manyWaterField && manyWaterField.hide()
              wmWrap && wmWrap.hide()
              wm.show();
          } else {
            // режим наложения множественного воттера
              oneWater = false;
              wm.hide();
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

              if(wmWrap){
                // если обертка каскадом воттеров существует - показываем
                wmWrap.show();
                self.setPosMany();
              }else{
                //если не существует - создаём
                self.manyWater();
              }
            self.refreshBoard();
          }
      });
    },

    // Попиксельное изменение позиции
    // direction - направление смещения
    move: function( direction ) {
      if ( oneWater ) {
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
            marginX += 1;
              dragY += countXWm;
            break;
          case 'left':
            marginX -= 1;
              dragY -= countXWm;
            break;
          case 'top':
            marginY += 1;
              dragX += countYWm;
            break;
          case 'bottom':
            marginY -= 1;
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

      wm.css({
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
    refreshBoard: function(x,y) {
        if(!x || !y){
          if ( oneWater ) {
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
      wmWrap = $('<div>', {
        'class': 'many-wm-wrap'
      });

      $('.img-area').append( wmWrap );

      var
          wmSrc = wm.attr('src'),

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
        wmWrap.append('<div class="many-wm-wrap-item"></div>');
      }

      wmWrap.css({
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
      wm = $('#wm');
      field = $('.move-field');
      boardX = $('#board-x');
      boardY = $('#board-y');

      self.events();
      self.getInfo();
      self.doOneStep();
      self.refreshBoard();
      wm.draggable({
          containment: ".img-area",
          scroll: false,
          drag:function(event, ui){
              self.refreshBoard(ui.position.left,ui.position.top)
          },
          stop: function(event, ui){
              left = ui.position.left;
              top = ui.position.top;
          }
      });
    },
  };
}());


moveWatermark.init();