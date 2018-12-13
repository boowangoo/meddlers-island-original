import GameDB from "./gameDB";

export default class GameSM {
    private db: GameDB;

    constructor(db: GameDB) {
        this.db = db;
    }

    public start(gameId: ID): void {
        this.db.gameMap.get(gameId);
    }
}