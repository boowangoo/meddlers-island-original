import { GameState } from "./gameStates";
import GameInfo from "../gameInfo";

export interface GameTurn {
    state: GameState;
    turn: GameInfo;
    desc?: string;
}