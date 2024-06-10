import express from "express";
import { get, merge } from "lodash";
import {
  UserSchema,
  createPlace,
  getPlaceByUserAndName,
  getPlacesByUser,
  deletePlaceByName,
  updatePlaceByName,
  getSortedPlacesByUser,
} from "../db/places";

export const getAllPlacesforLoggedUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const currentUser = get(req, "identity") as typeof UserSchema;
    if (!currentUser) return res.sendStatus(403);
    const places = await getPlacesByUser(currentUser);

    return res.status(200).json(places).end();
  } catch (error) {
    //console.log(error);
    return res.sendStatus(400);
  }
};

export const getSortedPlacesforLoggedUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const currentUser = get(req, "identity") as typeof UserSchema;
    if (!currentUser) return res.sendStatus(403);
    const places = await getSortedPlacesByUser(currentUser);

    return res.status(200).json(places).end();
  } catch (error) {
    //console.log(error);
    return res.sendStatus(400);
  }
};
export const addPlace = async (req: express.Request, res: express.Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.sendStatus(400);
    }

    const user = get(req, "identity") as typeof UserSchema;
    if (!user) return res.sendStatus(403);
    const existingPlace = await getPlaceByUserAndName(user, name);

    if (existingPlace) {
      return res.sendStatus(400);
    }

    const place = await createPlace({ name, user });

    return res.status(200).json(place);
  } catch (error) {
    //console.log(error);
    return res.sendStatus(400);
  }
};

export const deletePlace = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name } = req.params;
    if (!name) return res.sendStatus(400);
    const user = get(req, "identity") as typeof UserSchema;
    if (!user) return res.sendStatus(403);
    const deletedUser = await deletePlaceByName(name, user);
    return res.json(deletedUser);
  } catch (error) {
    //console.log(error);
    return res.sendStatus(400);
  }
};
export const updatePlace = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name: oldName } = req.params;
    const { name } = req.body;

    if (!name) {
      res.sendStatus(400);
    }
    const user = get(req, "identity") as typeof UserSchema;

    const place = await updatePlaceByName(oldName, user, name);

    return res.status(200).json(place).end();
  } catch (error) {
    //console.log(error);
    return res.sendStatus(400);
  }
};
