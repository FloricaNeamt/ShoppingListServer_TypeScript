import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";
import { getPlaceByUserAndName } from "../db/places";
import { UserSchema } from "./../db/users";

export const isOwnerOfUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as unknown as string;
    if (!currentUserId) {
      return res.sendStatus(403);
    }
    if (currentUserId.toString() != id) {
      return res.sendStatus(403);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
  next();
};

// export const isOwnerOfPlace = async (
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) => {
//   try {
//     const { name } = req.params;
//     const currentUser = get(req, "identity") as typeof UserSchema;
//     const place = await getPlaceByUserAndName(name, currentUser);
//     // const id = get(place, "user") as unknown as string;
//     // console.log(id);
//     console.log(currentUser);
//     if (!currentUser) {
//       return res.sendStatus(403);
//     }
//     if (!place) {
//       return res.sendStatus(404);
//     }
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(400);
//   }
//   next();
// };

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["Flori-Auth"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
