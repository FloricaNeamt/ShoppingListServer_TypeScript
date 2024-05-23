import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";
import config from "config";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

const port = process.env.PORT || 3900;
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const MONGO_URL = config.get("db").toString();

mongoose.Promise = Promise;
mongoose
  .connect(MONGO_URL)
  .then(() => console.log(`Connected to ${MONGO_URL}`));
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());

module.exports = server;
