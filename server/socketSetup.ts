import socketIO from 'socket.io'
import RoomInfo from './room/roomInfo';
import SelectSockets from './sockets/selectSockets';
import RoomSockets from './sockets/roomSockets';
import RoomDB from './room/roomDB';
import GameSockets from './sockets/gameSockets';

export class SocketConnection {
    public db: RoomDB;
    public selectSockets: SelectSockets;
    public roomSockets: RoomSockets;
    public gameSockets: GameSockets;

    constructor(io: socketIO.Server) {
        this.db = new RoomDB();
        this.selectSockets = new SelectSockets(io.of('/select'), this);
        this.roomSockets = new RoomSockets(io.of('/room'), this);
        this.gameSockets = new GameSockets(io.of('/game'), this);

        io.on('connect', (socket: SocketIO.Socket) => {
            console.log(socket.id + ' connected');

            socket.on('disconnect', () => {
                console.log(socket.id + ' disconnected');
            });
        });
        
    }
}
