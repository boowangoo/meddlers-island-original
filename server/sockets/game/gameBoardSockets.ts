import socketIO from 'socket.io';

import GameSockets from "../gameSockets";
import { GameTileData, BoardCoord, GamePortData } from '../../../shared/types';
import { BoardSize, TileType, PortType } from '../../../shared/consts';

import boardTemplates from '../../res/boardTemplates.json';

export default class GameBoardSockets {
    private game: GameSockets;
    private gameNsp: socketIO.Namespace;

    constructor(game: GameSockets, nsp: socketIO.Namespace) {
        this.game = game;
        this.gameNsp = nsp;

        this.gameNsp.on('connection', (socket: socketIO.Socket) => {
            socket.on('getBoardData', (gameId: ID, size: BoardSize) => {
                let tilesGenerated: boolean = false;
                let portsGenerated: boolean = false;
                
                let tileData: GameTileData[] = null;
                let portData: GamePortData[] = null;

                if (!game.db.gameTilesMap.has(gameId)) {
                    tileData = this.genTileData(size);
                    game.db.gameTilesMap.set(gameId, tileData);
                    this.gameNsp.in(gameId).emit('initTiles', tileData);
                    tilesGenerated = true;
                }
                
                if (!game.db.gamePortsMap.has(gameId)) {
                    portData = this.genPortData(size);
                    game.db.gamePortsMap.set(gameId, portData);
                    portsGenerated = true;
                }

                if (tilesGenerated && portsGenerated) {
                    this.gameNsp.in(gameId).emit('initBoard', tileData, portData);
                }
            });
        });
    }

    // Fisher-Yates Shuffle
    private shuffle<T>(arr: T[]): T[]{
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    private genPortData(size: BoardSize): GamePortData[] {
        let ports: GamePortData[] =
        this.shuffle(boardTemplates[BoardSize[size]]['PORT']);

        const types: PortType[] = [PortType.BRICK, PortType.GRAIN,
                PortType.LUMBER, PortType.ORE, PortType.WOOL];
        if (size === BoardSize.LARGE) { types.push(PortType.WOOL); }

        return ports.map((port: any) => {
            const gpd: GamePortData = {
                type: types.pop() || PortType.ANY,
                a: new BoardCoord(port.a.y, port.a.x),
                b: new BoardCoord(port.b.y, port.b.x),
            };
            return gpd;
        });
    }

    private tileTypeScramble(size: BoardSize): TileType[] {
        const typeArr: TileType[] = [];
        const tileCnt = boardTemplates[BoardSize[size]]['TILECNT'];

        Object.keys(tileCnt).forEach((k: string) => {
            for (let i = 0; i < tileCnt[k]; i++) {
                const key = k as keyof typeof TileType
                typeArr.push(TileType[key]);
            }
        });

        return this.shuffle(typeArr);
    }

    private genTileData(size: BoardSize): GameTileData[] {
        const data: GameTileData[] = [];

        const boardTempl = boardTemplates[BoardSize[size]];
        const tokens = boardTempl['TOKENNUMS'];
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
        const tileTypeScrambled: TileType[] = this.tileTypeScramble(size);
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
