import $ from 'jquery';
import SVG from 'svg.js';
import io from 'socket.io-client';

import Index from '../index';
import Page from "../page";

import gameHtml from '../html/game.html';
import gameCss from '../css/game.css';
import GameBoard from '../game/gameBoard';
import { BoardSize } from '../../shared/consts';

export default class Game implements Page {
    private index: Index;
    socket: SocketIOClient.Socket

    private gameBoard: GameBoard;
    private width: number;
    private height: number;

    private _gameId: ID;
    private _players: number;

    constructor(index: Index, width: number, height: number) {
        this.gameBoard = null;

        this.index = index;
        this.socket = io('/game');

        this.width = width;
        this.height = height;
    }

    public init(): void {
        this.socket.emit('joinGame', this.gameId);

        this.socket.on('startGameplay', () => {
            this.gameBoard = new GameBoard(
                this.gameId,
                this.socket,
                SVG('drawing').size(this.width, this.height),
                this.width, this.height,
                BoardSize.SMALL,
            );
        });

    }

    public setData(gameId: ID, players: number): void {
        this._gameId = gameId;
        this._players = players;
    }

    public setStylesheet(): void {
        $('#pageStyle').html(gameCss.toString());
    }

    public get gameId(): ID { return this._gameId; }
    public get players(): number { return this._players; }

    public HTML(): Html { return gameHtml; }
}