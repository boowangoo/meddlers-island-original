import socketIO from 'socket.io'

import { SocketConnection } from '../socketSetup';
import GameBoardSockets from './game/gameBoardSockets';
import GameDB from '../game/gameDB';
import { BoardSize } from '../../shared/consts';
import GameLogSockets from './game/gameLogSockets';
import GameInfo from '../game/gameInfo';
import { PlayerData } from '../../shared/types';

export default class GameSockets {
    private conn: SocketConnection;
    private gameNsp: socketIO.Namespace;
    
    public db: GameDB;
    public gameBoardSockets: GameBoardSockets;
    public gameLogSockets: GameLogSockets;

    constructor(nsp: socketIO.Namespace, conn: SocketConnection) {
        this.conn = conn;
        this.gameNsp = nsp;

        this.db = new GameDB();
        this.gameLogSockets = new GameLogSockets(this, nsp);
        this.gameBoardSockets = new GameBoardSockets(this, nsp);

        this.gameNsp.on('connection', (socket: socketIO.Socket) => {
            socket.on('joinGame', (gameId: ID, players: number) => {
                socket.join(gameId);
                const joinedPlayers = this.gameNsp.adapter.rooms[gameId].length;
                this.addGameInfo(gameId, socket);
                if (joinedPlayers === players) {
                    if (joinedPlayers === 3 || joinedPlayers === 4) {
                        this.gameNsp.in(gameId).emit('startGameplay', BoardSize.SMALL);
                    }
                }
            });

            socket.on('updateAllPlayerInfo', (gameId: ID, callback: Function) => {
                if (this.db.gameMap.has(gameId)) {
                    const dataArr: PlayerData[] = this.db.gameMap.get(gameId)
                            .map((info: GameInfo) => {
                        if (info.playerId === socket.id.replace(/\/.+#/, '')) {
                            return info.toMsg(true);
                        } else {
                            return info.toMsg(false);
                        }
                    });
                    callback(dataArr);
                }
            });

            socket.on('disconnect', () => {

            });
        });
    }

    private addGameInfo(gameId: ID, socket: socketIO.Socket): void {
        if (this.db.gameMap.has(gameId)) {
            const num = this.db.gameMap.get(gameId).length + 1;
            this.db.gameMap.get(gameId).push(
                new GameInfo(gameId, socket, 'Player ' + num)
            );
        } else {
            this.db.gameMap.set(gameId, [
                new GameInfo(gameId, socket, 'Player 1')
            ]);
        }
    }
}
