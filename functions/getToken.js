import request from 'request';

const getToken = {
  clientToken: (code) => {
    return new Promise((resolve, reject) => {
      const options = {
        url: 'https://id.twitch.tv/oauth2/token',
        json: true,
        body: {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: process.env.WEBHOOK_URL+'/token'
        }
      };
  
      request.post(options, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.body);
      });
    });
  },
  appToken: () => {
    return new Promise((resolve, reject) => {
      const options = {
        url: 'https://id.twitch.tv/oauth2/token',
        json: true,
        body: {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: 'client_credentials',
        }
      };
  
      request.post(options, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.body);
      });
    });
  }
}

export default getToken;