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
			})

			$('.spinner-group').on('mouseleave', 'a', function() {
				clearTimeout(timer);
			})
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
