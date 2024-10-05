const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*", // Allow any origin
        methods: ["GET", "POST"]
    }
});

app.use(cors());

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);

        // Notify other users in the room that the second user has joined
        socket.to(roomId).emit('ready');
    });

    socket.on('offer', (data) => {
        const { offer, roomId } = data;
        socket.to(roomId).emit('offer', { offer, roomId });
        console.log('Offer sent to room:', roomId);
    });

    socket.on('answer', (data) => {
        const { answer, roomId } = data;
        socket.to(roomId).emit('answer', { answer, roomId });
        console.log('Answer sent to room:', roomId);
    });

    socket.on('candidate', (data) => {
        const { candidate, roomId } = data;
        socket.to(roomId).emit('candidate', { candidate, roomId });
        console.log('ICE candidate sent to room:', roomId);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
