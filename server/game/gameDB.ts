import { GameTileData, BoardCoord } from '../../shared/types';

export default class GameDB {
    public gameBoardMap: Map<ID, Array<GameTileData>>;

    constructor() {
        this.gameBoardMap = new Map<ID, Array<GameTileData>>();
    }
}
