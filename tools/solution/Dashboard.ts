import * as Server from '../server/server';
import FileUtil = require('../lib/FileUtil');
import path = require('path');

export var dashboard: Server.Middleware = () => {
    return async (reuest, response) => {
        let root = egret.root;
        let indexJs = path.join(egret.root, "client/index.js");
        let scriptContent = FileUtil.read(indexJs);
        let htmlContent = `
        <html>
            <body>
            <div id='app'></div>
            <script type="text/javascript">
                ${scriptContent}
            </script>
           
            </body>
        </html>
        `
        response.write(htmlContent);

    }
}