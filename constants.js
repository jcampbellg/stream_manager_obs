import dotenv from 'dotenv';
dotenv.config();

// Notification request headers
export const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
export const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
export const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
export const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();
// Notification message types
export const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
export const MESSAGE_TYPE_NOTIFICATION = 'notification';
export const MESSAGE_TYPE_REVOCATION = 'revocation';

const authUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.WEBHOOK_URL}/token&scope=channel:manage:predictions+channel:manage:polls+channel:read:polls+bits:read+channel:read:subscriptions+channel_subscriptions+user:edit+chat:read+chat:edit+channel:moderate+moderation:read+whispers:edit+whispers:read+channel:manage:redemptions+channel:read:redemptions+channel:edit:commercial+channel_commercial+channel:manage:broadcast+channel_editor+user:edit:broadcast+clips:edit`;

export const homeHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Jcampbellg Stream Manager</title>
    </head>
    <body>
      <div>
        <h1>Step 1</h1>
        <button onclick="window.open('${authUrl}','_blank')">Connect to Twitch</button>
        <h1>Step 2</h1>
        <button onclick="window.open('${process.env.WEBHOOK_URL}/eventsub','_blank')">Get Events</button>
        <h1>Step 3</h1>
        <button onclick="window.open('${process.env.WEBHOOK_URL}/eventsub/clear','_blank')">Clear Events</button>
        <h1>Step 4</h1>
        <button onclick="window.open('${process.env.WEBHOOK_URL}/eventsub/subscribe','_blank')">Subscribe to Events</button>
      </div>
    </body>
  </html>
`;

export const events = [
  {type: 'channel.subscription.message', condition: {'broadcaster_user_id': process.env.CHANNEL_ID}},
  {type: 'channel.subscribe', condition: {'broadcaster_user_id': process.env.CHANNEL_ID}},
  {type: 'channel.follow', condition: {'broadcaster_user_id': process.env.CHANNEL_ID}},
  {type: 'channel.channel_points_custom_reward_redemption.add', condition: {'broadcaster_user_id': process.env.CHANNEL_ID}},
  {type: 'channel.subscription.gift', condition: {'broadcaster_user_id': process.env.CHANNEL_ID}},
  {type: 'channel.cheer', condition: {'broadcaster_user_id': process.env.CHANNEL_ID}},
  {type: 'channel.raid', condition: {'to_broadcaster_user_id': process.env.CHANNEL_ID}},
  {type: 'channel.poll.begin', condition: {'broadcaster_user_id': process.env.CHANNEL_ID}},
  {type: 'channel.poll.progress', condition: {'broadcaster_user_id': process.env.CHANNEL_ID}},
  {type: 'channel.poll.end', condition: {'broadcaster_user_id': process.env.CHANNEL_ID}},
  {type: 'channel.prediction.begin', condition: {'broadcaster_user_id': process.env.CHANNEL_ID}},
  {type: 'channel.prediction.progress', condition: {'broadcaster_user_id': process.env.CHANNEL_ID}},
  {type: 'channel.prediction.lock', condition: {'broadcaster_user_id': process.env.CHANNEL_ID}},
  {type: 'channel.prediction.end', condition: {'broadcaster_user_id': process.env.CHANNEL_ID}}
];