import express from "express";
import { login, register } from "../../../src/controllers/authentication";
import {
  createUser,
  getUserAuthentication,
  getUserByEmail,
} from "../../../src/db/users";
import { createHash } from "../../../src/helpers";
import { mockUser } from "../dataMocks";

jest.mock("../../../src/db/users", () => ({
  getUserAuthentication: jest.fn(),
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
}));

jest.mock("../../../src/helpers", () => ({
  createHash: jest.fn(),
  random: jest.fn(),
}));
const reqMock = {
  body: {},
} as unknown as express.Request;
const resMock = {
  sendStatus: jest.fn(),
  cookie: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  end: jest.fn().mockReturnThis(),
} as unknown as express.Response;
describe("Authentification functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Login user", () => {
    beforeEach(() => {
      reqMock.body = {
        email: mockUser.email,
        password: mockUser.authentication.password,
      };
    });
    it("should set session token cookie and return user data if login is successful", async () => {
      // Arrange
      const mockUserLogin = { ...mockUser, save: jest.fn() };

      (getUserAuthentication as jest.Mock).mockResolvedValue(mockUserLogin);
      (createHash as jest.Mock)
        .mockReturnValueOnce(mockUserLogin.authentication.password)
        .mockReturnValueOnce(mockUserLogin.authentication.sessionToken);

      //Act
      await login(reqMock, resMock);

      //Assert
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(mockUserLogin.authentication.sessionToken).toBeTruthy();
      expect(mockUserLogin.save).toHaveBeenCalled();
      expect(resMock.cookie).toHaveBeenCalledWith(
        "Flori-Auth",
        expect.any(String),
        {
          domain: "localhost",
          path: "/",
        }
      );
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(mockUserLogin);
    });

    it("should return status 400 if email is missing", async () => {
      delete reqMock.body.email;

      await login(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 400 if email or password is missing", async () => {
      delete reqMock.body.password;

      await login(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 400 if user is not found", async () => {
      (getUserAuthentication as jest.Mock).mockResolvedValueOnce(null);

      await login(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 403 if password is incorrect", async () => {
      (getUserAuthentication as jest.Mock).mockResolvedValueOnce(mockUser);
      (createHash as jest.Mock).mockReturnValueOnce("wrongPassword");

      await login(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(403);
    });
    it("should return status 400 if an error occurs", async () => {
      (getUserAuthentication as jest.Mock).mockRejectedValueOnce(
        new Error("Test error")
      );

      await login(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("Register user", () => {
    beforeEach(() => {
      reqMock.body = {
        email: mockUser.email,
        password: mockUser.authentication.password,
        username: mockUser.username,
      };
    });
    it("should create user and return user data if registration is successful", async () => {
      // (getUserByEmail as jest.Mock).mockResolvedValue(null);
      (createUser as jest.Mock).mockResolvedValueOnce(mockUser);

      await register(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(mockUser);
    });
    it("should return status 400 if email is missing", async () => {
      delete reqMock.body.email;

      await register(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
    it("should return status 400 if password is missing", async () => {
      delete reqMock.body.password;

      await register(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
    it("should return status 400 if username is missing", async () => {
      delete reqMock.body.username;

      await register(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
    it("should return status 400 if user already exists", async () => {
      (getUserByEmail as jest.Mock).mockResolvedValueOnce({});

      await register(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
    it("should return status 400 if an error occurs", async () => {
      (createUser as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

      await register(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
  });
});
