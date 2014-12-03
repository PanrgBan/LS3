<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>

<h1>LoftSchool | Задание №3</h1>

<h2>WaterMark</h2>

<p>Я не особо секу как и что нужно тут расписывать, поэтому (fantasy mod='on')</p>

<h3>Комрады</h3>
<ul>
  <li>Калин Антон</li>
  <li>Спесивых Максим</li>
  <li>Пономаренко Богдан</li>
  <li>Сарыглар Сайзана</li>
</ul>


<h3>Структура проекта</h3>

builder/ - тут лежат все мозги разработки. Отсюда запускается gulp<br>
&nbsp;&nbsp;&nbsp;&nbsp;|_ package.json - необходимые пакеты для gulp<br>
&nbsp;&nbsp;&nbsp;&nbsp;|_ gulpfile.js - магию gulp подчиняем тут<br>
&nbsp;&nbsp;&nbsp;&nbsp;|_ .bowerrc - настройки для bower<br><br>

public/ - сюда стекаются все скомпилированные файлы. Корневая директория для localhost<br>
&nbsp;&nbsp;&nbsp;&nbsp;|_ полно всякой мутотени.<br><br>

source/ - тут происходит разработка проекта<br>
&nbsp;&nbsp;&nbsp;&nbsp;|_ bower_components - bower все тащит в эту папку<br>
&nbsp;&nbsp;&nbsp;&nbsp;|_ js - не поверите! но тут лежат js файлы<br><br>

&nbsp;&nbsp;&nbsp;&nbsp;|_ jade - разметка шаблонов<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_ modules - отдельные модули, такие как header, footer и т.д. выносятся сюда<br><br>

&nbsp;&nbsp;&nbsp;&nbsp;|_ sass - стили<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_ style.scss - при помощи @import подключаем индексные файлы каждой нижеописанной директории<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_ base - базовые стили<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_ _base.scss - базовые стили элементов<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_ _fonts.scss - подключений font-face<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_ _reset.scss - ресет стилей<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_ _index.scss - для подключения всех файлов директории<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_ layout - разметка структуры документа<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_ _container.scss - обертки и контайнеры которыце НЕ являюся модулями<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_ _grid.scss - просая 12ти колоночная сетка<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_ _tools.scss - разные миксины помогающие в создании разметки<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_ _index.scss - агрегатор<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_ modules - логически завершенные сущности разбиваются на модули и остаются тут жить<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_ utilites - переменные<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_ _variables.scss - переменные<br><br>

.gitignore - исключения для гита<br>
README.md - описание проекта<br>

<h3>Инициализация проекта</h3>
<ol>
  <li>Клонируем репозиторий</li>
  <li>Заходим из консоли в папку thisProject/builder/</li>
  <li>Выполняем npm i</li>
  <li>Запускаем дефолтный таск галпа (gulp)</li>
  <li>Улыбаемся</li>
</ol>

<p>Дефолтный таск запустит сервер, откроет в браузере localhost:8080 и начнет следить за файлами в папке source</p>

<p>У меня бывало, что с первого раза npm нормально не вставали и появлялась ошибка. Тогда удаляем появившуюся папку builder/node_modules и снова выполняем npm i</p>

<p><em>TODO/ допилить таск с wiredep и useref</em></p>

<p>Всем спасибо (fantasy mod='off')</p>

  
</body>
</html>
