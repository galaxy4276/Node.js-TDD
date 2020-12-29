import {createProduct, deleteProduct, getProductById, getProducts, updateProduct} from '../../controller';
import ProductModel from '../../models/Product';
import httpMocks from 'node-mocks-http'; // req, res 객체
import newProduct from '../data/new-product.json';
import allProducts from '../data/all-products.json';

/*
  단위 테스트는 따른 종속성의 영향을 받지 않아야 한다.
 */

ProductModel.create = jest.fn();
ProductModel.find = jest.fn();
ProductModel.findById = jest.fn();
ProductModel.findByIdAndUpdate = jest.fn();
ProductModel.findByIdAndDelete = jest.fn();

const productId = '5fe6b2c44661e638c8cdd3b1';
const updatedProduct =  { name: "updated name", description: "updated desc" };
let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});


describe('모든 유닛 테스트 수행', () => {
  describe('Product Create Controller', () => {
    beforeEach(() => {
      req.body = newProduct;
    });

    it("should have a createProduct function", () => {
      expect(typeof createProduct).toBe("function");
    });

    it('should call ProductModel.create', async () => {
      await createProduct(req, res, next); // 이 함수가 실행 될 때,
      expect(ProductModel.create).toBeCalledWith(newProduct); // 모델의 create가 수행되어야 한다.
    });

    it('should return 201 response code', async () => {
      await createProduct(req, res, next);
      expect(res.statusCode).toBe(201);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return json body in response', async () => {
      ProductModel.create.mockReturnValue(newProduct);
      await createProduct(req, res, next);
      expect(res._getJSONData()).toStrictEqual(newProduct);
    });

    it("should handle errors", async () => {
      const errorMessage = { message: 'description property missing' };
      const rejectedPromise = Promise.reject(errorMessage);
      ProductModel.create.mockReturnValue(rejectedPromise);
      await createProduct(req, res, next);
      expect(next).toBeCalledWith(errorMessage);
    });
  });

// READ
  describe("Product Controller Get", () => {
    it("should have a getProducts function", () => {
      expect(typeof getProducts).toBe("function");
    })

    it("should call ProductModel.find({})", async () => {
      await getProducts(req, res, next);
      expect(ProductModel.find).toHaveBeenCalledWith({});
    });

    it("should return 200 response", async () => {
      await getProducts(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it("should return json body in response", async () => {
      ProductModel.find.mockReturnValue(allProducts);
      await getProducts(req, res, next);
      expect(res._getJSONData()).toStrictEqual(allProducts);
    });

    it("should handler errors", async () => {
      const errorMessage = {message: "Error finding product data" };
      const rejectedPromise = Promise.reject(errorMessage);
      ProductModel.find.mockReturnValue(rejectedPromise);
      await getProducts(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('Product Controller GetById', () => {
    it("should have a getProductById", () => {
      expect(typeof getProductById).toBe("function");
    });

    it("should call findById", async () => {
      req.params.productId = productId;
      await getProductById(req, res, next);
      expect(ProductModel.findById).toBeCalledWith(productId);
    });

    it("should return json body and response code 200", async () => {
      ProductModel.findById.mockReturnValue(newProduct);
      await getProductById(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual(newProduct);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it("should return 404 when item doesn't exist.", async () => {
      ProductModel.findById.mockReturnValue(null);
      await getProductById(req, res, next);
      expect(res.statusCode).toBe(404);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it("should handle errors", async () => {
      const errorMessage = { message: "error" };
      const rejectedPromise = Promise.reject(errorMessage);
      ProductModel.findById.mockReturnValue(rejectedPromise);
      await getProductById(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe("Product Controller Update", () => {
    it("should have and updateProduct function", () => {
      expect(typeof updateProduct).toBe("function");
    });

    it("should call findByIdAndUpdate", async () => {
      req.params.productId = productId;
      req.body = updatedProduct;

      await updateProduct(req, res, next);
      expect(ProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
        productId,
        { name: "updated name", description: "updated desc" },
        { new: true }
      );
    });

    it("should return json body and response code 200", async () => {
      req.params.productId = productId;
      req.body = updatedProduct;

      ProductModel.findByIdAndUpdate.mockReturnValue(updatedProduct);
      await updateProduct(req, res, next);

      expect(res._isEndCalled()).toBeTruthy();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual(updatedProduct);
    });

    it("should handle 404 when item doesn't exist", async () => {
      ProductModel.findByIdAndUpdate.mockReturnValue(null);
      await updateProduct(req, res, next);
      expect(res.statusCode).toBe(404);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it("should handle errors", async () => {
      const errorMessage = { message: "Error" };
      const rejectedPromise = Promise.reject(errorMessage);
      ProductModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
      await updateProduct(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe("Product Controller Delete", () => {
    it("should have a deleteProduct function", () => {
      expect(typeof deleteProduct).toBe("function");
    });

    it("should call ProductModel.findByIdAndDelete", async () => {
      req.params.productId = productId;
      await deleteProduct(req, res, next);
      expect(ProductModel.findByIdAndDelete).toBeCalledWith(productId);
    });

    it("should return 200 respons and json data", async () => {
      let deletedProduct = {
        name: 'deleted Product',
        description: 'removed'
      };
      ProductModel.findByIdAndDelete.mockReturnValue(deletedProduct);
      await deleteProduct(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual(deletedProduct);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it("should handle 404 when item doesn't exist", async () => {
      ProductModel.findByIdAndDelete.mockReturnValue(null);
      await deleteProduct(req, res, next);
      expect(res.statusCode).toBe(404);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it("should handle errors", async () => {
      const errorMessage = { message: "Error deleting" };
      const rejectedPromise = Promise.reject(errorMessage);

      ProductModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
      await deleteProduct(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  });
});
