"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = {
// "room1" : [socket1, socket2]
};
wss.on('connection', function connection(socket) {
    socket.on("message", (message) => {
        var _a, _b, _c;
        let messageObj = JSON.parse(message.toString());
        if (messageObj.type === "join") {
            // A new user joins
            let roomId = (_a = messageObj.payload) === null || _a === void 0 ? void 0 : _a.roomId;
            let name = (_b = messageObj.payload) === null || _b === void 0 ? void 0 : _b.name;
            if (!roomId) {
                return;
            }
            if (!allSockets[roomId]) {
                allSockets[roomId] = [];
            }
            // Add the name to the socket
            socket.name = name;
            allSockets[roomId].push(socket);
            // Telling everyone that new user has joined
            allSockets[roomId].forEach((s) => {
                s.send(JSON.stringify({
                    type: "notification",
                    message: `${name} joined the room`
                }));
            });
        }
        else {
            let foundRoom = null;
            let message = (_c = messageObj.payload) === null || _c === void 0 ? void 0 : _c.message;
            for (let roomId in allSockets) {
                const sockets = allSockets[roomId];
                if (sockets.includes(socket)) {
                    foundRoom = roomId;
                    break;
                }
            }
            if (!foundRoom) {
                socket.send("You are not in any room!");
                return;
            }
            allSockets[foundRoom].forEach((s) => {
                s.send(JSON.stringify({
                    type: "message",
                    from: socket.name,
                    message: message
                }));
            });
        }
    });
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
        message: 'Server started!'
    }));
});
