import SVG from 'svg.js';
import http from 'http';

import { BoardCoord, GameTileData, GamePortData } from '../../shared/types';
import GameTile from './gameTile';
import { BoardSize } from '../../shared/consts';
import GamePort from './gamePort';
import { toPixelX, toPixelY } from './gameUtils';

export default class GameBoard {
    socket: SocketIOClient.Socket

    private gameId: ID;
    private draw: SVG.Container;
    private board: SVG.Nested;
    private tileMap: Map<BoardCoord, GameTile>;
    private portMap: Map<BoardCoord, Array<GamePort>>;
    private size: BoardSize;

    private tileLoaded: boolean;
    private portLoaded: boolean;

    constructor(gameId: ID, socket: SocketIOClient.Socket, draw: SVG.Container,
                width: number, height: number, size: BoardSize) {
        this.socket = socket;
        this.draw = draw;
        this.board = this.draw.nested();
        this.gameId = gameId;
        this.size = size;
        this.tileMap = new Map<BoardCoord, GameTile>();
        this.portMap = new Map<BoardCoord, Array<GamePort>>();

        this.tileLoaded = false;
        this.portLoaded = false;

        const tileWidth = Math.max(width, height) / (size === BoardSize.SMALL ? 8 : 10);

        this.socket.on('initBoard',
                (tiles: Array<GameTileData>, ports: Array<GamePortData>) => {
            if (!this.tileLoaded) {
                tiles.forEach((gtd: GameTileData) => {
                    const gt: GameTile = new GameTile(
                            this.board, gtd, tileWidth);
                    
                    if (!this.tileMap.has(gtd.coord)) {
                        this.tileMap.set(gtd.coord, gt);
                    }
                });
                this.tileLoaded = true;
            }

            if (!this.portLoaded) {
                ports.forEach((gpd: GamePortData) => {
                    const gp = new GamePort(this.board, gpd, tileWidth);
                    [gpd.a, gpd.b].forEach((coord: BoardCoord) => {
                        if (!this.portMap.has(coord)) {
                            this.portMap.set(coord, []);
                        }
                        this.portMap.get(coord).push(gp);
                    });
                });
                this.portLoaded = true;
            }

            // this.board.dmove(100, 100);
            for (let i = 0; i < 15; i++) {
                for (let j = 0; j < 25; j++) {
                    this.board.circle(tileWidth / 12).center(
                        toPixelX(i, tileWidth),
                        toPixelY(j, tileWidth),
                    );
                }
            }
        });

        this.socket.emit('getBoardData', gameId, size);
    }
}
