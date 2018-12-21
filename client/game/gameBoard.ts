import SVG from 'svg.js';

import { BoardCoord, GameTileData, GamePortData } from '../../shared/types';
import { BoardSize } from '../../shared/consts';
import { toPixelX, toPixelY } from './gameUtils';
import GameTile from './gameTile';
import GamePort from './gamePort';

import HoverBoxes from './hoverbox.ts/hoverBoxes';

export default class GameBoard {
    socket: SocketIOClient.Socket

    private gameId: ID;
    private draw: SVG.Container;
    private board: SVG.Nested;
    private tileMap: Map<BoardCoord, GameTile>;
    private portMap: Map<BoardCoord, GamePort>;
    private hoverBoxes: HoverBoxes;
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
        this.portMap = new Map<BoardCoord, GamePort>();



        this.tileLoaded = false;
        this.portLoaded = false;

        const tileWidth = Math.max(width, height) / (size === BoardSize.SMALL ? 8 : 10);

        this.socket.on('initBoard',
                (tiles: GameTileData[], ports: GamePortData[]) => {
            if (!this.tileLoaded) {
                tiles.forEach((gtd: GameTileData) => {
                    const gt: GameTile = new GameTile(
                            this.board, gtd, tileWidth);
                    this.tileMap.set(gtd.coord, gt);
                });
                this.tileLoaded = true;
            }

            if (!this.portLoaded) {
                ports.forEach((gpd: GamePortData) => {
                    const gp = new GamePort(this.board, gpd, tileWidth);
                    this.portMap.set(gpd.a, gp);
                    this.portMap.set(gpd.b, gp);
                });
                this.portLoaded = true;
            }

            this.hoverBoxes = new HoverBoxes(this.board, size, tileWidth);
        });

        this.socket.emit('getBoardData', gameId, size);
    }
}
