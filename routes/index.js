import {createProduct, getProductById, getProducts} from "../controller";

const router = require('express').Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:productId', getProductById);

export default router;