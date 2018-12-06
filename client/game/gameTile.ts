import { GameTileData, PixelCoord } from "../../shared/types";

export default class GameTile {
    private data: GameTileData;
    private center: PixelCoord;

    constructor(data: GameTileData) {
        this.data = data;
    }

    private renderTile(width: number): svgjs.Element {
        const sq3 = Math.sqrt(3);
        const wScale = 0.5 * width / sq3;

        const path = [0, 2, sq3, 1, sq3, -1, 0, -2, -sq3, -1, -sq3, 1]
                .map(pt => wScale * pt);
        
        const cx = this.data.coord.x * width / 2;
        const cy = this.data.coord.y * (width / sq3 / 2);

        // const bob: svgjs.Polygon  = new Polygon();
        // const hex: svgjs.Element = polygon(path).center(cx, cy).fill('#f00');
        return null;
    }

    private setPattern() {}

    private setTokenNum() {}
}