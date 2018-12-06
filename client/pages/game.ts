import $ from 'jquery';
import SVG from 'svg.js';

import Index from '../index';
import Page from "../page";

import gameHtml from '../html/game.html';
import gameCss from '../css/game.css';
import GameBoard from '../game/gameBoard';

export default class Game implements Page {
    private gameBoard: GameBoard;

    constructor(index: Index) {
        this.gameBoard = null;
    }

    public init(): void {
        this.gameBoard = new GameBoard(SVG('drawing').size(800, 800));
    }

    public setStylesheet(): void {
        $('#pageStyle').html(gameCss.toString());
    }

    public HTML(): Html { return gameHtml; }
}