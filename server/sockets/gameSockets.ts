import socketIO from 'socket.io'
import { SocketConnection } from '../socketSetup';
import GameBoardSockets from './game/gameBoardSockets';
import GameDB from '../game/gameDB';
import { join } from 'path';
import { BoardSize } from '../../shared/consts';

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
            socket.on('joinGame', (gameId: ID, players: number) => {
                socket.join(gameId);
                const joinedPlayers = this.gameNsp.adapter.rooms[gameId].length;
                if (joinedPlayers === players) {
                    if (joinedPlayers === 3 || joinedPlayers === 4) {
                        this.gameNsp.in(gameId).emit('startGameplay', BoardSize.SMALL);
                    }
                }
            });

            socket.on('disconnect', () => {

            });
        });
    }

}
