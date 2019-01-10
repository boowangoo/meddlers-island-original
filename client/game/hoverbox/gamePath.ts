import SVG from 'svg.js';

import { BoardCoord } from "../../../shared/types";
import { toPixelX, toPixelY } from '../gameUtils';

export default class GamePath {
    private path: SVG.Line;

    constructor(nested: SVG.Nested, coordA: BoardCoord, coordB: BoardCoord, width: number) {
        const attrOver = { stroke: '#f06', 'stroke-opacity': 0.5 };
        const attrOut = { stroke: '#f06', 'stroke-opacity': 0.2 };

        nested.line(
            toPixelX(coordA.x, width),
            toPixelY(coordA.y, width),
            toPixelX(coordB.x, width),
            toPixelY(coordB.y, width)
        ).stroke({ width: width / 8 })
            .attr(attrOut)
            .mouseover(function () { this.attr(attrOver) })
            .mouseout(function () { this.attr(attrOut) });
    }

    public hide(hide: boolean) {
        this.path.attr({ hide: hide });
    }
}