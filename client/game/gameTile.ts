import SVG from 'svg.js';
import { GameTileData, PixelCoord } from '../../shared/types';

import { toPixelX, toPixelY, toPixels } from './gameUtils'

import desertSVG from '../res/patterns/desert.svg';
import fieldSVG from '../res/patterns/field.svg';
import forestSVG from '../res/patterns/forest.svg';
import hillSVG from '../res/patterns/hill.svg';
import mountainSVG from '../res/patterns/mountain.svg';
import pastureSVG from '../res/patterns/pasture.svg';
import seaSVG from '../res/patterns/sea.svg';
import { TileType } from '../../shared/consts';

export default class GameTile {
    private center: PixelCoord;
    private data: GameTileData;
    private tile: SVG.Polygon;

    constructor(draw: SVG.Container, data: GameTileData, width: number) {
        this.data = data;
        this.center = toPixels(data.coord, width);
        this.tile = this.renderTile(draw, width);

        this.setPattern(draw, data.type, width);
        if (data.tokenNum) {
            this.setTokenNum(draw, data.tokenNum, width);
        }

    }

    private renderTile(draw: SVG.Container, width: number): SVG.Polygon {
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

        let hex: SVG.Polygon = draw.polygon(path).fill('#f00');
        
        return hex;
    }

    private setPattern(
            draw: SVG.Container, type: TileType, width: number): void {

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

        let pattern: svgjs.Pattern = draw.pattern(width, width,
                (add: SVG.Pattern) => {
                    add.image(svg).size(width, width);
                });
        this.tile.fill(pattern);
    }

    private setTokenNum(draw: svgjs.Container, tokenNum: number, width: number): void {
        draw.circle(0.4 * width).center(this.center.x, this.center.y).fill('#fff');
        draw.text(tokenNum.toString()).center(this.center.x, this.center.y);
    }
}