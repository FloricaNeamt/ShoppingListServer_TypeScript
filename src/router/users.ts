import express from "express";

import { updateUser, deleteUsers, getAllUsers } from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";
const router = express.Router();

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUsers);
  router.patch("/users/:id", isAuthenticated, isOwner, updateUser);
};
