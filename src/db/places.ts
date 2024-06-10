import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
});
export const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // sortId: { type: Number, required: true },
  user: {
    type: UserSchema,
    required: true,
  },
});

export const PlaceModel = mongoose.model("Place", PlaceSchema);

export const getPlacesByUser = (user: typeof UserSchema) =>
  PlaceModel.find({ user });

export const getSortedPlacesByUser = (user: typeof UserSchema) =>
  PlaceModel.find({ user }).sort("sortId");

export const getPlaceByUserAndName = (user: typeof UserSchema, name: String) =>
  PlaceModel.findOne({ name, user });

export const getPlaceByUserAndId = (user: typeof UserSchema, _id: String) =>
  PlaceModel.findOne({ user, _id });

export const createPlace = (values: Record<string, any>) =>
  new PlaceModel(values).save().then((place) => place.toObject());

export const deletePlaceByName = (name: String, user: typeof UserSchema) =>
  PlaceModel.findOneAndDelete({ name, user });
export const updatePlaceByName = (
  oldName: string,
  user: typeof UserSchema,
  name: string
) => PlaceModel.findOneAndUpdate({ name: oldName, user }, { name });
