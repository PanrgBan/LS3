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

            var dataObj = {
                opacity : 1,
                deltaX: 50,
                deltaY: 50,
                image: $('#img').attr('src') ,
                watermark: $('#wm').attr('src')
            }

            $.ajax({
                url: 'php/create-img.php',
                type: 'POST',
                data: 'data='+ JSON.stringify(dataObj),
                dataType: 'JSON',
                success: function (src) {

                }
            });
        }
    }
    app.init();
    return {}
})();
