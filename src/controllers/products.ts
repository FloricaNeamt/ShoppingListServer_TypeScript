import {
  getProducts,
  getProductById,
  getProductByNameAndPlace,
  createProduct,
  deleteProductById,
  updateProductById,
} from "../db/products";
import express from "express";
import { get, isEmpty } from "lodash";
import {
  getPlaceByUserAndId,
  getPlaceByUserAndName,
  UserSchema,
  PlaceSchema,
} from "../db/places";

export const getAllProducts = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const currentUser = get(req, "identity") as typeof UserSchema;
    if (!currentUser) return res.sendStatus(403);

    const products = await getProducts(currentUser);

    return res.status(200).json(products).end();
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const getProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const currentUser = get(req, "identity") as typeof UserSchema;
    if (!currentUser) return res.sendStatus(403);
    const { id: productId } = req.params;
    if (!productId) return res.sendStatus(400);

    const product = await getProductById(productId);

    return res.status(200).json(product).end();
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
export const addProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name, category, quantity, placeId } = req.body;
    if (!name || !category || !quantity || !placeId) res.sendStatus(400);

    if (!placeId) {
      return res.sendStatus(400);
    }

    const currentUser = get(req, "identity") as typeof UserSchema;
    if (!currentUser) return res.sendStatus(403);

    const currentPlace = (await getPlaceByUserAndId(
      currentUser,
      placeId.toString()
    )) as unknown as typeof PlaceSchema;
    if (!currentPlace) return res.sendStatus(400);

    const existingProduct = await getProductByNameAndPlace(name, currentPlace);
    if (existingProduct) return res.sendStatus(400);

    const product = await createProduct({
      name,
      quantity,
      category,
      place: currentPlace,
    });

    return res.status(200).json(product).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id: productId } = req.params;
    if (!productId) return res.sendStatus(400);

    const oldProduct = await getProductById(productId);
    if (!oldProduct) return res.sendStatus(400);

    const currentUser = get(req, "identity") as typeof UserSchema;
    if (!currentUser) return res.sendStatus(403);

    const { name, quantity, category, placeId } = req.body;
    if (!name || !quantity || !category || !placeId) return res.sendStatus(400);

    const currentPlace = (await getPlaceByUserAndId(
      currentUser,
      placeId
    )) as unknown as typeof PlaceSchema;
    if (isEmpty(currentPlace)) return res.sendStatus(400);

    const existingProduct = await getProductByNameAndPlace(name, currentPlace);
    if (existingProduct) return res.sendStatus(400);

    const updatedProduct = await updateProductById(productId, {
      name,
      quantity,
      category,
      place: currentPlace,
    });

    const plainProduct = updatedProduct.toObject
      ? updatedProduct.toObject()
      : updatedProduct;

    return res.status(200).json(plainProduct);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id: productId } = req.params;
    if (!productId) return res.sendStatus(400);

    const user = get(req, "identity") as typeof UserSchema;
    if (!user) return res.sendStatus(403);

    const { place: placeId } = req.query;

    const existingProduct = await getProductById(productId);
    if (!existingProduct) return res.sendStatus(400);

    const deletedUser = await deleteProductById(productId);
    return res.json(deletedUser);
  } catch (error) {
    //console.log(error);
    return res.sendStatus(400);
  }
};
