const express = require("express");
const app = express();
const http = require("http");
var cors = require("cors");
app.use(cors());
const { constants } = require("fs");
const fyers = require("fyers-api-v2");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true,
  },
});

const fyersdata = async (stocks) => {
  fyers.setAppId("OU4MHNZV2Z-100");
  fyers.setAccessToken(
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE2Nzk4MDgyNzMsImV4cCI6MTY3OTg3NzAzMywibmJmIjoxNjc5ODA4MjczLCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCa0g5Y1JLUjExc1Z4MlBzTWwtLTRnTlltQjMxMmhCelBUdXBVMGRoM25wTE5MOEpVMmFsZ3J0M283TzJZNnFLamtueC1KVmdKTzljNFh3c01wVC1BZ0dZWVhIamdnQjF6Tlpqc1A0NHQxVUxSSW4xTT0iLCJkaXNwbGF5X25hbWUiOiJTVUJJUiBTSU5HSCIsIm9tcyI6IksxIiwiZnlfaWQiOiJYUzYxNTQyIiwiYXBwVHlwZSI6MTAwLCJwb2FfZmxhZyI6Ik4ifQ.RaLq4rxg9xqiY-YOdLXeW7DQf9n_gXN6h2pof03sUtc"
  );
  const reqBody = {
    symbol: stocks,

    dataType: "symbolUpdate",
  };

  fyers.fyers_connect(reqBody, function (data) {
    console.log(data);
    io.emit("stock_data", data);
  });
};

io.on("connection", async (socket) => {
  console.log("Socket connected");
  //   await apidata.initialize(apiKey, apiHost, scheme);

  socket.on("requestData", async (stocks) => {
    console.log(stocks);
    fyersdata(stocks);
  });
});

server.listen(5001, () => {
  console.log("Server listening on port 5001");
});
