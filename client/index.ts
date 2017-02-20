let fetch = (url) => {

    return new Promise((reslove, reject) => {
        let http = new XMLHttpRequest();
        http.open("GET", url);
        http.onload = function () {
            console.log(http.responseText)
        }
        http.send();
    });
}

fetch("http://localhost:4000/index.html")