import crypto from "crypto";
import config from "config";

const SECRET = config.get("SECRET").toString();

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
  if (!SECRET) {
    throw new Error("Fatal ERROR: SECRET is not defined.");
  } else {
    return crypto
      .createHmac("sha256", [salt, password].join("/"))
      .update(SECRET)
      .digest("hex");
  }
};
