const express = require("express");
const {chats} = require("./data/data");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");



const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const myMiddleware = (req, res, next) => {
  notFound(req, res, next); // Pass req object
  errorHandler(new Error('Not Found'), req, res, next);
};


dotenv.config();
connectDB();

app.use(express.json()); //to accept json data
app.get("/", (req, res) => {
    res.send("Api is running successfully");
})

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)

app.use(myMiddleware);


const PORT = process.env.PORT || 5000

app.listen(PORT,console.log(`server started on port ${PORT} `.yellow.bold));