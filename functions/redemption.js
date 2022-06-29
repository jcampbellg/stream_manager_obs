import discordClient, { playTTSCall } from "../discordApp.js";

const redemption = (event) => {
  discordClient.channels.fetch(process.env.NOTIFICATION_CHANNEL).then(channel => {
    channel.send({
      embeds: [{
        title: `**${event.user_name}** ha redimido ${event.reward.title}`,
        description: '```' + JSON.stringify(event, undefined, 2) + '```'
      }]
    });
  });

  if (event.reward.title === 'Dame un Call (TTS)') {
    playTTSCall(event.user_input);
  }
};

export default redemption;