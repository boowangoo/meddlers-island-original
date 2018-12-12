import { GameTileData, BoardCoord, GamePortData } from '../../shared/types';
import GameInfo from './gameInfo';

export default class GameDB {
    public gameTilesMap: Map<ID, Array<GameTileData>>;
    public gamePortsMap: Map<ID, Array<GamePortData>>;
    public gameMap: Map<ID, Array<GameInfo>>;
    
    constructor() {
        this.gameTilesMap = new Map<ID, Array<GameTileData>>();
        this.gamePortsMap = new Map<ID, Array<GamePortData>>();
        this.gameMap = new Map<ID, Array<GameInfo>>();
    }
}
