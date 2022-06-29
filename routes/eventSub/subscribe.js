import express from 'express';
import { events } from '../../constants.js';
import eventSub from '../../functions/eventSub.js';

const router = express.Router();

router.get('/', (req, res) => {
  const app_token = req.app.get('app_token');

  Promise.all(events.map(ev => {
    return eventSub(app_token).create(ev);
  })).then((values) => {
    res.json(values);
  });
});

export default router;