import {hello} from "../controller";

const router = require('express').Router();

router.get('/', hello);

export default router;