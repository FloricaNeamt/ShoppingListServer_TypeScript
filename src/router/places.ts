import express from "express";
import { isAuthenticated } from "../middlewares/index";

import {
  addPlace,
  getAllPlacesforLoggedUser,
  deletePlace,
  updatePlace,
  getSortedPlacesforLoggedUser,
} from "../controllers/places";

export default (router: express.Router) => {
  router.get("/places", isAuthenticated, getAllPlacesforLoggedUser);
  // router.get("/places", isAuthenticated, getSortedPlacesforLoggedUser);
  router.post("/places", isAuthenticated, addPlace);
  router.delete("/places/:name", isAuthenticated, deletePlace);
  router.patch("/places/:name", isAuthenticated, updatePlace);
};
