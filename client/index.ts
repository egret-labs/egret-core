type Response = {

    code: number,

    output: string
}


let fetch = (url) => {

    return new Promise<Response>((reslove, reject) => {
        let http = new XMLHttpRequest();
        http.open("GET", url);
        http.onload = function () {
            let json = JSON.parse(http.responseText);
            reslove(json);
        }
        http.send();
    });
}


async function run() {
    let app = document.getElementById("app");
    let ts = document.createElement("div");
    let res = document.createElement("div");
    let iframe = document.createElement("iframe");
    iframe.width = '480px';
    iframe.height = '800px';
    app.appendChild(ts);
    app.appendChild(res);
    app.appendChild(iframe);




    function states(port: number, div: HTMLDivElement) {
        return new Promise<Response>((reslove, reject) => {
            fetch(`http://localhost:${port}/index.html`).then(response => {
                div.innerText = response.output;
                reslove(response);
            });
        })

    }

    setInterval(() => {

        let cards = [
            { container: ts, port: 4000 },
            { container: res, port: 4001 }
        ];

        let current = 0;

        cards.forEach(card => {
            states(card.port, card.container).then(response => {
                console.log(response)
                if (response.code == 2) {
                    current++;
                }
                if (current == cards.length) {
                    if (!iframe.src) {
                        iframe.src = 'http://localhost:3005/index.html';
                    }

                }
            });
        })


    }, 1000)

};

run();

