import $ from 'jquery';

import gameLogHtml from '../html/game/gameInfo.html';

export default class GameInfo {
    private socket: SocketIOClient.Socket;
    private gameId: ID;

    constructor(gameId: ID, socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.gameId = gameId;

        $('#gameInfo').html(gameLogHtml);
    }
}