import { Server } from 'http';
import * as ws from 'socket.io';
import { connection } from 'src/socket';

export const createSocketIoServer = (httpServer: Server) => {
    const io = new ws.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
            credentials: true,
        },
    })

    const userSocketMap: Map<string, string> = new Map<string, string>()

    io.on('connection', (socket) => connection(socket, userSocketMap))

    return io;
}