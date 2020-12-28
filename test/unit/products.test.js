import {createProduct, getProductById, getProducts} from '../../controller';
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

const productId = '5fe6b2c44661e638c8cdd3b1';
let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});


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