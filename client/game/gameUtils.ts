import { PixelCoord, BoardCoord } from "../../shared/types";

export function toPixelX(boardX: number,  width: number): number {
    return (boardX) * width / 2;
}      

export function toPixelY(boardY: number,  width: number): number {
    return (boardY) * width / 2 / Math.sqrt(3);
}      

export function toPixels(boardCoord: BoardCoord, width: number): PixelCoord {
    return new PixelCoord(
        this.toPixelY(boardCoord.y, width),
        this.toPixelX(boardCoord.x, width)
    );
}

export function toPixelYX(y: number, x: number, width: number): PixelCoord {
    return this.toPixels(new BoardCoord(y, x), width);
}