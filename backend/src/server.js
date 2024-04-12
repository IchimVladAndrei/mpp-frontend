/* eslint-disable @typescript-eslint/no-var-requires */
// const express = require('express');
// const cors = require('cors');
// const carRouter = require('./Routers/cars.router.js');
import cors from 'cors';
import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import carRouter from './Routers/cars.router.js';

const app = express();
app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: '*',
    }),
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

//'http://localhost:3000'
app.use('/api/cars', carRouter);

// setInterval(() => {
//     const newRandomCar = generateRandomCar();
//     io.emit('newRandomCar', newRandomCar);
// }, 5990);
io.on('connection', (socket) => {
    console.log('client connected');
    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});
const PORT = 5000;
httpServer.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});

export async function closeServer() {
    httpServer.close();
    // console.log(`${PORT} is closed`);
}

// module.exports = app;
export default app;
