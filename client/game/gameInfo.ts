import $ from 'jquery';

import gameLogHtml from '../html/game/gameInfo.html';
import { PlayerData, FullPlayerData } from '../../shared/types';

export default class GameInfo {
    private socket: SocketIOClient.Socket;
    private gameId: ID;

    constructor(gameId: ID, socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.gameId = gameId;

        $('#gameInfo').html(gameLogHtml);
    }

    public updateAllPlayerInfo(): void {
        this.socket.emit('updateAllPlayerInfo', this.gameId,
                (data: Array<PlayerData>) => {
            console.log(data);
            data.forEach((pd: PlayerData | FullPlayerData) => {
                const id: string = pd.alias.replace(/\s/g, '');
                if (!$(`#${id}_info`).length) {
                    this.createPlayerInfo(pd);
                }
            });
            this.setUpAccordion();
        });
    }

    private setUpAccordion(): void {
        $('.gameInfoAccordion > div').hide();

        $(document).ready(() => {
            $('.gameInfoAccordion > h3').click(function () {
                $(this).next().slideToggle();
            });
        });
    }

    private updatePlayerInfo(data: PlayerData | FullPlayerData): void {
        let id: string;
        if ((<FullPlayerData>data).isFull) {
            id = 'you';
        } else { id = data.alias.replace(/\s/g, ''); }

        $(`#${id}_vicPts`).html(data.vicPts.toString());
        $(`#${id}_longRd`).html(data.longRd.toString());
        $(`#${id}_armySize`).html(data.armySize.toString());
    }

    private createPlayerInfo(data: PlayerData | FullPlayerData): void {
        let alias = data.alias;
        let id: string = data.alias.replace(/\s/g, '');
        let fullDataTempl: Html = '';

        if ((<FullPlayerData>data).isFull) {
            alias = 'You';

            const resourcesList: Html = `<ul>
                <li>Grain: <span id="${id}_res_grain">0</span></li>
                <li>Lumber: <span id="${id}_res_lumber">0</span></li>
                <li>Wool: <span id="${id}_res_wool">0</span></li>
                <li>Ore: <span id="${id}_res_ore">0</span></li>
                <li>Brick: <span id="${id}_res_brick">0</span></li>
            </ul>`;
            const propertiesList: Html = `<ul>
                <li>Towns: <span id="${id}_prop_towns">0</span></li>
                <li>Cities: <span id="${id}_prop_cities">0</span></li>
                <li>Roads: <span id="${id}_prop_roads">0</span></li>
            </ul>`;
            const devCards: Html = `<ul>
                <li>Knight: <span id="${id}_devC_knight">0</span></li>
                <li>Victory Point: <span id="${id}_devC_vp">0</span></li>
                <li>Road Building: <span id="${id}_devC_rdBuild">0</span></li>
                <li>Monopoly: <span id="${id}_devC_mono">0</span></li>
                <li>Year Of Plenty: <span id="${id}_devC_YOP">0</span></li>
            </ul>`;
            const ports: Html = `<ul></ul>`;

            fullDataTempl = `<div class="gameInfoAccordion">
                <h3>Resources</h3>
                <div id="you_resources">${resourcesList}</div>
            </div>
            <div class="gameInfoAccordion">
                <h3>Properties</h3>
                <div id="you_properties">${propertiesList}</div>
            </div>
            <div class="gameInfoAccordion">
                <h3>Development Cards</h3>
                <div id="you_devCards">${devCards}</div>
            </div>
            <div class="gameInfoAccordion">
                <h3>Ports</h3>
                <div id="you_ports">${ports}</div>
            </div>`;
        }

        const gameInfoTempl: Html = `<h3>${alias}</h3>
        <div id="${id}_info">
            <ul>
                <li>Victory Points: <span id="${id}_vicPts">0</span></li>
                <li>Longest Road: <span id="${id}_longRd">0</span></li>
                <li>Army Size: <span id="${id}_armySize">0</span></li>
            </ul>
            ${fullDataTempl}
        </div>`;
        
        $('#gameInfoDiv').append(gameInfoTempl);
    }
}
