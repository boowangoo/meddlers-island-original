import Router from './router'; 
import Select from './select';

const router = new Router();
const select = new Select(router);
router.changePage(select);
