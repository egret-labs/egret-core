var browsers = {

    orientation : {

        landscape:1,
        portrait:2,
        check:function(checkOrientation){

            if (!browsers.devices.isMobile){
                return true;
            }

            var width = document.documentElement.clientWidth;
            var height = document.documentElement.clientHeight;
            var orientation,message;
            if (checkOrientation == browsers.orientation.landscape){
                message = "当前游戏需要横屏显示，请您旋转屏幕后再试一次";
            }
            else{
                message = "当前游戏需要竖屏显示，请您旋转屏幕后再试一次";
            }
            if (width >= height) {
                orientation = browsers.orientation.landscape;
            }
            else {
                orientation = browsers.orientation.portrait;
            }
            if (orientation == checkOrientation){
                return true;
            }
            else{
                var result = window.confirm(message);
                if (result){
                    window.location.reload();
                }
                return false;
            }
        }

    }




};

(function(){
    var ua = navigator.userAgent.toLowerCase();
    browsers.devices = {};
    browsers.devices.isMobile = (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
})();


