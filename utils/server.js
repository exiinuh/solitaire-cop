const express = require("express");
const server = express();

server.all(
  "/", 
  (req, res) =>
  {
    res.send("Bot is running.");
  });

function KeepAlive()
{
  server.listen(
    process.env.PORT,
    ()=>
    {
      console.log("Server is ready.");
    }); 
}

module.exports = { KeepAlive };