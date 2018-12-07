import $ from 'jquery';
import io from 'socket.io-client';

import { RoomData } from '../../shared/types';

import selectHtml from '../html/select.html';
import selectCss from '../css/select.css';
import Page from '../page';
import Index from '../index';

export default class Select implements Page {
    private index: Index;
    private socket: SocketIOClient.Socket;
    private roomIdSet: Set<ID>;

    constructor(index: Index) {
        this.index = index;
        this.socket = io('/select');
        this.roomIdSet = new Set<ID>();
    }

    public init(): void {
        this.socket.on('updateInfo', (data: RoomData) => {
            this.updateInfo(data);
        });
        
        this.socket.on('deleteInfo', (data: RoomData) => {
            this.deleteInfo(data);
        });
        
        $(document).ready(() => {
            $('#createRoom').click(() => {
                $('#createRoomStatus').html('');
                const roomId = (<string>$('#roomIdInput').val())
                .replace(/\s/g, '_');

                this.socket.emit('createRoom', roomId, (data: RoomData) => {
                    if (data) {
                        this.joinRoom(data.roomId);
                    } else {
                        $('#createRoomStatus').html('room not created');
                    }
                });
            });
            
            $('#roomIdInput').val('');
            
            this.socket.emit('updateAllInfo', (data: Array<RoomData>) => {
                data.forEach((d: RoomData) => { this.updateInfo(d); });
            });
        });
    }

    public setStylesheet(): void {
        $('#pageStyle').html(selectCss.toString());
    }

    private appendRow(rowId: ID, data: RoomData): void {
        $('#roomListTable').append(
            `<tr id="${rowId}">
                <td id="${rowId}_roomID">${data.roomId}</td>
                <td id = "${rowId}_roomCapacity">${data.players}/${data.capacity}</td>
                <td id="${rowId}_joinBtn"><button type="button">Join</button></td>
                <td id="${rowId}_deleteBtn"><button type="button">Delete</button></td>
            </tr>`
        );

        $(`#${rowId}_joinBtn`).click(() => {
            this.joinRoom(data.roomId);
        });

        $(`#${rowId}_deleteBtn`).click(() => {
            this.deleteRoom(data.roomId);
        });
    }

    private joinRoom(roomId: ID): void {
        this.socket.emit('joinRoom', roomId, (data: RoomData) => {
            if (data && this.roomIdSet.has(data.roomId)) {
                this.index.room.setData(data);
                this.index.router.changePage(this.index.room);
            }
        });
    }

    private deleteRoom(roomId: ID): void {
        this.socket.emit('deleteRoom', roomId);
    }

    private deleteInfo(data: RoomData): void {
        const rowId: ID = data.roomId;
        if ($(`#${rowId}`).length) { // if the row exists in the DOM
            $(`#${rowId}`).remove();
        }
        if (this.roomIdSet.has(data.roomId)) {
            this.roomIdSet.delete(data.roomId);
        }
    }

    private updateInfo(data: RoomData): void {
        const rowId: ID = data.roomId;

        if (!$(`#${rowId}`).length) { // if the row exists in the DOM
            this.appendRow(rowId, data);
        }

        if (this.roomIdSet.has(data.roomId)) {
            $(`#${rowId}_roomID`).html(data.roomId);
            $(`#${rowId}_roomCapacity`).html(`${data.players}/${data.capacity}`);
        } else {
            this.roomIdSet.add(data.roomId);
        }
    }

    public HTML(): Html { return selectHtml; }
}
