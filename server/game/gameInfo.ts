import socketIO from 'socket.io'

import { ResourceType, PortType, DevCardType, PropertyType } from "../../shared/consts";
import { PlayerData, FullPlayerData } from '../../shared/types';

export default class GameInfo {
    private _gameId: ID;
    private _playerId: ID;
    private _alias: ID;
    
    private _vicPts: number;
    private _longRd: number;
    private _armySize: number;
    private _resources: Map<ResourceType, number>;
    private _properties: Map<PropertyType, number>;
    private _devCards: Map<DevCardType, number>;
    private _ports: Map<PortType, number>;

    constructor(gameId: ID, socket: socketIO.Socket, alias: ID) {
        this._gameId = gameId;
        this._playerId = socket.id.replace(/\/.+#/, '');
        this._alias = alias;

        this._vicPts = 0;
        this._longRd = 0;
        this._armySize = 0;

        this._resources = new Map<ResourceType, number>();
        this._properties = new Map<PropertyType, number>();
        this._devCards = new Map<DevCardType, number>();
        this._ports = new Map<PortType, number>();
    }

    public get gameId(): ID { return this._gameId; }
    public get playerId(): ID { return this._playerId; }
    public get alias(): ID { return this._alias; }
    public get vicPts(): number { return this._vicPts; }
    public get longRd(): number { return this._longRd; }
    public get armySize(): number { return this._armySize; }
    public get resources(): Map<ResourceType, number> { return this._resources; }
    public get properties(): Map<PropertyType, number> { return this._properties; }
    public get devCards(): Map<DevCardType, number> { return this._devCards; }
    public get ports(): Map<PortType, number> { return this._ports; }

    public toMsg(full: boolean): PlayerData | FullPlayerData {
        const msg: any = {
            gameId: this.gameId,
            alias: this.alias,

            vicPts: this.vicPts,
            longRd: this.longRd,
            armySize: this.armySize,
        };
        if (full) {
            msg.isFull = true;
            msg.resources = this.resources;
            msg.properties = this.properties;
            msg.devCards = this.devCards;
            msg.ports = this.ports;
            return <FullPlayerData>msg;
        }
        return <PlayerData>msg;
    }
}