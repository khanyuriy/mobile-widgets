angular.module('mobile-widgets', [])
/*
side: left, top, right, bootom
depends on hammer.js
*/
.directive('curtain', function () {
    return {
        restrict: 'C',
        link: function ($scope, element, $attrs) {
            var hm, panStarted, side, isHor, isVer, x = 0, y = 0,
                LEFT = 'left', TOP = 'top', RIGHT = 'right', BOTTOM = 'bottom';

            function init() {
                hm = new Hammer(element[0]);
                hm.get('pan').set({ enabled: true, direction: Hammer.DIRECTION_ALL });

                hm.on('panstart', panStart);
                hm.on('pan', pan);
                hm.on('panend', panEnd);

                side = $attrs.side;
                isHor = side == LEFT || side == RIGHT;
                isVer = side == TOP || side == BOTTOM;
            }

            function panStart(event) {
                panStarted = true;
                element[0].style.transition = '';
                element[0].style.webkitTransition = '';
                element.addClass('open');
            }

            function pan(event) {
                if (!panStarted) return;

                var size = getSize(),
                    delta = isHor ? event.deltaX : event.deltaY,
                    percent = delta / size,
                    translateX = 0, translateY = 0;

                if (isHor) {
                    translateX = x + (percent * 100);
                    if (translateX > Math.abs(getMaxTransformValue(delta))) return;
                }
                else if (isVer) {
                    translateY = y + (percent * 100);
                    if (translateY > Math.abs(getMaxTransformValue(delta))) return;
                }


                console.log('translateX=' + translateX + ', translateY=' + translateY);

                element[0].style.webkitTransform = 'translate3d(' + translateX + '%, ' + translateY + '%, 0)';
                element[0].style.transform = 'translate3d(' + translateX + '%, ' + translateY + '%, 0)';

            }

            function panEnd(event) {
                if (!panStarted) return;

                var delta = isHor ? event.deltaX : event.deltaY, transformPercent,
                    size = getSize();

                if (Math.abs(delta) > size * 0.2) {
                    transformPercent = getMaxTransformValue(delta);
                    if (delta > 0) {
                        if (isHor) {
                            x = side == LEFT ? transformPercent : 0;
                        } else {
                            y = side == TOP ? transformPercent : 0;
                        }
                    } else {
                        if (isHor) {
                            x = side == LEFT ? 0 : transformPercent;
                        } else {
                            y = side == TOP ? 0 : transformPercent;
                        }
                    }
                }

                if (isHor) { if (x == 0) { element.removeClass('open'); } }
                if (isVer) { if (y == 0) { element.removeClass('open'); } }

                element[0].style.transition = 'transform 0.2s ease-out';
                element[0].style.webkitTransition = '-webkit-transform 0.2s ease-out';
                element[0].style.webkitTransform = 'translate3d(' + x + '%,' + y + '%,0)'
                element[0].style.transform = 'translate3d(' + x + '%,' + y + '%,0)'

                panStarted = false;
            }

            function getMaxTransformValue(delta) {
                var size = getSize(),
                    viewport = getViewport(),
                    extraSize = size - viewport;
                if (delta > 0) {
                    return 100 - (extraSize / size * 100);
                }
                return -100 + (extraSize / size * 100);
            }

            function getSize() {
                return isHor ? element[0].offsetWidth : element[0].offsetHeight;
            }

            function getViewport() {
                return isHor ? verge.viewportW() : verge.viewportH();
            }

            init();
        }
    };
})