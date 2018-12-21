import socketIO from 'socket.io';

import GameSockets from "../gameSockets";
import GameInfo from '../../game/gameInfo';
import GameSetup from '../../game/turns/gameSetup';
import { GameState } from '../../game/turns/gameStates';
import { GameTurn } from '../../game/turns/gameTurns';

export default class GameTurnsSockets {
    private game: GameSockets;
    private gameNsp: socketIO.Namespace;

    private setup: GameSetup;

    constructor(game: GameSockets, nsp: socketIO.Namespace) {
        this.game = game;
        this.gameNsp = nsp;

        this.gameNsp.on('connection', (socket: socketIO.Socket) => {
            socket.on('initTurns', (gameId: ID) => {
                if (game.db.gameStatesMap.get(gameId) == GameState.SETUP) {
                    return;
                } else if (game.db.gameStatesMap.get(gameId) == GameState.NOT_READY) {
                    game.db.gameStatesMap.set(gameId, GameState.SETUP);
                }

                GameSetup.runStep(gameId, game.db);

                this.updateTurn(gameId);
            });
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
