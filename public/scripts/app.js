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

			// Панели отображения позиции
			boardX,
			boardY,

            // Выбраный режим наложение воттермарка
            oneWater,

			// Различные размеры для
			// выравнивания вотермарка
			sectorW,
			sectorH,
			oneSectorW,
			oneSectorH,
			maxWidth,
			maxHeight,

			// Шаг позиции и расстояния
			// от вотермарка до границ
			stepX = 0,
			stepY = 0,
			top = 0,
			left = 0,

			// Колличество секторов
			quantitySectors = 3;

	app = {
		// Инициалицация модуля
		init: function() {
			self = this;
			img = $('#img');
			wm = $('#wm');
			boardX = $('#board-x');
			boardY = $('#board-y');
            oneWater = true;

			self.events();
			self.getInfo();
			self.doOneStep();
			self.refreshBoard();
		},

		// События модуля
		events: function() {
			// Таблица  ====================
			$('.move-field').on('click', 'td', function(e) {
				e.preventDefault();
                if(oneWater === true){
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
			});

            $('.control').on('click','a',function(e){
                e.preventDefault();
                $(this).parents('ul').find('a').removeClass('active');
                $(this).addClass('active');
                if($(this).hasClass('one')){
                    oneWater = true;
                    $('.move-field').find('td').eq(0).trigger('click');
                    $('.many-water-field').remove();
                }else{
                    oneWater = false;
                    $('.move-field').find('td').removeClass('active');
                    $('.move-field').append("<div class='many-water-field'></div>");
                    $('.many-water-field').append("<div class='many-water-field-x'></div>").append("<div class='many-water-field-y'></div>");
                }
            });
		},

		// Попиксельное изменение позиции
		// direction - направление смещения
		move: function(direction) {

			switch(direction) {
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
			var
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
		refreshBoard: function() {
			boardX.text(left);
			boardY.text(top);
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
		}
	};

	// инициализируем модуль
	setTimeout(function() {
		app.init();
	}, 700)

	// возвращаем объект с публичными методами
	return {};
}());
;var opacityRange = (function () {
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
}());;'use strict';

var module = (function() {
    var
        app,
        self,
        pics = $('.fileupload'),
        wrap = $('.upload-wrapper'),
        defObj = {
                url: 'php/upload.php',
                type: 'POST',
                success: function (src) {
                    var loadPic = $('img').attr('src', src),
                    picName = this.files[0].name,
                            valid = true;

                    console.log(loadPic);
                    loadPic.prependTo($('.img-area'));

                    $.each(pics, function (index, val) {
                        var pic = $(val),
                                val = pic.val();
                        if (val.length === 0) {
                            pic
                                .closest('.form-group')
                                .find(wrap)
                                .addClass('error');
                            valid = false;
                        } else {
                           pic
                                .closest('.form-group')
                                .find(wrap)
                                .removeClass('error')
                                .text(picName);
                        }});
                    return valid;
                    // Подключаем вотермарк
            }
        }


   app = {
    init: function() {
      self = this;

      self.events();
    },

    events: function() {
        pics.fileupload((defObj));
    }
  };

  app.init();
  return {};
}());