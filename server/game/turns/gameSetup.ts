import GameDB from "../gameDB";
import { PropertyType } from "../../../shared/consts";
import GameInfo from "../gameInfo";
import { GameState } from "./gameStates";

export default class GameSetup {
    public static runStep(gameId: ID, db: GameDB): GameInfo {
        if (db.gameStatesMap.get(gameId) !== GameState.SETUP) {
            return null;
        }

        const players: GameInfo[] = db.gameMap.get(gameId);
        if (!db.gameTurnsMap.has(gameId)) {
            db.gameTurnsMap.set(gameId, players[0]);
            return players[0];
        }
        let currPlayer: GameInfo = db.gameTurnsMap.get(gameId);

        let index = players.indexOf(currPlayer);

        const townCnt = currPlayer.properties.get(PropertyType.TOWN)
        const rdCnt = currPlayer.properties.get(PropertyType.TOWN)
        let asc: boolean = true;

        if (townCnt == 1 && rdCnt == 1 && !(index < players.length - 1)) {
            asc = false;
        } else if (townCnt == 2 && rdCnt == 2 && !(index > 0)) {
            db.gameStatesMap.set(gameId, GameState.MAIN);
            return currPlayer;
        }
        
        if ((townCnt == 1 && rdCnt == 1) || (townCnt == 2 && rdCnt == 2)) {
            currPlayer = this.changeTurn(asc, players, currPlayer);
            db.gameTurnsMap.set(gameId, currPlayer);
        }

        return currPlayer;
    }

    private static changeTurn(asc: boolean,
            players: GameInfo[], currPlayer: GameInfo): GameInfo {
        let index = players.indexOf(currPlayer);
        index += asc ? 1 : -1;
        return players[index];
    }
}
