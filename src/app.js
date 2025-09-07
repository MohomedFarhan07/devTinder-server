const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require("dotenv").config();
require("./utils/cronjob");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");

const { initializeSocket } = require("./utils/socket");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);
//app.use("/", paymentRouter);

const server = http.createServer(app);

initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Connected to the Database");
    server.listen(process.env.PORT, () => {
      console.log("Listening to the port 7777");
    });
  })
  .catch((err) => {
    console.error("Database cannot connect");
  });
