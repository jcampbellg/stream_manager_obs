import express from 'express';
import getToken from '../../functions/getToken.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  getToken.clientToken(req.query.code).then(data => {
    req.app.set('access_token', data.access_token);
    req.app.set('refresh_token', data.refresh_token);
  }).catch(err => {
    res.json(err);
  });
});

router.get('/app', (req, res, next) => {
  getToken.appToken().then(data => {
    req.app.set('app_token', data.access_token);
    res.json({message: 'Success', scope: data.scope});
  }).catch(err => {
    res.json(err);
  });
});

export default router;