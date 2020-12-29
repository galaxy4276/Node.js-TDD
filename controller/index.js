import ProductModel from '../models/Product';

export const createProduct = async (req, res, next) => {
  try {
    const createdProduct = await ProductModel.create(req.body);
    console.log('createdProduct', createdProduct);
    res.status(201).json(createdProduct);
  } catch (err) {
    // next 에 에러인자를 담을 시,
    next(err); // 비동기 에러를 처리하는 곳으로 보내준다.
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const allProducts = await ProductModel.find({});

    res.status(200).json(allProducts);
  } catch (err) {
    next(err);
  }
}

export const getProductById = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    if (product) {
      return res.status(200).json(product);
    }

    return res.status(404).send();
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true },
    );

    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.productId);

    if (deletedProduct) {
      res.status(200).json(deletedProduct);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
}