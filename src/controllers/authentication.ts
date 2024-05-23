import express from "express";
import { getUserByEmail, getUserAuthentication, createUser } from "../db/users";
import { createHash, random } from "../helpers/index";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserAuthentication(email);

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = createHash(user.authentication.salt, password);
    if (user.authentication.password != expectedHash) {
      res.sendStatus(400);
    }

    const salt = random();
    user.authentication.sessionToken = createHash(salt, user._id.toString());
    await user.save();

    res.cookie("Flori-Auth", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    //console.log(error);
    return res.sendStatus(400);
  }
};
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: createHash(salt, password),
      },
    });
    return res.status(200).json(user).end();
  } catch (error) {
    //console.log(error);
    return res.sendStatus(400);
  }
};
