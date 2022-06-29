import express from 'express';
import eventSub from '../../functions/eventSub.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  const app_token = req.app.get('app_token');
  const ids = req.app.get('events_ids');

  Promise.all(ids.map(id => {
    return eventSub(app_token).delete(id);
  })).then(() => {
    res.send('Events are clear');
  });
});

export default router;