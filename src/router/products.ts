import {
  addProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/products";
import express from "express";
import { isAuthenticated } from "../middlewares/index";

const router = express.Router();

export default (router: express.Router) => {
  router.get("/products", isAuthenticated, getAllProducts);
  router.get("/products/:id", isAuthenticated, getProduct);
  router.post("/products", isAuthenticated, addProduct);
  router.patch("/products/:id", isAuthenticated, updateProduct);
  router.delete("/products/:id", isAuthenticated, deleteProduct);
};
