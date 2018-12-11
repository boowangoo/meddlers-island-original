import $ from 'jquery';

import gameLogHtml from '../html/game/gameInfo.html';

export default class GameInfo {
    private socket: SocketIOClient.Socket;
    private gameId: ID;

    constructor(gameId: ID, socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.gameId = gameId;

        $('#gameInfo').html(gameLogHtml);
        
        this.setUpAccordion();
    }

    private setUpAccordion(): void {
        const allPanels = $('.gameInfoAccordion > div').hide();

        $(document).ready(() => {
            $('.gameInfoAccordion > h3').click(function() {
                console.log('ni hao da jia');
                $(this).next().slideToggle();
            });
        });
    
        // $('.accordion > h3').click(function() {
        //     console.log('ni hao da jia')
        //     allPanels.slideUp();
        //     $(this).parent().next().slideDown();
        //     return false;
        // });
    }
}