import SVG from 'svg.js';
import { GameTileData, PixelCoord } from '../../shared/types';

import { toPixelX, toPixelY } from './gameUtils'

import desertSVG from '../res/patterns/desert.svg';
import fieldSVG from '../res/patterns/field.svg';
import forestSVG from '../res/patterns/forest.svg';
import hillSVG from '../res/patterns/hill.svg';
import mountainSVG from '../res/patterns/mountain.svg';
import pastureSVG from '../res/patterns/pasture.svg';
import seaSVG from '../res/patterns/sea.svg';
import { TileType } from '../../shared/consts';
import { deflateRaw } from 'zlib';

export default class GameTile {
    private center: PixelCoord;
    private data: GameTileData;
    private tile: SVG.Polygon;

    constructor(draw: SVG.Container, data: GameTileData, width: number) {
        this.data = data;
        this.center
        this.tile = this.renderTile(draw, width);
        this.setPattern(draw, data.type);
        this.setTokenNum(draw, data.tokenNum);
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
            draw: SVG.Container, type: TileType, tileSize?: number): void {
        const tSize: number = tileSize ? tileSize : 50;

        let svg: any = null;

        switch (type) {
            case TileType.DESERT:
                svg = desertSVG;
            case TileType.FIELD:
                svg = fieldSVG;
            case TileType.FOREST:
                svg = forestSVG;
            case TileType.HILL:
                svg = hillSVG;
            case TileType.MOUNTAIN:
                svg = mountainSVG;
            case TileType.PASTURE:
                svg = pastureSVG;
            case TileType.SEA:
                svg = seaSVG;
        }

        let pattern: svgjs.Pattern = draw.pattern(tSize, tSize,
                (add: SVG.Pattern) => {
                    add.image(svg).size(tSize, tSize);
                });
        this.tile.fill(pattern);
    }

    private setTokenNum(draw: svgjs.Container, tokenNum: Number): void {
        draw.circle(30).center(this.center.x, this.center.y).fill('#fff');
        draw.text(tokenNum.toString()).center(this.center.x, this.center.y);
    }
}