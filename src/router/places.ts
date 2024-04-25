import express from "express";
import { isAuthenticated } from "../middlewares/index";

import {
  addPlace,
  getAllPlacesforLoggedUser,
  deletePlace,
  updatePlace,
} from "../controllers/places";

export default (router: express.Router) => {
  router.get("/places", isAuthenticated, getAllPlacesforLoggedUser);
  router.post("/places", isAuthenticated, addPlace);
  router.delete("/places/:name", isAuthenticated, deletePlace);
  router.patch("/places/:name", isAuthenticated, updatePlace);
};
