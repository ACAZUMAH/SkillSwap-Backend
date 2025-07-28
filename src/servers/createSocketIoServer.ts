import { Server } from 'http';
import * as ws from 'socket.io';
import { whitelist } from 'src/common/constants';
import { connection } from 'src/socket';


/**
 * Creates a Socket.IO server and sets up the connection event handler.
 * @param {Server} httpServer - The HTTP server to attach the Socket.IO server to.
 * @returns {ws.Server} - The created Socket.IO server instance.
 */
export const createSocketIoServer = (httpServer: Server): ws.Server => {
    const io = new ws.Server(httpServer, {
        transports: ["polling"],
        cors: {
            origin: whitelist,
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
            credentials: true,
        },
    })
    io.on('connection', (socket) => connection(socket))
    return io;
}