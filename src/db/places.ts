import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
});
export const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: {
    type: UserSchema,
    required: true,
  },
});

export const PlaceModel = mongoose.model("Place", PlaceSchema);

export const getPlacesForUser = (user: typeof UserSchema) =>
  PlaceModel.find({ user });
export const getPlaceByUserAndName = (name: String, user: typeof UserSchema) =>
  PlaceModel.findOne({ name, user });

export const createPlace = (values: Record<string, any>) => {
  new PlaceModel(values).save().then((place) => place.toObject());
};

export const deletePlaceByName = (name: String, user: typeof UserSchema) =>
  PlaceModel.findOneAndDelete({ name, user });
export const updatePlaceByName = (
  oldName: string,
  user: typeof UserSchema,
  name: string
) => PlaceModel.findOneAndUpdate({ name: oldName, user }, { name });
