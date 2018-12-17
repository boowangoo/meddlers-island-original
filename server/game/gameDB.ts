import { GameTileData, BoardCoord, GamePortData } from '../../shared/types';
import GameInfo from './gameInfo';
import { GameState } from './turns/gameStates';

export default class GameDB {
    public gameTilesMap: Map<ID, GameTileData[]>;
    public gamePortsMap: Map<ID, GamePortData[]>;
    public gameMap: Map<ID, GameInfo[]>;

    public gameStatesMap: Map<ID, GameState>;
    public gameTurnsMap: Map<ID, GameInfo>;
    
    constructor() {
        this.gameTilesMap = new Map<ID, GameTileData[]>();
        this.gamePortsMap = new Map<ID, GamePortData[]>();
        this.gameMap = new Map<ID, GameInfo[]>();
        this.gameStatesMap = new Map<ID, GameState>();
        this.gameTurnsMap = new Map<ID, GameInfo>();
    }

    public getPlayerInfo(gameId: ID, playerId: ID): GameInfo {
        let playerInfo: GameInfo = null;
        if (!this.gameMap.has(gameId)) {
            return null;
        }
        this.gameMap.get(gameId).forEach((info: GameInfo) => {
            if (info.playerId === playerId) {
                playerInfo = info;
                return;
            }
        });
        return playerInfo;
    }
}
