import crypto from "crypto";
import config from "config";

if (!config.get("SECRET")) {
  throw new Error("Fatal ERROR: SECRET is not defined.");
}

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
  if (!config.get("SECRET")) {
    throw new Error("Fatal ERROR: SECRET is not defined.");
  } else {
    return crypto
      .createHmac("sha256", [salt, password].join("/"))
      .update(config.get("SECRET"))
      .digest("hex");
  }
};
