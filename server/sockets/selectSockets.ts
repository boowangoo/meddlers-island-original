import socketIO from 'socket.io'
import RoomInfo from '../room/roomInfo';
import { RoomData } from '../../shared/types';
import { SocketConnection } from '../socketSetup';

export default class SelectSockets {
    private conn: SocketConnection;
    private selectNsp: socketIO.Namespace;

    constructor(nsp: socketIO.Namespace, conn: SocketConnection) {
        this.conn = conn;
        this.selectNsp = nsp;

        this.selectNsp.on('connection', (socket: socketIO.Socket) => {
            socket.on('createRoom', (roomId: ID, callback: Function) => {
                let data: RoomData = null;
                if (!conn.db.roomMap.has(roomId)) {
                    const room = this.createRoom(roomId);
                    if (room) {
                        console.log(`room ${ roomId } created`);
                        data = room.toMsg();
                        this.updateInfo(data);
                    }
                }
                callback(data);
            });
            
            socket.on('joinRoom', (roomId: ID, callback: Function) => {
                let data: RoomData = null;
                if (conn.db.roomMap.has(roomId)) {
                    const roomInfo = conn.db.roomMap.get(roomId)
                            .incrPlayers(socket.id.replace(/\/.+#/, ''));
                    if (roomInfo) {
                        data = roomInfo.toMsg();
                        this.updateInfo(data);
                    }
                }
                callback(data);
            });

            socket.on('deleteRoom', (roomId: ID) => {
                if (conn.db.roomMap.has(roomId)) {
                    const data = conn.db.roomMap.get(roomId).toMsg();
                    conn.db.roomMap.delete(data.roomId);
                    this.deleteInfo(data);
                    conn.roomSockets.kickFromRoom(roomId);
                }
            });

            socket.on('updateAllInfo', (callback: Function) => {
                const keys: ID[] = Array.from(conn.db.roomMap.keys());
                const data: RoomData[] = keys.map(
                    (roomId) => conn.db.roomMap.get(roomId).toMsg()
                );
                callback(data);
            });
        });
    }

    public updateInfo(data: RoomData) {
        this.selectNsp.emit('updateInfo', data);
    }
    
    public deleteInfo(data: RoomData) {
        this.selectNsp.emit('deleteInfo', data);
    }

    private createRoom(roomId: ID): RoomInfo {
        let room: RoomInfo = null;
        if (!this.conn.db.roomMap.has(roomId)) {
            room = new RoomInfo(roomId, 4); 
            this.conn.db.roomMap.set(roomId, room);
        }
        return room;
    }
}
