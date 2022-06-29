import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({message: 'Hi'});
});

import tokenController from './token/tokenController.js';
router.use('/token', tokenController);

import eventSubController from './eventSub/eventSubController.js';
router.use('/eventsub', eventSubController);

export default router;