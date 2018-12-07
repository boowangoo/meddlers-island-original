import socketIO from 'socket.io'
import { SocketConnection } from '../socketSetup';
import GameBoardSockets from './game/gameBoardSockets';
import GameDB from '../game/gameDB';

export default class GameSockets {
    private conn: SocketConnection;
    private gameNsp: socketIO.Namespace;
    
    public db: GameDB;
    public gameBoardSockets: GameBoardSockets;

    constructor(nsp: socketIO.Namespace, conn: SocketConnection) {
        this.conn = conn;
        this.gameNsp = nsp;

        this.db = new GameDB();
        this.gameBoardSockets = new GameBoardSockets(this, nsp);

        this.gameNsp.on('connection', (socket: socketIO.Socket) => {
            socket.on('joinGame', (gameId: ID) => {
                console.log(socket.id + ' has joined game ' + gameId);
                socket.join(gameId);
            });

            socket.on('disconnect', () => {

            });
        });
    }

}
