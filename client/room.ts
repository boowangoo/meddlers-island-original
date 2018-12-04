import $ from 'jquery';
import io from 'socket.io-client';

import Router from './router';
import { Html, RoomData, ID }  from '../types';
import Page from './page';
import Select from './select';

import roomHtml from './html/room.html';
import roomCss from './css/room.css';

export default class Room implements Page {
    private router: Router;
    private socket: SocketIOClient.Socket;

    private _roomId: ID;
    private _players: number;
    private _capacity: number;

    private selectPage: Select;

    constructor(roomId: ID, players: number, capacity: number, selectPage: Select, router: Router) {
        this._roomId = roomId;
        this._players = players;
        this._capacity = capacity;

        this.socket = io('/room');
        this.router = router;
        this.selectPage = selectPage;
    }

    public init(): void {
        this.socket.emit('joinRoom', this.roomId);

        $(document).ready(() => {
            $('#leaveRoom').click(() => {
                this.leaveRoom();
            });
            
            $('#wave').click(() => {
                this.socket.emit('wave', this.roomId);
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
            this.delete();
        });
        
        this.socket.on('updateWave', (playerID: ID) => {
            $('#waveMsgBox').html(playerID + ' waved!');
        });

        this.socket.emit('updateInfo', this.roomId);
    }

    public setStylesheet(): void {
        $('#pageStyle').html(roomCss.toString());
    }

    public leaveRoom(): void {
        this.socket.emit('leaveRoom', this.roomId);
        this.delete();
    }

    public delete(): void {
        this.router.changePage(this.selectPage);
    }

    public get roomId(): ID { return this._roomId; }
    public get players(): number { return this._players; }
    public get capacity(): number { return this._capacity; }

    public HTML(): Html { return roomHtml; }
}
