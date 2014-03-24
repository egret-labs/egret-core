(function () {
    var updateLoading = function(p){
        if(p>=1) {
            init();
        }
    };

    var d = document;
    var loaded = 0;
    var list = jsFileList;
    if (navigator.userAgent.indexOf("Trident/5") > -1) {
        //ie9
        var i = -1;
        var loadNext = function () {
            i++;
            if (i < list.length) {
                var f = d.createElement('script');
                f.src = list[i];
                f.addEventListener('load',function(){
                    loadNext();
                    loaded++;
                    updateLoading(loaded / list.length);
                    this.removeEventListener('load', arguments.callee, false);
                },false);
                d.body.appendChild(f);
            }
        };
        loadNext();
    }
    else {
        list.forEach(function (f, i) {
            var s = d.createElement('script');
            s.async = false;
            s.src = f;
            s.addEventListener('load',function(){
                loaded++;
                updateLoading(loaded / list.length);
                this.removeEventListener('load', arguments.callee, false);
            },false);
            d.body.appendChild(s);
        });
    }
})();



