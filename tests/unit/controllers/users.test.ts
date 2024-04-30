import express from "express";
import {
  getAllUsers,
  getCurrentUser,
  deleteUser,
  updateUser,
} from "../../../src/controllers/users";
import {
  deleteUserById,
  getUserById,
  getUserBySessionToken,
  getUsers,
} from "../../../src/db/users";
import { mockUser1, mockUser2, mockUserId } from "../dataMocks";

jest.mock("../../../src/db/users", () => ({
  deleteUserById: jest.fn(),
  getUserById: jest.fn(),
  getUserBySessionToken: jest.fn(),
  getUsers: jest.fn(),
}));

const reqMock = { cookies: {} } as unknown as express.Request;
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
  end: jest.fn().mockReturnThis(),
} as unknown as express.Response;
describe("User Controller functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    reqMock.body = { id: mockUserId, ...mockUser1 };
  });
  describe("get all users", () => {
    it("should get all users", async () => {
      const mockUsers = [mockUser1, mockUser2];
      (getUsers as jest.Mock).mockResolvedValueOnce(mockUsers);

      await getAllUsers(reqMock, resMock);

      expect(getUsers).toHaveBeenCalled();
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(mockUsers);
      expect(resMock.end).toHaveBeenCalled();
    });
    it("should return a 400 error when getting all user", async () => {
      const errorMessage = "Error fetching users";
      (getUsers as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await getAllUsers(reqMock, resMock);

      expect(getUsers).toHaveBeenCalled();
      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("get current user", () => {
    it("should get current user", async () => {
      const mockSessionToken = "token123";
      const mockUser = { username: "currentUser" };
      reqMock.cookies["Flori-Auth"] = mockSessionToken;
      (getUserBySessionToken as jest.Mock).mockResolvedValueOnce(mockUser);

      await getCurrentUser(reqMock, resMock);

      expect(getUserBySessionToken).toHaveBeenCalledWith(mockSessionToken);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(mockUser);
      expect(resMock.end).toHaveBeenCalled();
    });

    it("should return a 400 error when getting current user", async () => {
      const errorMessage = "Error fetching current user";
      (getUserBySessionToken as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await getCurrentUser(reqMock, resMock);

      expect(getUserBySessionToken).toHaveBeenCalled();
      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("get delete user", () => {
    it("should delete a user", async () => {
      const mockDeletedUser = { _id: mockUserId, username: "deletedUser" };
      reqMock.params = { id: mockUserId };
      (deleteUserById as jest.Mock).mockResolvedValueOnce(mockDeletedUser);

      await deleteUser(reqMock, resMock);

      expect(deleteUserById).toHaveBeenCalledWith(mockUserId);
      expect(resMock.json).toHaveBeenCalledWith(mockDeletedUser);
    });

    it("should handle error when deleting a user", async () => {
      const errorMessage = "Error deleting user";
      (deleteUserById as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await deleteUser(reqMock, resMock);

      expect(deleteUserById).toHaveBeenCalled();
      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("get update user", () => {
    it("should update a user", async () => {
      const mockUsername = "updatedUsername";
      const mockUser = { _id: mockUserId, username: "oldUsername" };
      reqMock.params = { id: mockUserId };
      reqMock.body = { username: mockUsername };
      (getUserById as jest.Mock).mockResolvedValueOnce(mockUser);
      (mockUser as any).save = jest.fn().mockResolvedValueOnce(mockUser);

      await updateUser(reqMock, resMock);

      expect(getUserById).toHaveBeenCalledWith(mockUserId);
      expect(mockUser.username).toBe(mockUsername);
      expect((mockUser as any).save).toHaveBeenCalled();
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(mockUser);
      expect(resMock.end).toHaveBeenCalled();
    });
    it("should handle error when updating a user", async () => {
      const errorMessage = "Error updating user";
      (getUserById as jest.Mock).mockResolvedValueOnce({}); // Mocking getUserById to resolve to an empty object
      (getUserById as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await updateUser(reqMock, resMock);

      expect(getUserById).toHaveBeenCalled();
      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
    it("should return status 400 if username is missing", async () => {
      delete reqMock.body.username;

      await updateUser(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
    it("should return status 400 if product username parameter is missing", async () => {
      delete reqMock.params.id;

      await updateUser(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
  });
});
