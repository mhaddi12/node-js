const http = require('http');
const fs = require('fs')


const myServer = http.createServer((req, res) => {
    const logs = `${new Date().toISOString()} - ${req.method} - ${req.url} - ${req.headers['user-agent']}\n`;
    fs.appendFile('log.txt', logs, (err, data) => {
       switch(req.url) {
        case '/':
            res.end('Home Page');
            break;
        case '/about:id':
            res.end('I am Muhammad Haddi, a web developer');
            break;
        case '/contact':
            res.end('Contact Page');
            break;
        default:
            res.end('404 Not Found');
        }
    });

})

myServer.listen(5000, () => console.log('Server Started!')
)