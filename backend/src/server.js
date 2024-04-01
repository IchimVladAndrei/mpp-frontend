import cors from 'cors';
import express from 'express';
//const express=require('express');
import carRouter from './Routers/cars.router.js';
const app = express();
app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: ['http://localhost:3000'],
    }),
);

app.use('/api/cars', carRouter);

const PORT = 5000;
app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});
module.exports = app;
