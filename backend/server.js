const express = require("express");
const {chats} = require("./data/data");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
app.get("/", (req, res) => {
    res.send("Api is running successfully");
})

app.get('/api/chat', (req, res) => {
    res.send(chats);

})

app.get('/api/chat/:id', (req, res) => {
    // console.log(req.params.id);
    const singlechat = chats.find((c)=>c._id === req.params.id);
    res.send(singlechat);
})

const PORT = process.env.PORT || 5000

app.listen(PORT,console.log(`server started on port ${PORT}`));