import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "./../../../src/controllers/products";
import { getPlaceByUserAndName } from "../../../src/db/places";
import {
  getProductsByPlace,
  createProduct,
  getProductByNameAndPlace,
  updateProductByName,
  deleteProductByName,
} from "../../../src/db/products";
import {
  mockPlace,
  mockProduct,
  mockProducts,
  mockUpdatedProduct,
  mockUser,
} from "./../dataMocks";

jest.mock("../../../src/db/places", () => ({
  getPlaceByUserAndName: jest.fn(),
}));

jest.mock("../../../src/db/products", () => ({
  getProductsByPlace: jest.fn(),
  createProduct: jest.fn(),
  getProductByNameAndPlace: jest.fn(),
  updateProductByName: jest.fn(),
  deleteProductByName: jest.fn(),
}));

const reqMock = {
  query: { place: mockPlace.name },
  body: {},
  identity: mockUser,
  params: { name: mockProduct.name },
} as unknown as express.Request;

const resMock = {
  sendStatus: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  end: jest.fn().mockReturnThis(),
} as unknown as express.Response;

describe("Products controller functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    reqMock.body = {
      name: mockProduct.name,
      quantity: mockProduct.quantity,
      category: mockProduct.category,
      place: mockProduct.place,
    };
    reqMock.query = {
      place: mockPlace.name,
    };
    reqMock.params = { name: mockProduct.name };
  });
  describe("Get All Products function", () => {
    it("should return products for the specified place if successful", async () => {
      (getPlaceByUserAndName as jest.Mock).mockResolvedValueOnce(mockPlace);
      (getProductsByPlace as jest.Mock).mockResolvedValueOnce(mockProducts);

      await getAllProducts(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(mockProducts);
    });

    it("should return status 403 if no current user is provided", async () => {
      const reqWithoutIdentity = {
        query: {
          place: "Test Place",
        },
      };

      await getAllProducts(
        reqWithoutIdentity as unknown as express.Request,
        resMock
      );

      expect(resMock.sendStatus).toHaveBeenCalledWith(403);
    });

    it("should return status 404 if no products are found for the specified place", async () => {
      (getPlaceByUserAndName as jest.Mock).mockResolvedValueOnce(mockPlace);
      (getProductsByPlace as jest.Mock).mockResolvedValueOnce([]);

      await getAllProducts(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(404);
      expect(resMock.json).toHaveBeenCalledWith({
        message: "No products found for the specified place.",
      });
    });

    it("should return status 400 if an error occurs", async () => {
      (getPlaceByUserAndName as jest.Mock).mockRejectedValueOnce(
        new Error("Test error")
      );

      await getAllProducts(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("Add Product function", () => {
    it("should create new product and return it if successful", async () => {
      (getPlaceByUserAndName as jest.Mock).mockResolvedValueOnce(mockPlace);
      (getProductByNameAndPlace as jest.Mock).mockResolvedValueOnce(undefined);
      (createProduct as jest.Mock).mockResolvedValueOnce(mockProduct);

      await addProduct(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(mockProduct);
    });

    it("should return status 400 if name from body is missing", async () => {
      delete reqMock.body.name;

      await addProduct(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 400 if category from body is missing", async () => {
      delete reqMock.body.category;

      await addProduct(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 400 if quantity from body is missing", async () => {
      delete reqMock.body.quantity;

      await addProduct(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
    it("should return status 400 if place query parameter is missing", async () => {
      delete reqMock.query.place;

      await addProduct(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 403 if no current user is provided", async () => {
      const reqWithoutIdentity = {
        body: {
          name: mockProduct.name,
          quantity: mockProduct.quantity,
          category: mockProduct.category,
        },
        query: {
          place: mockPlace.name,
        },
      };

      await addProduct(
        reqWithoutIdentity as unknown as express.Request,
        resMock
      );

      expect(resMock.sendStatus).toHaveBeenCalledWith(403);
    });

    it("should return status 400 if current place is not found", async () => {
      (getPlaceByUserAndName as jest.Mock).mockResolvedValueOnce(null);

      await addProduct(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 400 if product with the same name already exists for the current place", async () => {
      (getPlaceByUserAndName as jest.Mock).mockResolvedValueOnce(mockPlace);
      (getProductByNameAndPlace as jest.Mock).mockResolvedValueOnce(
        mockProduct
      );

      await addProduct(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 400 if an error occurs", async () => {
      (getPlaceByUserAndName as jest.Mock).mockResolvedValueOnce(mockPlace);
      (getProductByNameAndPlace as jest.Mock).mockRejectedValueOnce(
        new Error("Test error")
      );

      await addProduct(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
  });
  describe("Update Product function", () => {
    it("should update product and return it if successful", async () => {
      (getPlaceByUserAndName as jest.Mock).mockResolvedValueOnce(mockPlace);
      (getProductByNameAndPlace as jest.Mock).mockResolvedValueOnce(
        mockProduct
      );
      (updateProductByName as jest.Mock).mockReturnValueOnce(
        mockUpdatedProduct
      );

      await updateProduct(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(mockUpdatedProduct);
    });

    it("should return status 400 if product name parameter is missing", async () => {
      delete reqMock.params.name;

      await updateProduct(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 400 if place query parameter is missing", async () => {
      delete reqMock.query.place;

      await updateProduct(reqMock as express.Request, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
    it("should return status 403 if no current user is provided", async () => {
      const reqWithoutIdentity = {
        body: {
          name: mockProduct.name,
          quantity: mockProduct.quantity,
          category: mockProduct.category,
        },
        query: {
          place: mockPlace.name,
        },
        params: {
          name: "Test Product",
        },
      };

      await updateProduct(
        reqWithoutIdentity as unknown as express.Request,
        resMock
      );

      expect(resMock.sendStatus).toHaveBeenCalledWith(403);
    });

    it("should return status 400 if name from body is missing", async () => {
      delete reqMock.body.name;

      await updateProduct(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 400 if quantity from body is missing", async () => {
      delete reqMock.body.quantity;

      await updateProduct(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
    it("should return status 400 if category from body is missing", async () => {
      delete reqMock.body.category;

      await updateProduct(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
    it("should return status 400 if product does not exist for the current place", async () => {
      const mockCurrentPlace = {
        /* Mock current place object */
      };
      (getPlaceByUserAndName as jest.Mock).mockResolvedValueOnce(
        mockCurrentPlace
      );
      (getProductByNameAndPlace as jest.Mock).mockResolvedValueOnce(null);

      await updateProduct(reqMock as express.Request, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
    it("should return status 400 if an error occurs", async () => {
      (getPlaceByUserAndName as jest.Mock).mockResolvedValueOnce(mockPlace);
      (getProductByNameAndPlace as jest.Mock).mockRejectedValueOnce(
        new Error("Test error")
      );

      await updateProduct(reqMock as express.Request, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("Delete Product function", () => {
    it("should delete product and return deleted user if successful", async () => {
      (getProductByNameAndPlace as jest.Mock).mockResolvedValueOnce(
        mockProduct
      );
      (deleteProductByName as jest.Mock).mockResolvedValueOnce(mockUser);
      (getPlaceByUserAndName as jest.Mock).mockResolvedValueOnce(mockPlace);

      await deleteProduct(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(mockUser);
    });
    it("should return status 400 if product name parameter is missing", async () => {
      delete reqMock.params.name;

      await deleteProduct(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
    it("should return status 403 if no current user is provided", async () => {
      const reqWithoutIdentity = {
        body: {
          name: mockProduct.name,
          quantity: mockProduct.quantity,
          category: mockProduct.category,
        },
        query: {
          place: mockPlace.name,
        },
        params: {
          name: "Test Product",
        },
      };

      await deleteProduct(
        reqWithoutIdentity as unknown as express.Request,
        resMock
      );

      expect(resMock.sendStatus).toHaveBeenCalledWith(403);
    });
    it("should return status 400 if place query parameter is missing", async () => {
      delete reqMock.query.place;

      await deleteProduct(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 400 if product does not exist for the current place", async () => {
      (getPlaceByUserAndName as jest.Mock).mockResolvedValueOnce(mockPlace);
      (getProductByNameAndPlace as jest.Mock).mockResolvedValueOnce(null);

      await deleteProduct(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 400 if an error occurs", async () => {
      (getProductByNameAndPlace as jest.Mock).mockRejectedValueOnce(
        new Error("Test error")
      );

      await deleteProduct(reqMock, resMock);

      expect(resMock.sendStatus).toHaveBeenCalledWith(400);
    });
  });
});
