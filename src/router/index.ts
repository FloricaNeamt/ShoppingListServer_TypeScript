import express from "express";
import authentication from "./authentication";
import places from "./places";
import products from "./products";
import users from "./users";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  places(router);
  products(router);
  return router;
};
