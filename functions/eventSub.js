import request from 'request';

const url = 'https://api.twitch.tv/helix/eventsub/subscriptions';

const eventSub = (app_token) => {
  return {
    get: () => {
      return new Promise((resolve, reject) => {
        const options = {
          url,
          json: true,
          headers: {
            'Client-id': process.env.CLIENT_ID,
            'Authorization': `Bearer ${app_token}`,
            'Content-Type': 'application/json'
          }
        };
    
        request.get(options, (err, res) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(res.body);
        });
      });
    },
    create: ({type, condition}) => {
      return new Promise((resolve, reject) => {
        const options = {
          url,
          json: true,
          headers: {
            'Client-id': process.env.CLIENT_ID,
            'Authorization': `Bearer ${app_token}`,
            'Content-Type': 'application/json'
          },
          body: {
            'type': type,
            'version': '1',
            'condition': condition,
            "transport":{
              'method': 'webhook',
              'callback': process.env.WEBHOOK_URL+'/eventsub/callback',
              'secret': process.env.CLIENT_SECRET
            }
          }
        };
    
        request.post(options, (err, res) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(res.body);
        });
      });
    },
    delete: (subscription_id) => {
      return new Promise((resolve, reject) => {
        const options = {
          url: `${url}?id=${subscription_id}`,
          json: true,
          headers: {
            'Client-id': process.env.CLIENT_ID,
            'Authorization': `Bearer ${app_token}`,
            'Content-Type': 'application/json'
          }
        };
    
        request.delete(options, (err, res) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(res.statusCode);
        });
      });
    }
  }
};

export default eventSub;