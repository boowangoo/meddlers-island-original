import $ from 'jquery';
import SVG from 'svg.js';
import io from 'socket.io-client';

import Index from '../index';
import Page from "../page";

import gameHtml from '../html/game.html';
import gameCss from '../css/game.css';
import GameBoard from '../game/gameBoard';
import { BoardSize } from '../../shared/consts';
import GameLog from '../game/gameLog';
import GameInfo from '../game/gameInfo';
import GameTurns from '../game/gameTurns';

export default class Game implements Page {
    private index: Index;
    socket: SocketIOClient.Socket

    private gameBoard: GameBoard;
    private width: number;
    private height: number;
    private gameLog: GameLog;
    private gameInfo: GameInfo;
    private gameTurns: GameTurns;

    private _gameId: ID;
    private _players: number;

    constructor(index: Index, width: number, height: number) {
        this.gameBoard = null;
        
        this.index = index;
        this.socket = io('/game');
        
        this.width = width;
        this.height = height;
    }

    public setData(gameId: ID, players: number): void {
        this._gameId = gameId;
        this._players = players;
    }
    
    public init(): void {
        this.gameLog = new GameLog(this.gameId, this.socket);
        this.gameInfo = new GameInfo(this.gameId, this.socket);
        this.gameTurns = new GameTurns(this.gameId, this.socket);


        this.socket.emit('joinGame', this.gameId, this.players);

        this.socket.on('startGameplay', (size: BoardSize) => {
            if (this.gameBoard) { return; }
            this.gameBoard = new GameBoard(
                this.gameId,
                this.socket,
                SVG('drawing').size(this.width, this.height),
                this.width, this.height, size,
            );
            this.gameInfo.updateAllPlayerInfo();

            this.gameTurns.ready();
        });
    }

    public setStylesheet(): void {
        $('#pageStyle').html(gameCss.toString());
    }

    public get gameId(): ID { return this._gameId; }
    public get players(): number { return this._players; }

    public HTML(): Html { return gameHtml; }
}