import socketIO from 'socket.io';

import GameSockets from "../gameSockets";
import GameInfo from '../../game/gameInfo';
import { GameState } from '../../game/turns/gameStates';
import GameSetup from '../../game/turns/gameSetup';
import { GameTurn } from '../../game/turns/gameTurns';

export default class GameTurnsSockets {
    private game: GameSockets;
    private gameNsp: socketIO.Namespace;

    private setup: GameSetup;

    constructor(game: GameSockets, nsp: socketIO.Namespace) {
        this.game = game;
        this.gameNsp = nsp;

        this.gameNsp.on('connection', (socket: socketIO.Socket) => {
            socket.on('ready', (gameId: ID) => {
                const playerID = socket.id.replace(/\/.+#/, '');
                const info: GameInfo = game.db.getPlayerInfo(gameId, playerID);
                info.setState(GameState.SETUP);

                let start: boolean = true;
                game.db.gameMap.get(gameId).forEach((info: GameInfo) => {
                    if (info.state !== GameState.SETUP) {
                        start = false;
                        return;
                    }
                });

                if (start) {
                    game.db.gameStatesMap.set(gameId, GameState.SETUP);
                }
                this.updateTurn(gameId);
            });
            
            socket.on('updateTurn', (gameId: ID) => {
                this.updateTurn(gameId);
            })
        });
    }

    private updateTurn(gameId: ID): void {
        GameSetup.runStep(gameId, this.game.db);
        const turn: GameTurn = {
            state: this.game.db.gameStatesMap.get(gameId),
            turn: this.game.db.gameTurnsMap.get(gameId),
        }
        this.gameNsp.in(gameId).emit('updateTurn', turn);
    }
}
