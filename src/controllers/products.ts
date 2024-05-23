import {
  getProducts,
  createProduct,
  getProductByNameAndPlace,
  deleteProductByName,
  updateProductByName,
} from "../db/products";
import express from "express";
import { get, merge } from "lodash";
import { getPlaceByUserAndId, UserSchema, PlaceSchema } from "../db/places";
import { ObjectId } from "mongodb";

export const getAllProducts = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const currentUser = get(req, "identity") as typeof UserSchema;
    if (!currentUser) return res.sendStatus(403);

    const products = await getProducts(currentUser);
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for the specified place." });
    }
    return res.status(200).json(products).end();
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
    //console.log(error);
    return res.sendStatus(400);
  }
};

export const updateProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name: productName } = req.params;
    if (!productName) return res.sendStatus(400);

    const { place: placeId } = req.query;
    if (!placeId) {
      return res.sendStatus(400);
    }

    const currentUser = get(req, "identity") as typeof UserSchema;
    if (!currentUser) return res.sendStatus(403);

    const { name, quantity, category } = req.body;
    if (!name) res.sendStatus(400);
    if (!quantity) res.sendStatus(400);
    if (!category) res.sendStatus(400);

    const currentPlace = (await getPlaceByUserAndId(
      currentUser,
      placeId.toString()
    )) as unknown as typeof PlaceSchema;

    const existingProduct = await getProductByNameAndPlace(name, currentPlace);

    if (!existingProduct) {
      return res.sendStatus(400);
    }
    const product = updateProductByName(productName, {
      name,
      quantity,
      category,
      place: currentPlace,
    });

    return res.status(200).json(product);
  } catch (error) {
    //console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name: productName } = req.params;
    if (!productName) return res.sendStatus(400);

    const user = get(req, "identity") as typeof UserSchema;
    if (!user) return res.sendStatus(403);

    const { place: placeId } = req.query;

    const place = (await getPlaceByUserAndId(
      user,
      placeId.toString()
    )) as unknown as typeof PlaceSchema;

    const existingProduct = await getProductByNameAndPlace(productName, place);
    if (!existingProduct) return res.sendStatus(400);

    const deletedUser = await deleteProductByName(productName, place);
    return res.json(deletedUser);
  } catch (error) {
    //console.log(error);
    return res.sendStatus(400);
  }
};
