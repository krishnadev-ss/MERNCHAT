const express = require("express");
const {chats} = require("./data/data");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./Routes/userRoutes");


const notFound = require("./middleware/errorMiddleware");
const errorHandler = require("./middleware/errorMiddleware");
const myMiddleware = (req, res, next) => {
    notFound();
    errorHandler();
    next();
  };


dotenv.config();
connectDB();

app.use(express.json()); //to accept json data
app.get("/", (req, res) => {
    res.send("Api is running successfully");
})

app.use('/api/user',userRoutes)

app.use(myMiddleware);


const PORT = process.env.PORT || 5000

app.listen(PORT,console.log(`server started on port ${PORT} `.yellow.bold));