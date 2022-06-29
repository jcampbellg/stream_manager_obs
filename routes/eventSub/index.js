import express from 'express';
import eventSub from '../../functions/eventSub.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  const app_token = req.app.get('app_token');
  eventSub(app_token).get().then(data => {
    if (data.total === 0) {
      req.app.set('events_ids', []);
      res.send('No events subcribed');
    } else {
      const ids = data.data.map(item => item.id);
      req.app.set('events_ids', ids);
      res.send(data);
    }
  }).catch(err => {
    res.json(err);
  });
});

export default router;