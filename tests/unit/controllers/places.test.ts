import express from "express";
import {
  addPlace,
  deletePlace,
  getAllPlacesforLoggedUser,
  updatePlace,
} from "../../../src/controllers/places";
import {
  createPlace,
  getPlacesForUser,
  getPlaceByUserAndName,
  deletePlaceByName,
  updatePlaceByName,
} from "../../../src/db/places";
import { mockUser, mockPlaces, mockPlace, mockPlace1 } from "../dataMocks";

jest.mock("../../../src/db/places", () => ({
  createPlace: jest.fn(),
  getPlacesForUser: jest.fn(),
  getPlaceByUserAndName: jest.fn(),
  deletePlaceByName: jest.fn(),
  updatePlaceByName: jest.fn(),
}));

const reqMock = {
  body: { name: mockPlace.name, user: mockPlace.user },
  identity: mockUser,
  params: { name: mockPlace.name },
} as unknown as express.Request;

const resMock = {
  sendStatus: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as unknown as express.Response;

describe("Place Controller functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(" Get all places for logged user function", () => {
    it("should set session token cookie and return user data if login is successful", async () => {
      (getPlacesForUser as jest.Mock).mockResolvedValueOnce(mockPlaces);

      await getAllPlacesforLoggedUser(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(mockPlaces);
    });
    it("should return status 403 if no current user is provided", async () => {
      const reqWithoutIdentity = {};

      await getAllPlacesforLoggedUser(
        reqWithoutIdentity as express.Request,
        resMock
      );

      expect(resMock.sendStatus).toHaveBeenCalledWith(403);
    });
    it("should return status 400 if an error occurs", async () => {
      (getPlacesForUser as jest.Mock).mockRejectedValueOnce(
        new Error("Test error")
      );

      await getAllPlacesforLoggedUser(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("Add Place function", () => {
    it("should create new place and return it if successful", async () => {
      (getPlaceByUserAndName as jest.Mock).mockResolvedValue(null);
      (createPlace as jest.Mock).mockResolvedValue(mockPlace);

      await addPlace(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(mockPlace);
    });

    it("should return status 400 if name is missing", async () => {
      const reqWithoutName = {
        body: {},
        identity: {},
      };

      await addPlace(reqWithoutName as unknown as express.Request, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 403 if no current user is provided", async () => {
      const reqWithoutIdentity = {
        body: {
          name: "Test Place",
        },
      };

      await addPlace(reqWithoutIdentity as express.Request, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(403);
    });

    it("should return status 400 if place with same name already exists for the user", async () => {
      (getPlaceByUserAndName as jest.Mock).mockResolvedValueOnce(mockPlace);

      await addPlace(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 400 if an error occurs", async () => {
      (createPlace as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

      await addPlace(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("Delete Place function", () => {
    it("should return status 400 if name parameter is missing", async () => {
      const reqWithoutName = {
        params: {},
        identity: {},
      };

      await deletePlace(reqWithoutName as unknown as express.Request, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 403 if no current user is provided", async () => {
      const reqWithoutIdentity = {
        params: {
          name: "Test Place",
        },
      };

      await deletePlace(
        reqWithoutIdentity as unknown as express.Request,
        resMock
      );

      expect(resMock.sendStatus).toHaveBeenCalledWith(403);
    });

    it("should delete place and return it if successful", async () => {
      (deletePlaceByName as jest.Mock).mockResolvedValueOnce(mockPlace);

      await deletePlace(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(mockPlace);
    });

    it("should return status 400 if an error occurs", async () => {
      (deletePlaceByName as jest.Mock).mockRejectedValueOnce(
        new Error("Test error")
      );

      await deletePlace(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("Update Place function", () => {
    it("should return status 400 if name parameter is missing in request body", async () => {
      const reqWithoutName = {
        params: reqMock.params,
        body: {},
        identity: {},
      };
      await updatePlace(reqWithoutName as unknown as express.Request, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should update place and return it if successful", async () => {
      const updatedPlace = {
        name: "New name",
        user: mockPlace.user,
      };
      (updatePlaceByName as jest.Mock).mockResolvedValueOnce(updatedPlace);

      await updatePlace(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(updatedPlace);
    });

    it("should return status 400 if an error occurs", async () => {
      (updatePlaceByName as jest.Mock).mockRejectedValueOnce(
        new Error("Test error")
      );

      await updatePlace(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
  });
});
