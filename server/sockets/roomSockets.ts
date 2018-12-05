import socketIO from 'socket.io'
import { ID, RoomData } from '../../types';
import RoomDB from '../room/roomDB';
import SelectSockets from './selectSockets';
import RoomInfo from '../room/roomInfo';
import { SocketConnection } from '../socketSetup';

export default class RoomSockets {
    private conn: SocketConnection;
    private roomNsp: socketIO.Namespace;

    constructor(nsp: socketIO.Namespace, conn: SocketConnection) {
        this.conn = conn;
        this.roomNsp = nsp;

        this.roomNsp.on('connection', (socket: socketIO.Socket) => {
            socket.on('joinRoom', (roomId: ID) => {
                console.log(socket.id + ' has joined room ' + roomId);
                socket.join(roomId);
            });

            socket.on('leaveRoom', (roomId: ID) => {
                socket.leave(roomId, (err: any) => {
                    if (!err) {
                        this.leaveRoom(roomId, socket.id.replace(/\/.+#/, ''));
                    }
                });
            });

            socket.on('updateInfo', (roomId: ID) => {
                this.updateInfo(roomId);
            });

            socket.on('startGame', (roomId: ID) => {
                this.roomNsp.in(roomId).emit('startGame');
            });

            socket.on('disconnect', () => {
                conn.db.roomMap.forEach((val: RoomInfo, key: string) => {
                    const playerId = socket.id.replace(/\/.+#/, '');
                    if (val.players.indexOf(playerId) > -1) {
                        this.leaveRoom(key, playerId);
                    }
                });
            });
        });
    }

    public kickFromRoom(roomId: ID) {
        this.roomNsp.in(roomId).emit('kicked');
    }

    private leaveRoom(roomId: ID, playerId: ID): RoomData {
        let roomInfo: RoomInfo = null;
        let data: RoomData = null;
        if (this.conn.db.roomMap.has(roomId)) {
            roomInfo = this.conn.db.roomMap.get(roomId).decrPlayers(playerId);
        }
        if (roomInfo) {
            data = roomInfo.toMsg();
            if (roomInfo.players.length <= 0) {
                if (this.conn.db.roomMap.has(roomId)) {
                    this.conn.db.roomMap.delete(roomId);
                }
                this.conn.selectSockets.deleteInfo(data);
            } else {
                this.updateInfo(roomId);
                this.conn.selectSockets.updateInfo(data);
            }
        }
        return data;
    }

    private updateInfo(roomId: ID) {
        let data: RoomData = null;
        if (this.conn.db.roomMap.has(roomId)) {
            data = this.conn.db.roomMap.get(roomId).toMsg();
        }
        this.roomNsp.in(roomId).emit('updateInfo', data);
    }
}
