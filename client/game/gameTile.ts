import SVG from 'svg.js';

import { toPixelX, toPixelY, toPixels } from './gameUtils'
import { GameTileData, PixelCoord } from '../../shared/types';
import { TileType } from '../../shared/consts';

import desertSVG from '../res/patterns/desert.svg';
import fieldSVG from '../res/patterns/field.svg';
import forestSVG from '../res/patterns/forest.svg';
import hillSVG from '../res/patterns/hill.svg';
import mountainSVG from '../res/patterns/mountain.svg';
import pastureSVG from '../res/patterns/pasture.svg';
import seaSVG from '../res/patterns/sea.svg';

export default class GameTile {
    private center: PixelCoord;
    private data: GameTileData;
    private tile: SVG.Nested;

    constructor(board: SVG.Nested, data: GameTileData, width: number) {
        this.data = data;
        this.center = toPixels(data.coord, width);
        this.tile = board.nested();

        const hex = this.renderTile(width);
        
        if (data.tokenNum) {
            this.setTokenNum(data.tokenNum, width);
        }
    }

    private renderTile(width: number): SVG.Polygon {
        const cx: number = this.center.x;
        const cy: number = this.center.y;
        const unitX: number = toPixelX(1, width);
        const unitY: number = toPixelY(1, width)

        const path = [
            cx, cy + 2 * unitY,
            cx + unitX, cy + unitY,
            cx + unitX, cy - unitY,
            cx, cy - 2 * unitY,
            cx - unitX, cy - unitY,
            cx - unitX, cy + unitY
        ];

        let hex: SVG.Polygon = this.tile.polygon(path)
                .fill(this.setPattern(this.data.type, width));
        
        return hex;
    }

    private setPattern(type: TileType, width: number): SVG.Pattern {
        let svg: any = null;

        switch (type) {
            case TileType.DESERT:
                svg = desertSVG;
                break;
            case TileType.FIELD:
                svg = fieldSVG;
                break;
            case TileType.FOREST:
                svg = forestSVG;
                break;
            case TileType.HILL:
                svg = hillSVG;
                break;
            case TileType.MOUNTAIN:
                svg = mountainSVG;
                break;
            case TileType.PASTURE:
                svg = pastureSVG;
                break;
            case TileType.SEA:
                svg = seaSVG;
                break;
        }

        return this.tile.pattern(width, width, (add: SVG.Pattern) => {
            add.image(svg).size(width, width);
        });
    }

    private setTokenNum(tokenNum: number, width: number): void {
        this.tile.circle(0.4 * width).center(this.center.x, this.center.y).fill('#fff');
        this.tile.text(tokenNum.toString()).center(this.center.x, this.center.y);
    }
}
