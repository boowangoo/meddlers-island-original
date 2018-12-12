import SVG from 'svg.js';

import { GamePortData, PixelCoord } from "../../shared/types";
import { toPixels, toPixelYX } from "./gameUtils";
import { PortType } from '../../shared/consts';

import desertSVG from '../res/patterns/desert.svg';
import fieldSVG from '../res/patterns/field.svg';
import forestSVG from '../res/patterns/forest.svg';
import hillSVG from '../res/patterns/hill.svg';
import mountainSVG from '../res/patterns/mountain.svg';
import pastureSVG from '../res/patterns/pasture.svg';
import seaSVG from '../res/patterns/sea.svg';

export default class GamePort {
    private data: GamePortData
    private port: SVG.Nested;

    private pCentre: PixelCoord;
    private pIconCentre: PixelCoord;
    private rotation: number = 0;

    constructor(board: SVG.Nested, data: GamePortData, width: number) {
        this.data = data;
        this.port = board.nested();

        this.setCentres(width);

        console.log('DATA', data);
        console.log('--- pCentre', this.pCentre);
        console.log('--- pIconCentre', this.pIconCentre);
        console.log('--- rotation', this.rotation);

        this.port.polygon([
            0, 0,
            0, 0.5,
            1, 0.5,
            1, 0,
            0.8, 0,
            0.8, 0.3,
            0.2, 0.3,
            0.2, 0,
            1, 0
        ].map(n => n * width / 2))
            .center(this.pCentre.x, this.pCentre.y)
            .transform({ rotation: this.rotation })
            .fill('#863');

        this.port.circle(width / 3)
            .center(this.pIconCentre.x, this.pIconCentre.y)
            .fill(this.setTypePattern(data.type, width));
    }

    private setCentres(width: number): void {
        if (this.data.a.x === this.data.b.x &&
                this.data.a.y < this.data.b.y) {
            this.pCentre = toPixels(this.data.a, width)
                    .addCoord(toPixelYX(1, -0.25, width));
            this.pIconCentre = toPixels(this.data.a, width)
                    .addCoord(toPixelYX(1, -1, width));
            this.rotation = -90;
        } else if (this.data.a.x === this.data.b.x &&
                this.data.a.y > this.data.b.y) {
            this.pCentre = toPixels(this.data.a, width)
                    .addCoord(toPixelYX(-1, 0.25, width));
            this.pIconCentre = toPixels(this.data.a, width)
                    .addCoord(toPixelYX(-1, 1, width));
            this.rotation = 90;
        } else if (this.data.a.x < this.data.b.x &&
                this.data.a.y < this.data.b.y) {
            this.pCentre = toPixels(this.data.a, width)
                    .addCoord(toPixelYX(0.875, 0.375, width));
            this.pIconCentre = toPixels(this.data.a, width)
                    .addCoord(toPixelYX(2, 0, width));
            this.rotation = -150;
        } else if (this.data.a.x < this.data.b.x &&
                this.data.a.y > this.data.b.y) {
            this.pCentre = toPixels(this.data.a, width)
                    .addCoord(toPixelYX(-0.875, 0.375, width));
            this.pIconCentre = toPixels(this.data.a, width)
                    .addCoord(toPixelYX(-2, 0, width));
            this.rotation = -30;
        } else if (this.data.a.x > this.data.b.x &&
                this.data.a.y < this.data.b.y) {
            this.pCentre = toPixels(this.data.a, width)
                    .addCoord(toPixelYX(0.875, -0.375, width));
            this.pIconCentre = toPixels(this.data.a, width)
                    .addCoord(toPixelYX(2, 0, width));
            this.rotation = 150;
        } else if (this.data.a.x > this.data.b.x &&
                this.data.a.y > this.data.b.y) {
            this.pCentre = toPixels(this.data.a, width)
                    .addCoord(toPixelYX(-0.875, -0.375, width));
            this.pIconCentre = toPixels(this.data.a, width)
                    .addCoord(toPixelYX(-2, 0, width));
            this.rotation = 30;
        }
    }

    private setTypePattern(type: PortType, width: number): SVG.Pattern {
        let svg: any = null;

        switch (type) {
            case PortType.ANY:
                svg = desertSVG;
                break;
            case PortType.GRAIN:
                svg = fieldSVG;
                break;
            case PortType.LUMBER:
                svg = forestSVG;
                break;
            case PortType.BRICK:
                svg = hillSVG;
                break;
            case PortType.ORE:
                svg = mountainSVG;
                break;
            case PortType.WOOL:
                svg = pastureSVG;
                break;
        }

        return this.port.pattern(width / 3, width / 3, (add: SVG.Pattern) => {
            add.image(svg).size(width / 3, width / 3);
        });
    }
}
