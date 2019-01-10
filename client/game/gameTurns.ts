import { id } from "./gameUtils";

export default class GameTurns {
    private socket: SocketIOClient.Socket;
    private gameId: ID;

    constructor(gameId: ID, socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.gameId = gameId;

        this.socket.on('updateTurn', (turn: any) => {
            console.log('id', id(socket.id));
            console.log('turnlol', turn);
        });

    }

    public ready(): void {
        // this.socket.emit('initTurns', this.gameId);
        this.socket.emit('readyToPlay', this.gameId);
    }
}