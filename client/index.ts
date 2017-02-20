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
    let response = await fetch("http://localhost:4000/index.html")
    app.innerText = response;
};

run();

