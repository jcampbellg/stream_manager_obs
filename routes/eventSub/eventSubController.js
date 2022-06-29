import express from 'express';
const router = express.Router();

/*
eventsub
*/
import index from './index.js';
router.use('/', index);

/*
eventsub/subscribe
*/
import subscribe from './subscribe.js';
router.use('/subscribe', subscribe);

/*
eventsub/callback
*/
import callback from './callback.js';
router.use('/callback', callback);

/*
eventsub/clear
*/
import clear from './clear.js';
router.use('/clear', clear);

export default router;