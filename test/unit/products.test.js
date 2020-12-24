import { createProduct } from '../../controller';
import ProductModel from '../../models/Product';
import httpMocks from 'node-mocks-http'; // req, res 객체
import newProduct from '../data/new-product.json';

ProductModel.create = jest.fn();

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = null;
});

describe('Product Create Controller', () => {
  beforeEach(() => {
    req.body = newProduct;
  });

  it("should have a createProduct function", () => {
    expect(typeof createProduct).toBe("function");
  });

  it('should call ProductModel.create', () => {
    createProduct(req, res, next); // 이 함수가 실행 될 때,
    expect(ProductModel.create).toBeCalledWith(newProduct); // 모델의 create가 수행되어야 한다.
  });

  it('should return 201 response code', () => {
    createProduct(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return json body in response', () => {
    ProductModel.create.mockReturnValue(newProduct);
    createProduct(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newProduct);
  });
});