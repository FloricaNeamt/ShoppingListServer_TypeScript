import express from "express";

import {
  updateUser,
  deleteUsers,
  getAllUsers,
  getMe,
} from "../controllers/users";
import { isAuthenticated, isOwnerOfUser } from "../middlewares";
const router = express.Router();

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.get("/users/me", isAuthenticated, getMe);
  router.delete("/users/:id", isAuthenticated, isOwnerOfUser, deleteUsers);
  router.patch("/users/:id", isAuthenticated, isOwnerOfUser, updateUser);
};
