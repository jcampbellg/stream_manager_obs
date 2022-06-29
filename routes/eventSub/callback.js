import express from 'express';
import { MESSAGE_TYPE_NOTIFICATION, MESSAGE_TYPE_VERIFICATION, MESSAGE_TYPE, MESSAGE_TYPE_REVOCATION, TWITCH_EVENT } from '../../constants.js';
import discordClient from '../../discordApp.js';
import redemption from '../../functions/redemption.js';

const router = express.Router();

router.post('/', (req, res, next) => {
  const notification = req.body;

  if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
    const event = notification.event;

    switch (notification.subscription.type) {
      case TWITCH_EVENT.REDEMPTION:
        redemption(event);
        break;
      default:
        break;
    };
    
    res.sendStatus(204);
  } else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
    const count = req.app.get('eventCount') || 1;
    req.app.set('eventCount', count + 1);

    discordClient.channels.fetch(process.env.COMMAND_CHANNEL).then(channel => {
      channel.send('`[' + count + '/14] Evento: ' + req.headers['twitch-eventsub-subscription-type'] + '... ✅`');
    });

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