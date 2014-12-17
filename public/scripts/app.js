"use strict";

var module = (function () {
    var app = {
        init: function () {
            app.setUpListeners();
        },
        setUpListeners: function () {
            $('form.send').on('submit', app.createImg);
        },
        createImg: function (e) {
            e.preventDefault();

            $.ajax({
                url: 'php/create-img.php',
                type: 'POST',
                success: function () {
                    console.log('Good');
                }
            })
        }
    }
    app.init();
    return {}
})();
;'use strict';

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
            // Крест =)
            manyWaterField,
            manyWaterFieldX,
            manyWaterFieldY,

			// Различные размеры для
			// выравнивания вотермарка
			sectorW,
			sectorH,
			oneSectorW,
			oneSectorH,
			maxWidth,
			maxHeight,
			marginX,
			marginY,

			// обертка множественного воттера
			wmWrap,

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
			// Переключалка режимов наложения воттера
            $('.control').on('click','a',function(e){
                e.preventDefault();
                $(this).parents('ul').find('a').removeClass('active');
                $(this).addClass('active');
                if($(this).hasClass('one')){
                	// режим наложения одиночного воттера
                    oneWater = true;
                    $('.move-field').find('td').eq(0).trigger('click');
                    (manyWaterField && manyWaterField.hide());
                    (wmWrap && wmWrap.hide());
                    wm.show();
                }else{
                	// режим наложения множественного воттера
                    oneWater = false;
                    wm.hide();
                    $('.move-field').find('td').removeClass('active');
                    if(manyWaterField){
                    	// если крест создан, показываем
                    	manyWaterField.show();
                    }else{
                    	// крест не создан - создаём
	                    $('.move-field').append("<div class='many-water-field'></div>");
	                    manyWaterField = $('.many-water-field');
	                	manyWaterField.append("<div class='many-water-field-x'><span></span></div>").append("<div class='many-water-field-y'><span></span></div>");
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
		move: function(direction) {
			if(oneWater){
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
			}else{
				switch(direction) {
					case 'right':
						marginX += 1;
						break;
					case 'left':
						marginX -= 1;
						break;
					case 'bottom':
						marginY += 1;
						break;
					case 'top':
						marginY -= 1;
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
			if(oneWater){
				boardX.text(left);
				boardY.text(top);
			}else{
				boardX.text(parseInt(marginX));
				boardY.text(parseInt(marginY));
				manyWaterFieldX.css("height", marginX+'%');
            	manyWaterFieldY.css("width", marginY+'%');
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
			// отрисовываем обертку для заполнения воттерами
			var picWm = wm.attr('src');
			$('.img-area').append('<div class="many-wm-wrap"></div>');
			wmWrap = $('.many-wm-wrap');
			wmWrap.css({
				width: img.width()*1.5,
				height: img.height()*1.5
			});
			// считаем кол-во воттеров, которые влезают в обертку
			var countXWm = parseInt(wmWrap.width()/wm.width());
			var countYWm = parseInt(wmWrap.height()/wm.height());
			var countWm = (countXWm * countYWm);
			// считаем кол-во воттеров, которые влезают в области нашего изображения
			var countXWmL = parseInt(img.width()/wm.width());
			var countYWmL = parseInt(img.height()/wm.height());
			// считаем отступы для ровного заполнения воттерами большой картинки
			marginX = (img.width()/countXWmL)-wm.width();
			marginY = (img.height()/countYWmL)-wm.height();
			// плодим воттеры
			for(var i = 0;i < countWm;i++){
				wmWrap.append('<div class="many-wm-wrap-item"></div>');
			}
			// наделяем нужными стилями
			$('.many-wm-wrap-item').css({
				background: "url("+picWm+") no-repeat 0 0",
				height: wm.height(),
				width: wm.width(),
				marginTop: marginY/2,
				marginLeft: marginX/2,
				marginBottom: marginY/2,
				marginRight: marginX/2
			});	
		},
		// двигаем наш каскад воттеров
		setPosMany: function(){
			if ( marginX < 0 ) marginX = 0;
			if ( marginY < 0 ) marginY = 0;
			if ( marginX > 100 ) marginX = 100;
			if ( marginY > 100 ) marginY = 100;
			$('.many-wm-wrap-item').css({
				marginTop: marginY/2,
				marginLeft: marginX/2,
				marginBottom: marginY/2,
				marginRight: marginX/2
			});	
		}
	};

	// инициализируем модуль
	setTimeout(function() {
		app.init();
	}, 700)

	// возвращаем объект с публичными методами
	return {};
}());
;var app = angular.module('drag', []);

app.controller('DragCtrl', ['$scope', function($scope) {
  
}]);

app.directive('draggable', ['$document', function($document) {
  return {
          restrict: 'C',
          link: function(scope, element, attr) {
            var startX = 0, x = 0;

            element.bind('mousedown', function(event) {
              event.preventDefault();
              startX = event.screenX - x;
              $document.bind('mousemove', mousemove);
              $document.bind('mouseup', mouseup);
            });

            function mousemove(event) {
              x = event.screenX - startX;
              element.css({
                left: x + 'px'
              });
            }

            function mouseup() {
              $document.unbind('mousemove', mousemove);
              $document.unbind('mouseup', mouseup);
            }
          }
        };
}]);;'use strict';

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
                    var loadPic = $('<img/>').attr('src', src), // Создание картинки с путем
                            loadPicName = this.files[0].name, // Имя картинки
                            valid = true; // Флаг

                    console.log(pics.first());

                    $('#img').remove(); // Удалить предыдущую картинку
                    loadPic.prependTo($('.img-area')).attr('id', 'img'); // вставить в начало mg-area

                    $.each(pics, function (index, val) {
                        var pic = $(val), // инпут
                                val = pic.val(); // значение инпута
                        if (val.length === 0) { // если значение инпута пустое
                            pic
                                .closest('.form-group') // в родителях .form-group
                                .find(wrap) // найти wrap
                                .addClass('error'); // добавить класс
                            valid = false;
                        } else {
                           pic
                                .closest('.form-group')
                                .find(wrap)
                                .removeClass('error') // удалить класс
                                .text(loadPicName); // показать имя
                        }});
                    return valid;
                    // Подключаем вотермарк
            }
        }


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
  return {};
}());