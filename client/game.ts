import $ from 'jquery';

import Page from "./page";
import { Html } from "../types";

import gameHtml from './html/game.html';
import gameCss from './css/game.css';

export default class Game implements Page {
    constructor() {
    }

    public init(): void {
    }

    public setStylesheet(): void {
        $('#pageStyle').html(gameCss.toString());
    }

    public HTML(): Html { return gameHtml; }
}