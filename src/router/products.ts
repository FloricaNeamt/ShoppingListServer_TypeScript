import {
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
} from "../controllers/products";
import express from "express";
import { isAuthenticated } from "../middlewares/index";

const router = express.Router();

export default (router: express.Router) => {
  router.get("/products", isAuthenticated, getAllProducts);
  router.post("/products", isAuthenticated, addProduct);
  router.patch("/products/:name", isAuthenticated, updateProduct);
  router.delete("/products/:name", isAuthenticated, deleteProduct);
};
