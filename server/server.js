const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const axios = require('axios');
const cors = require('cors');
require("dotenv").config();

const app = express();
let port = process.env.PORT || 3000;
const server = http.createServer(app);

const ethApiKey = process.env.ETHERSCAN_APIKEY;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.get('/minecraftspeedrun/eth', async (req, res) => {

  try {
    const response = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&address=${req.query.address}&sort=desc&apikey=${ethApiKey}`)
    res.send(response.data)
  }
  catch (e) {
    console.log(e)
  }


  // const data = JSON.stringify({
  //   "jsonrpc": "2.0",
  //   "method": "alchemy_getTokenBalances",
  //   "headers": {
  //     "Content-Type": "application/json"
  //   },
  //   "params": [
  //     `${req.query.address}`,
  //     "DEFAULT_TOKENS"
  //   ],
  //   "id": 42
  // });
  
  // const config = {
  //   method: "post",
  //   url: process.env.ALCHEMY_ETHURL,
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   data: data
  // }
  // try {
  //   const response = await axios(config)
  //   res.send(response.data)
  // }
  // catch (e) {
  //   console.log(e);
  //   res.send("error");
  // }
})

console.log("NODE_ENV is", process.env.NODE_ENV);
 
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
};

server.listen(port, () => console.log(`Listening on port ${port}`));