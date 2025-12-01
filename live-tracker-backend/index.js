const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());

app.get('/', (req, res) => {
    res.send('Live Server Running');
});


const watchers = {};

wss.on('connection', (ws) => {
    
    console.log('Client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log(data);
    });

    ws.on('close', () => {
        Object.keys(watchers).forEach(uid => {
            watchers[uid] = watchers[uid].filter(client => client !== ws);
        });
    });
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
