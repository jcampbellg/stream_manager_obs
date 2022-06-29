import express from 'express';
import { homeHtml } from '../constants.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send(homeHtml);
});

import tokenController from './token/tokenController.js';
router.use('/token', tokenController);

import eventSubController from './eventSub/eventSubController.js';
router.use('/eventsub', eventSubController);

export default router;