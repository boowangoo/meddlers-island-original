import socketIO from 'socket.io';

import GameSockets from "../gameSockets";
import GameInfo from '../../game/gameInfo';
import GameSetup from '../../game/turns/gameSetup';
import { GameState } from '../../game/turns/gameStates';
import { GameTurn } from '../../game/turns/gameTurns';
import GameSM from '../../game/sm/gameSM';

export default class GameTurnsSockets {
    private game: GameSockets;
    private gameNsp: socketIO.Namespace;

    private setup: GameSetup;

    private sm: GameSM;

    private gameReadyIds: Set<ID>;

    constructor(game: GameSockets, nsp: socketIO.Namespace) {
        this.game = game;
        this.gameNsp = nsp;

        this.gameReadyIds = new Set<ID>();
        this.sm = new GameSM();

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

            socket.on('readyToPlay', (gameId: ID) => {
                this.gameReadyIds.add(gameId);
                const info: GameInfo[] = this.game.db.gameMap.get(gameId);

                if (this.gameReadyIds.size == info.length) {
                    this.gameNsp.in(gameId).emit('asdf', this.sm.getState);
                }
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
