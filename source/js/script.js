'use strict';

// переменная являющаяся модулем, в которую отработает самовызывающаяся функция
var module = (function() {
    // Обьявляем пустые переменные, для последующей с ними работы
    var
        app,
        self,

        // переменная может быть и не пустой, если для ее определения
        // ее значения не нужно выполнять капких-либо действий
        flag = true;
        // так же тут могут быть настройки модуля
        //width = 250,
        //animateDuration = 1000;

   app = {
    // метод инициалицации модуля
    init: function() {
      // сохраняем контекст в переменную созданную выше.
      // Делаем для того, что бы она была доступна в модуле отовсюду.
      // Так же делаем с любыми другими переменными, которые могут понадобиться
      // в разных местах модуля.
      self = this;

      // какой-то код

      // вызываем метод который понавешает события модуля
      self.events();
      // Также тут вызываем методы которые нужны для инициализации
    },

    // метод содержащий все события модуля
    events: function() {
        $(function () {
            var url = window.location.hostname === 'blueimp.github.io' ?
                '//jquery-file-upload.appspot.com/' : 'server/php/';
            $('.fileupload').fileupload({
                url: url,
                dataType: 'json',
                done: function (e, data) {
                    $.each(data.result.files, function (index, file) {
                        $('<p/>').text(file.name).appendTo('#files');
                    });
                }
            }).prop('disabled', !$.support.fileInput)
                .parent().addClass($.support.fileInput ? undefined : 'disabled');
        });
    }

    // Другие методы...
  };

  // инициализируем модуль
  app.init();
  // возвращаем объект с публичными методами
  return app;
}());