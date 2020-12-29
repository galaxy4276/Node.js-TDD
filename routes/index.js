import {createProduct, deleteProduct, getProductById, getProducts, updateProduct} from "../controller";

const router = require('express').Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:productId', getProductById);
router.put('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);

export default router;