import socketIO from 'socket.io';

import GameSockets from "../gameSockets";
import { GameTileData, BoardCoord } from '../../../shared/types';
import { BoardSize, TileType } from '../../../shared/consts';

import boardTemplates from '../../res/boardTemplates.json';

export default class GameBoardSockets {
    private game: GameSockets;
    private gameNsp: socketIO.Namespace;

    constructor(game: GameSockets, nsp: socketIO.Namespace) {
        this.game = game;
        this.gameNsp = nsp;

        this.gameNsp.on('connection', (socket: socketIO.Socket) => {
            socket.on('getTileData', (gameId: ID, callback: Function) => {
                if (game.db.gameBoardMap.has(gameId)) {
                    callback(game.db.gameBoardMap.get(gameId));
                } else {
                    callback(this.genTileData(gameId, BoardSize.SMALL));
                }
            });

            socket.on('disconnect', () => {

            });
        });
    }

    private genTileData(gameId: ID, size: BoardSize): Array<GameTileData> {
        const data: Array<GameTileData> = [];

        const boardTempl = boardTemplates[BoardSize[size]];
        const tokens = boardTemplates[BoardSize[size]]['TOKENNUMS'];
        const tileCnt = boardTempl['TILECNT'];
        const seaTiles = boardTempl['SEA'];
        const landTiles = boardTempl['LAND'];

        seaTiles.forEach((sea: BoardCoord) => {
            data.push({
                type: TileType.SEA,
                coord: sea,
                robbed: false
            });
        });

        const keys = Object.keys(tileCnt);
        let selectedType: string;
        let t: number = 0;
        landTiles.forEach((land: BoardCoord) => {
            do {
                selectedType = keys[keys.length * Math.random() | 0];
            }
            while (tileCnt[selectedType] < 1);

            const stype = selectedType as keyof typeof TileType;
            const tempData: GameTileData = {
                type: TileType[stype],
                coord: land,
                robbed: selectedType === 'DESERT'
            };

            if (tempData.type !== TileType.DESERT) {
                tempData.tokenNum = tokens[t++];
            }
            
            data.push(tempData);

            tileCnt[selectedType]--;
        });

        return data;
    }
}
