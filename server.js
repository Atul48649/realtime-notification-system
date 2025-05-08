const express = require('express');
const http = require('node:http');
const { Server } = require('socket.io');
const db = require('./models/index');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(express.static('public')); // Serve index.html from public folder


const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('register', (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
        for (let [uid, sid] of onlineUsers) {
            if (sid === socket.id) {
                onlineUsers.delete(uid);
                break;
            }
        }
        console.log('Socket disconnected:', socket.id);
    })
});

app.post('/like', async (req, res) => {
    const { fromUserId, toUserId } = req.body;

    const fromUser = await db.User.findByPk(fromUserId);
    const toUser = await db.User.findByPk(toUserId);

    if (!fromUser || !toUser) {
        return res.status(404).json({
            message: 'User not found'
        })
    }

    const message = `${fromUser.username} liked your post`;

    const notification = await db.Notification.create({
        message,
        senderId: fromUserId,
        receiverId: toUserId
    })

    const socketId = onlineUsers.get(toUserId.toString());
    if (socketId) {
        io.to(socketId).emit('notification', { message })
    }

    return res.json({
        success: true,
        notification
    })
})


db.sequelize.sync({ force: false }).then(() => {
    server.listen(3000, () => console.log('Server on http://localhost:3000'));
});