import $ from 'jquery';

import gameLogHtml from '../html/game/gameLog.html';
import { GameLogData } from '../../shared/types';

export default class GameLog {
    private socket: SocketIOClient.Socket;
    private gameId: ID;

    constructor(gameId: ID, socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.gameId = gameId;

        $('#gameLog').html(gameLogHtml);
        this.scrollToBottom();
        
        this.socket.on('receiveGameLog', (data: GameLogData) => {
            const from: string = data.from || 'SERVER';

            $('#gameLogMsgs ul').append(
                $('<li>').text(`${from}: ${data.msg}`)
            );
            this.scrollToBottom();
        })

        $(document).ready(() => {
            $('#gameLogForm').submit((e) => {
                e.preventDefault(); // stops page from reloading
    
                this.socket.emit('sendGameLog',
                        this.gameId, $('#gameLogInput').val());
                $('#gameLogInput').val('');
            });
        });
    }

    private scrollToBottom(): void {
        $('#gameLogMsgs').scrollTop($('#gameLogMsgs').prop("scrollHeight"));
    }
}
