import { ID } from "../types";
import RoomInfo from "./roomInfo";


export default class RoomDB {
    public roomMap: Map<ID, RoomInfo>;

    constructor() {
        this.roomMap = new Map<ID, RoomInfo>();
    }
}
