import socketIO from 'socket.io';

import GameSockets from "../gameSockets";
import { GameLogData } from '../../../shared/types';

export default class GameLogSockets {
    private game: GameSockets;
    private gameNsp: socketIO.Namespace;

    constructor(game: GameSockets, nsp: socketIO.Namespace) {
        this.game = game;
        this.gameNsp = nsp;

        this.gameNsp.on('connection', (socket: socketIO.Socket) => {
            socket.on('sendGameLog', (gameId: ID, msg: string) => {
                const playerID = socket.id.replace(/\/.+#/, '');
                const alias = game.db.getPlayerInfo(gameId, playerID).alias;
                this.sendGameLog(gameId, msg, alias);
            });
        });
    }

    public sendGameLog(gameId: ID, msg: string, playerID?: ID) {
        const data: GameLogData = { msg };
        if (playerID) {
            data.from = playerID;
        }
        this.gameNsp.in(gameId).emit('receiveGameLog', data);
    }
}