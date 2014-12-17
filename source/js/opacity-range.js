var app = angular.module('drag', []);

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
}]);