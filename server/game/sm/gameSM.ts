import StateGroup from "./stateGroup";
import GameSetupStates from "./gameSetupStates";

export default class GameSM {
    private currStateGroup: StateGroup;

    private setupState: GameSetupStates
    
    constructor() {
        this.setupState = new GameSetupStates;

        this.currStateGroup = this.setupState;
    }

    public getState() {
        return this.currStateGroup.getState;
    }
}