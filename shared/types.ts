import { TileType, ResourceType, DevCardType, PortType, PropertyType } from "./consts";

export interface GameLogData {
    from?: string;
    msg: string;
}

export interface RoomData {
    roomId: ID;
    players: number;
    capacity: number;
}

export interface GameTileData {
    type: TileType;
    coord: BoardCoord;
    tokenNum?: number;
    robbed: boolean;
}

export interface PlayerData {
    gameId: ID;
    alias: ID;

    vicPts: number;
    longRd: number;
    armySize: number;
}

export interface FullPlayerData extends PlayerData{
    isFull: true;
    resources: Map<ResourceType, number>;
    properties: Map<PropertyType, number>;
    devCards: Map<DevCardType, number>;
    ports: Map<PortType, number>;
}

class Coord {
    public y: number;
    public x: number;

    constructor(y: number, x: number) {
        this.y = y;
        this.x = x;
    }

    protected add(y: number, x: number): Coord {
        return new PixelCoord(this.y + y, this.x + x);
    }

    protected addCoord(coord: Coord): Coord {
        return this.add(coord.y, coord.x);
    }
};

export class PixelCoord extends Coord{
    constructor(y: number, x: number) {
        super(y, x);
    }
    public add(y: number, x: number): PixelCoord {
        return <PixelCoord>super.add(y, x);
    }
    public addCoord(coord: PixelCoord): PixelCoord {
        return <PixelCoord>super.addCoord(coord);
    }
};

export class BoardCoord extends Coord{
    constructor(y: number, x: number) {
        super(y, x);
    }
    public add(y: number, x: number): BoardCoord {
        return <BoardCoord>super.add(y, x);
    }
    public addCoord(coord: BoardCoord): BoardCoord {
        return <BoardCoord>super.addCoord(coord);
    }
};
