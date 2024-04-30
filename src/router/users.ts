import express from "express";

import {
  updateUser,
  deleteUser,
  getAllUsers,
  getCurrentUser,
} from "../controllers/users";
import { isAuthenticated, isOwnerOfUser } from "../middlewares";
const router = express.Router();

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.get("/users/me", isAuthenticated, getCurrentUser);
  router.delete("/users/:id", isAuthenticated, isOwnerOfUser, deleteUser);
  router.patch("/users/:id", isAuthenticated, isOwnerOfUser, updateUser);
};
