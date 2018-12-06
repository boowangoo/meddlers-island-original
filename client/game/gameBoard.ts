import SVG from 'svg.js';
import { smallTokens } from '../../shared/consts';
import { BoardCoord } from '../../shared/types';
import GameTile from './gameTile';

export default class GameBoard {
    private canvas: SVG.Container;
    private tileMap: Map<BoardCoord, GameTile>;

    constructor(svgCanvas: SVG.Container) {
        this.canvas = svgCanvas;
        this.tileMap = new Map<BoardCoord, GameTile>();
    }
}
