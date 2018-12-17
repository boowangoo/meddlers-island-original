export default class GameTurns {
    private socket: SocketIOClient.Socket;
    private gameId: ID;

    constructor(gameId: ID, socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.gameId = gameId;

        this.socket.on('updateTurn', (turn: any) => {

        });

    }

    public ready(): void {
        this.socket.emit('ready', this.gameId);
    }
}