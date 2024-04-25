import express from "express";

import {
  deleteUserById,
  getUserById,
  getUserBySessionToken,
  getUsers,
} from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getMe = async (req: express.Request, res: express.Response) => {
  try {
    const sessionToken = req.cookies["Flori-Auth"];

    const existingUser = await getUserBySessionToken(sessionToken);

    return res.status(200).json(existingUser).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);
    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      res.sendStatus(400);
    }

    const user = await getUserById(id);

    if (user) {
      user.username = username;
      await user.save();
    }

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
