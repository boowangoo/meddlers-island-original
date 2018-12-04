import express from 'express';
import socketIO from 'socket.io';
import { createServer, Server } from 'http';

import { ExpressSetup } from './expressSetup';
import { SocketConnection } from './socketSetup';

const PORT: number = 3000;
let app: express.Application;
let server: Server;
let io: socketIO.Server;

app = express();
ExpressSetup.setup(app);

server = createServer(app);

io = socketIO(server);
new SocketConnection(io);

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
