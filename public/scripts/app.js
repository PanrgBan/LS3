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
        width = 250,
        animateDuration = 1000;

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
    events: function() {},

    // Другие методы...
  };

  // инициализируем модуль
  self.init();
  // возвращаем объект с публичными методами
  return app;
}());