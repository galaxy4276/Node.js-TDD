import ProductModel from '../models/Product';

export const createProduct = (req, res, next) => {
  const createdProduct = ProductModel.create(req.body);
  res.status(201).json(createdProduct);
};