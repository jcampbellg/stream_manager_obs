import express from 'express';
import { MESSAGE_TYPE_NOTIFICATION, MESSAGE_TYPE_VERIFICATION, MESSAGE_TYPE, MESSAGE_TYPE_REVOCATION } from '../../constants.js';

const router = express.Router();

router.post('/', (req, res, next) => {
  const notification = req.body;

  if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
    console.log(`Event type: ${notification.subscription.type}`);
    console.log(JSON.stringify(notification.event, null, 4));
    
    res.sendStatus(204);
  } else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
    console.log(`Event type: ${req.headers['twitch-eventsub-subscription-type']}`);
    res.status(200).send(notification.challenge);
  } else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
    res.sendStatus(204);

    console.log(`${notification.subscription.type} notifications revoked!`);
    console.log(`reason: ${notification.subscription.status}`);
    console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
  } else {
    res.sendStatus(204);
    console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
  }
});

export default router;