import mongoose from "mongoose";
import { PlaceSchema } from "./places";

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  category: { type: String, required: true },
  place: { type: PlaceSchema, required: true },
});

export const ProductModel = mongoose.model("Product", ProductSchema);
export const getProducts = (user: typeof UserSchema) =>
  ProductModel.find({ "place.user": user });
export const getProductsByPlace = (place: typeof PlaceSchema) =>
  ProductModel.find({ place });
export const getProductById = (_id: String) => ProductModel.findOne({ _id });
export const getProductByNameAndPlace = (
  name: String,
  place: typeof PlaceSchema
) => ProductModel.findOne({ name, place });

export const createProduct = (values: Record<string, any>) =>
  new ProductModel(values).save().then((product) => product.toObject());

export const deleteProductById = (_id: String) =>
  ProductModel.findOneAndDelete({ _id });

export const updateProductById = (_id: string, values: Record<string, any>) =>
  ProductModel.findOneAndUpdate({ _id }, values, { new: true });
