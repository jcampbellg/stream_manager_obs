import express from 'express';
const router = express.Router();

/*
auth
*/
import index from './index.js';
router.use('/', index);

export default router;