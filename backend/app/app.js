require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const users = require('./db/models/users');
const { Server } = require("socket.io");
const db = require("./db/config");
const cors = require("cors");
const http = require('http');
const app = express();

//invoking web-socket communication
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

//database change listener
const dbEventEmitter = users.watch()

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json());
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));

//Invoking mongodb connection
db.connect();

//listening to changes in database
io.on('connection', (socket) => {
    dbEventEmitter.on('change', (()=>{
        socket.emit('updated', "database have been updated");
    }))

});

//Invoking server port connection
server.listen(process.env.NODE_PORT, () => {
    console.log(`Listening on port ${process.env.NODE_PORT}`);
});

//authentication routes
app.use(authRoutes);

//user routes
app.use(userRoutes);

//404 implementation
app.use(function (req, res) {
    let response = {
        "success": false,
        "status": 404,
        "message": "API not found",
        "data": null
    }
    res.status(404).send(response);
});