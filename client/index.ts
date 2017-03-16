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
    let iframe = document.createElement("iframe");
    let dashboard = document.createElement("div");
    iframe.width = '480px';
    iframe.height = '800px';
    app.appendChild(dashboard);
    app.appendChild(iframe);




    function updateState(port: number, div: HTMLDivElement) {
        return new Promise<Response>((reslove, reject) => {
            fetch(`http://localhost:${port}/index.html`).then(response => {
                div.innerText = response.output;
                reslove(response);
            });
        })

    }

    let sub_process = [
        { port: 4000 },
        // { port: 4001 }
    ].map(s => {
        let container = document.createElement("div");
        dashboard.appendChild(container);
        return {
            container,
            port: s.port
        }
    })

    setInterval(() => {

        let current = 0;

        sub_process.forEach(card => {
            updateState(card.port, card.container).then(response => {
                console.log(response.code)
                if (response.code == 2) {
                    current++;
                }
                if (current == sub_process.length) {
                    if (!iframe.src) {
                        iframe.src = 'http://localhost:3005/index.html';
                    }

                }
            });
        })


    }, 1000)

};

run();

