import mongoose from "mongoose";

//I want a limonade.. 🍸🍋🍹
const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  category: { type: String, required: true },
  place: { type: PlaceSchema, required: true },
});

export const ProductModel = mongoose.model("Product", ProductSchema);
export const getProductsByPlace = (place: typeof PlaceSchema) =>
  ProductModel.find({ place });
export const getProductByNameAndPlace = (
  name: String,
  place: typeof PlaceSchema
) => ProductModel.findOne({ name });

export const createProduct = (values: Record<string, any>) => {
  new ProductModel(values).save().then((product) => product.toObject());
};

export const deleteProductByName = (name: String, place: typeof PlaceSchema) =>
  ProductModel.findOneAndDelete({ name, place });

export const updateProductByName = (
  name: String,
  values: Record<string, any>
) => {
  ProductModel.findOneAndUpdate(name, values);
};
