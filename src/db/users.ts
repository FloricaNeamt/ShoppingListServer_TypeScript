import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, minlength: 5, maxlength: 255 },
  authentication: {
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
      select: false,
    },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserAuthentication = (email: string) =>
  UserModel.findOne({ email }).select(
    "+authentication.salt +authentication.password"
  );
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: String) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
