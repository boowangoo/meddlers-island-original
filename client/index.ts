import $ from 'jquery';

import Router from './router'; 
import Select from './select';

import globalCss from './css/global.css';
import Game from './game';

$('#globalStyle').html(globalCss.toString());

const router = new Router();
const select = new Select(router);
// router.changePage(select);
router.changePage(new Game());
