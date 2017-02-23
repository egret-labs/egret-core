let fetch = (url) => {

    return new Promise<string>((reslove, reject) => {
        let http = new XMLHttpRequest();
        http.open("GET", url);
        http.onload = function () {
            reslove(http.responseText);
        }
        http.send();
    });
}

async function run() {
    let app = document.getElementById("app");
    let ts = document.createElement("div");
    let res = document.createElement("div");
    app.appendChild(ts);
    app.appendChild(res);

    setInterval(() => {
        fetch("http://localhost:4000/index.html")
            .then(response => ts.innerText = response);
        fetch("http://localhost:4001/index.html")
            .then(response => res.innerText = response);
    }, 1000)

};

run();

