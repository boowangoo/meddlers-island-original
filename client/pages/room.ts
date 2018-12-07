import $ from 'jquery';
import io from 'socket.io-client';

import { RoomData }  from '../../shared/types';
import Index from '../index';
import Page from '../page';

import roomHtml from '../html/room.html';
import roomCss from '../css/room.css';

export default class Room implements Page {
    private index: Index;
    private socket: SocketIOClient.Socket;

    private _roomId: ID;
    private _players: number;
    private _capacity: number;

    constructor(index: Index) {
        this._roomId = null;
        this._players = null;
        this._capacity = null;

        this.index = index;
        this.socket = io('/room');
    }

    public setData(data: RoomData) {
        this._roomId = data.roomId;
        this._players = data.players;
        this._capacity = data.capacity;
    }

    public init(): void {
        this.socket.emit('joinRoom', this.roomId);

        $(document).ready(() => {
            $('#leaveRoom').click(() => {
                this.leaveRoom(this.index.select);
            });
            
            $('#startGame').click(() => {
                if (this.players < 3) {
                    $('#startGameMsgBox').html('cannot start game: need 3+ players');
                } else {
                    this.socket.emit('startGame', this.roomId);
                }
            });
        });

        this.socket.on('updateInfo', (data: RoomData) => {
            if (data) {
                this._players = data.players;
                this._capacity = data.capacity;
                $('#roomId').html(this.roomId);
                $('#roomCapacity').html(this.players + '/' + this.capacity);
            } else {
                // update failed
            }
        });

        this.socket.on('kicked', () => {
            this.index.router.changePage(this.index.select);
        });
        
        this.socket.on('startGame', () => {
            this.index.game.setData(this.roomId, this.players);
            this.leaveRoom(this.index.game);
        });

        this.socket.emit('updateInfo', this.roomId);
    }

    public setStylesheet(): void {
        $('#pageStyle').html(roomCss.toString());
    }

    public leaveRoom(page: Page): void {
        this.socket.emit('leaveRoom', this.roomId);
        this.index.router.changePage(page);
    }

    public get roomId(): ID { return this._roomId; }
    public get players(): number { return this._players; }
    public get capacity(): number { return this._capacity; }

    public HTML(): Html { return roomHtml; }
}
