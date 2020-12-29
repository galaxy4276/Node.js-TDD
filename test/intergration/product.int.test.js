import request from 'supertest';
import {app} from "../../server";
import newProduct from '../data/new-product.json';


let firstProduct;

describe('server test', () => {
  it("POST /api/products", async () => {
    const response = await request(app)
      .post("/api/products")
      .send(newProduct);
    expect(response.statusCode).toBe(201)
    expect(response.body.name).toBe(newProduct.name)
    expect(response.body.description).toBe(newProduct.description);
  });

  it("should return 500 on POST /api/products", async () => {
    const res = await request(app)
      .post('/api/products')
      .send({name: 'phone'});

    expect(res.statusCode).toBe(500);

    console.log('response.body', res.body);

    expect(res.body).toStrictEqual({ message: "Product validation failed: description: Path `description` is required." });
  });

  it("GET /api/products", async () => {
    const response = await request(app).get('/api/products');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    firstProduct = response.body[0];
  });

  it("GET /api/products/:productId", async () => {
    const response = await request(app).get(`/api/products/${firstProduct._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(firstProduct.name);
    expect(response.body.description).toBe(firstProduct.description);
  });

  it("GET id doesn't exist /api/products/:productId", async () => {
    const response = await request(app).get(`/api/products/null`);
    expect(response.statusCode).toBe(500);
  });

  it("PUT /api/products", async () => {
    const res = await request(app)
      .put(`/api/products/${firstProduct._id}`)
      .send({ name: "updated name", description: "updated desc" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("updated name");
    expect(res.body.description).toBe("updated desc");
  });

  it("should return 404 on PUT /api/products", async () => {
    const res = await request(app)
      .put("/api/products/undefinedId")
      .send({ name: "updated" });

    expect(res.statusCode).toBe(500);
  });

  it("DELETE /api/products", async () => {
    const res = await request(app)
      .delete(`/api/products/${firstProduct._id}`)
      .send();

    expect(res.statusCode).toBe(200);
  });

  it("DELETE id doesn't exist /api/product/:productId", async () => {
    const res = await request(app)
      .delete(`/api/products/${firstProduct._id}sd`)
      .send();

    expect(res.statusCode).toBe(500);
  });
});
