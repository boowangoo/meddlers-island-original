import StateGroup from "./stateGroup";

export default class GameSetupStates implements StateGroup {
    constructor() {

    }

    public getState(): ID {
        throw new Error("Method not implemented.");
    }
}