import $ from 'jquery';

import Router from './router'; 
import Select from './pages/select';

import globalCss from './css/global.css';
import Game from './pages/game';
import Room from './pages/room';

export default class Index {
    public router: Router;

    public select: Select;
    public room: Room;
    public game: Game;

    constructor() {
        this.router = new Router();
        this.select = new Select(this);
        this.room = new Room(this);
        this.game = new Game(this);

        $('#globalStyle').html(globalCss.toString());
        this.router.changePage(this.select);
    }
}

new Index();
