import { TileType } from "./consts";

export interface RoomData {
    roomId: ID;
    players: number;
    capacity: number;
}

export interface GameTileData {
    type: TileType;
    coord: BoardCoord;
    tokenNum: number;
    robbed: boolean;
}

class Coord {
    public y: number;
    public x: number;

    constructor(y: number, x: number) {
        this.y = y;
        this.x = x;
    }    
};    

export class BoardCoord extends Coord {
    constructor(y: number, x: number) {
        super(y, x);
    }    
};    

export class PixelCoord extends Coord {
    constructor(y: number, x: number) {
        super(y, x);
    }    
};    


