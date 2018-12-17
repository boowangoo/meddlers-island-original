import SVG from 'svg.js';

import nodesAndPaths from '../res/nodesAndPaths.json';
import { BoardSize } from '../../../shared/consts';
import { toPixelX, toPixelY } from '../gameUtils';
import { BoardCoord } from '../../../shared/types';
import GameNode from './gameNode';
import GamePath from './gamePath';

export default class HoverBoxes {
    private nodes: SVG.Nested;
    private paths: SVG.Nested;

    private nodeMap: Map<BoardCoord, GameNode>;
    private pathMap: Map<BoardCoord[], GamePath>;

    constructor(board: SVG.Nested, size: BoardSize, width: number) {
        const nodeCoords = nodesAndPaths[BoardSize[size]]['NODES'];
        const pathCoords = nodesAndPaths[BoardSize[size]]['PATHS'];

        this.nodes = board.nested();
        this.paths = board.nested();

        nodeCoords.forEach((node: any) => {
            const coord = new BoardCoord(node.y, node.x);
            this.nodeMap.set(coord, new GameNode(this.nodes, coord, width));
        });

        pathCoords.forEach((path: any) => {
            const coordA = new BoardCoord(path.a.y, path.a.x);
            const coordB = new BoardCoord(path.b.y, path.b.x);
            this.pathMap.set([coordA, coordB],
                    new GamePath(this.paths, coordA, coordB, width));
        });

    }

    public getNode(coord: BoardCoord): GameNode {
        if (this.nodeMap.has(coord)) {
            return this.nodeMap.get(coord);
        }
        return null;
    }

    public getPath(coordA: BoardCoord, coordB: BoardCoord): GamePath {
        let path: GamePath = null;
        if (this.pathMap.has([coordA, coordB])) {
            path = this.pathMap.get([coordA, coordB]);
        } else if (this.pathMap.has([coordB, coordA])) {
            path = this.pathMap.get([coordB, coordA]);
        }
        return path;
    }
}