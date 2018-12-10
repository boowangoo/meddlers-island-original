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
            socket.on('getTileData', (gameId: ID, size: BoardSize, callback: Function) => {
                let tileData: Array<GameTileData> = null;
                if (!game.db.gameBoardMap.has(gameId)) {
                    tileData = this.genTileData(gameId, size);
                    game.db.gameBoardMap.set(gameId, tileData);
                    this.gameNsp.in(gameId).emit('initBoard', tileData);
                }
            });

        });
    }

    // Fisher-Yates Shuffle
    private shuffle<T>(arr: Array<T>): Array<T>{
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    private tileTypeScramble(size: BoardSize): Array<TileType> {
        const typeArr: Array<TileType> = [];
        const tileCnt = boardTemplates[BoardSize[size]]['TILECNT'];

        Object.keys(tileCnt).forEach((k: string) => {
            for (let i = 0; i < tileCnt[k]; i++) {
                const key = k as keyof typeof TileType
                typeArr.push(TileType[key]);
            }
        });

        return this.shuffle(typeArr);
    }

    private genTileData(gameId: ID, size: BoardSize): Array<GameTileData> {
        const data: Array<GameTileData> = [];

        const boardTempl = boardTemplates[BoardSize[size]];
        const tokens = boardTemplates[BoardSize[size]]['TOKENNUMS'];
        const seaTiles = boardTempl['SEA'];
        const landTiles = boardTempl['LAND'];

        seaTiles.forEach((sea: BoardCoord) => {
            data.push({
                type: TileType.SEA,
                coord: sea,
                robbed: false
            });
        });

        let selectedType: TileType;
        const tileTypeScrambled: Array<TileType> = this.tileTypeScramble(size);
        let t: number = 0;

        landTiles.forEach((land: BoardCoord) => {
            selectedType = tileTypeScrambled.pop();

            const tempData: GameTileData = {
                type: selectedType,
                coord: land,
                robbed: selectedType === TileType.DESERT,
            };

            if (tempData.type !== TileType.DESERT) {
                tempData.tokenNum = tokens[t++];
            }
            
            data.push(tempData);
        });

        return data;
    }
}
