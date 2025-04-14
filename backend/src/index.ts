import { WebSocket, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface ExtendedWebSocket extends WebSocket {
    name? : string;
}

interface AllSockets {
    [roomId: string]: ExtendedWebSocket[];
  }

let allSockets : AllSockets = {
    // "room1" : [socket1, socket2]
};

wss.on('connection', function connection(socket : ExtendedWebSocket) {

    socket.on("message", (message)=>{
        let messageObj = JSON.parse(message.toString());
        if(messageObj.type === "join"){
            // A new user joins
            let roomId = messageObj.payload?.roomId;
            let name = messageObj.payload?.name;

            if (!roomId){
                return ;
            }
            if (!allSockets[roomId]) {
                allSockets[roomId] = [];
            }

            // Add the name to the socket
            socket.name = name;

            allSockets[roomId].push(socket);

            // Telling everyone that new user has joined
            allSockets[roomId].forEach((s)=>{
                s.send(JSON.stringify({
                    type : "notification",
                    message : `${name} joined the room`
                }));
            })
        }else{
            let foundRoom: string | null  = null;
            let message = messageObj.payload?.message;

            for(let roomId in allSockets){
                const sockets = allSockets[roomId];
                if(sockets.includes(socket)){
                    foundRoom = roomId;
                    break;
                }
            }

            if (!foundRoom) {
                socket.send("You are not in any room!");
                return;
            }

            allSockets[foundRoom].forEach((s)=>{
                s.send(
                    JSON.stringify({
                        type : "message",
                        from : socket.name,
                        message : message
                    })
                );
            })
        }
    })


    socket.on('close', () => {
        for (const room in allSockets) {
            if (allSockets[room].includes(socket)) {
                const name = socket.name;
                allSockets[room] = allSockets[room].filter(s => s !== socket);
                allSockets[room].forEach(s => {
                    s.send(JSON.stringify({
                        type: "notification",
                        message: `${name} left the room`
                    }));
                });
                if (allSockets[room].length === 0) {
                    delete allSockets[room];
                }
            }
        }
    });

    socket.send(JSON.stringify({
        message : 'Server started!'
    }));
});
