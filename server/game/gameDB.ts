import { GameTileData, BoardCoord } from '../../shared/types';
import GameInfo from './gameInfo';

export default class GameDB {
    public gameBoardMap: Map<ID, Array<GameTileData>>;
    public gameMap: Map<ID, Array<GameInfo>>;

    constructor() {
        this.gameBoardMap = new Map<ID, Array<GameTileData>>();
        this.gameMap = new Map<ID, Array<GameInfo>>();
    }
}
