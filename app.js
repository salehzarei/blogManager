const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config()
const app = express();
app.use(cors())
app.use(express.json())
const dbConfig = require("./config/dbConfig")

const { Socket } = require('socket.io');

// enable files upload
app.use(fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.use('/api', require('./routes/router'));
dbConfig()

const PORT = process.env.PORT || 5000;


// console.log(process.env.MONGO_URL)
const server = app.listen(PORT, () =>
{
    console.log("Sever Start in", PORT)
})

// const io = require('socket.io')(server);
// io.on('connection', (socket) =>
// {
//     console.log("Connected Successfully", socket.id)
// })