const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const server = require('http').createServer(app);
const ws = require('ws');

const wsServer = new ws.Server({ port: 5000 }, () =>
  console.log('Сервер подклечен на порту 5000!'),
);

const clients = [];

wsServer.on('connection', ws => {
  clients.push(ws);

  ws.on('message', data => {
    const message = JSON.parse(data);

    switch (message.event) {
      case 'message':
        broadcastMessage(message);
        break;
      case 'connection':
        broadcastMessage(message);
        break;
      default:
        break;
    }
  });
  ws.on('close', () => {
    const idx = clients.findIndex(client => client === ws);
    clients.splice(idx, 1);
  });
});

const broadcastMessage = message => {
  clients.forEach(client => {
    client.send(JSON.stringify(message));
  });
};
