/*import cors from 'cors';
import express from 'express';
import {createServer} from 'http';
import path, {dirname} from 'path';
import {Server} from 'socket.io';
import {fileURLToPath} from 'url';
import carRouter from './Routers/cars.router.js';
import routerDealers from './Routers/dealerships.router.js';
import userRouter from './Routers/user.router.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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

app.use('/api/cars', carRouter);
app.use('/api/dealers', routerDealers);
app.use('/api/users', userRouter);

const publicFolder = path.join(__dirname, 'public');
app.use(express.static(publicFolder));
app.get('*', (req, res) => {
    const indexFilePath = path.join(publicFolder, 'index.html');
    res.sendFile(indexFilePath);
});

io.on('connection', () => {});
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});

export async function closeServer() {
    httpServer.close();
}

export default app;
*/
