import { RoomData, ID } from "../types";

export default class RoomInfo {
    private _roomId: ID;
    private _players: Array<ID>;
    private _capacity: number;

    constructor(roomId: ID, capacity?: number) {
        this._roomId = roomId;
        this._capacity = capacity && capacity > 0 ? capacity : 10;
        this._players = [];
    }

    public incrPlayers(playerID: ID): RoomInfo {
        if (this.players.length + 1 > this.capacity) {
            return null;
        }
        this.players.push(playerID);
        return this;
    }
    public decrPlayers(playerID: ID): RoomInfo {
        const index = this.players.indexOf(playerID);
        if (index > -1) {
            this.players.splice(index, 1);
            return this;
        }
        return null;
    }

    public get roomId(): ID { return this._roomId; }
    public get players(): Array<ID> { return this._players; }
    public get capacity(): number { return this._capacity; }

    public toMsg(): RoomData {
        return {
            roomId: this.roomId,
            players: this.players.length,
            capacity: this.capacity,
        };
    }
}