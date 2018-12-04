import socketIO from 'socket.io'
import RoomInfo from './roomInfo';
import SelectSockets from './selectSockets';
import RoomSockets from './roomSockets';
import RoomDB from './roomDB';

export class SocketConnection {
    public db: RoomDB;
    public selectSockets: SelectSockets;
    public roomSockets: RoomSockets;

    constructor(io: socketIO.Server) {
        this.db = new RoomDB();
        this.selectSockets = new SelectSockets(io.of('/select'), this);
        this.roomSockets = new RoomSockets(io.of('/room'), this);

        io.on('connect', (socket: SocketIO.Socket) => {
            console.log(socket.id + ' connected');

            socket.on('disconnect', () => {
                console.log(socket.id + ' disconnected');
            });
        });
        
    }
}
