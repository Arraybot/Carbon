const express = require('express');
const database = require('./database');

const PORT_MONITOR = process.env.PORT_MONITOR || 8080;
let connections = new Set();

module.exports = (app, handler) => {
    // Keep track of connections.
    handler.on('connection', connection => {
        // Add the connection.
        connections.add(connection);
        // Remove again when it gets killed.
        connection.on('close', () => connections.delete(connection));
    });
    let monitor = express();
    // GET: Shows the number of concurrent connections.
    monitor.get('/', (_, res) => {
        res.json({
            connected: connections.size
        });
    });
    // POST: Kills the server.
    monitor.post('/', (_, res) => {
        console.log('Received shutdown signal');
        res.status(204).send();
        // Make sure to use another event loop!
        setTimeout(() => {
            console.log('Connections are being terminated');
            // Starts off by killing any existing connections.
            connections.forEach(connection => connection.end());
            // Then, it shuts down the main server.
            handler.close(() => {
                console.log('Main server is offline');
                let closeHook = () => {
                    console.log('Cleaning up shutdown handler');
                    handlerSelf.close(() => {
                        console.log('Goodbye');
                    });
                }
                database.stop().then(closeHook).catch(closeHook);
            })
        }, 1000);
    });
    // Host the server.
    let handlerSelf = monitor.listen(PORT_MONITOR, () => {
        console.log('Monitoring on ' + PORT_MONITOR);
    });
};
