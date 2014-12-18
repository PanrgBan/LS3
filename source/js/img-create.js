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
                success: function (src) {

                }
            })
        }
    }
    app.init();
    return {}
})();
