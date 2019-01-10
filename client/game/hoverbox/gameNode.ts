import SVG from 'svg.js';

import { BoardCoord } from '../../../shared/types';
import { toPixelX, toPixelY } from '../gameUtils';

export default class GameNode {
    private circle: SVG.Circle;

    constructor(nested: SVG.Nested, coord: BoardCoord, width: number) {
        const attrOver = { fill: '#60f', 'fill-opacity': 0.5 };
        const attrOut = { fill: '#60f', 'fill-opacity': 0.2 };

        nested.circle(width / 4).center(
            toPixelX(coord.x, width),
            toPixelY(coord.y, width))
                .attr(attrOut)
                .mouseover(function () { this.attr(attrOver) })
                .mouseout(function () { this.attr(attrOut) });
    }

    public hide(hide: boolean) {
        this.circle.attr({ hide: hide});
    }
}