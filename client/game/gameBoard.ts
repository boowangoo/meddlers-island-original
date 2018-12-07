import SVG from 'svg.js';

import { BoardCoord, GameTileData } from '../../shared/types';
import GameTile from './gameTile';
import { BoardSize } from '../../shared/consts';

export default class GameBoard {
    socket: SocketIOClient.Socket

    private gameId: ID;
    private draw: SVG.Container;
    private tileMap: Map<BoardCoord, GameTile>;

    constructor(roomId: ID, socket: SocketIOClient.Socket, draw: SVG.Container,
                width: number, height: number, size: BoardSize) {
        this.socket = socket;
        this.gameId = this.gameId;
        this.draw = draw;
        this.tileMap = new Map<BoardCoord, GameTile>();

        const tileWidth = Math.max(width, height) /
                (size === BoardSize.SMALL ? 10 : 12);

        this.getTileData().then((data: Array<GameTileData>) => {
            data.forEach((data: GameTileData) => {
                this.tileMap.set(data.coord, new GameTile(draw, data, tileWidth));
            });
        });
        
    }

    private getTileData(): Promise<Array<GameTileData>> {
        return new Promise<Array<GameTileData>>((resolve, reject) => {
            this.socket.emit('getTileData', this.gameId,
                    (data: Array<GameTileData>) => {
                if (data && data.length > 0) {
                    resolve(data);
                } else { reject(); }
            });
        });
    }
}
