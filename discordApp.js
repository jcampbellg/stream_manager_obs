import request from 'request';
import { Client, Intents } from 'discord.js'
import { joinVoiceChannel, createAudioResource, StreamType, createAudioPlayer } from '@discordjs/voice';
import dotenv from 'dotenv';
import say from 'say';
dotenv.config();

const authUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.WEBHOOK_URL}/token&scope=channel:manage:predictions+channel:manage:polls+channel:read:polls+bits:read+channel:read:subscriptions+channel_subscriptions+user:edit+chat:read+chat:edit+channel:moderate+moderation:read+whispers:edit+whispers:read+channel:manage:redemptions+channel:read:redemptions+channel:edit:commercial+channel_commercial+channel:manage:broadcast+channel_editor+user:edit:broadcast+clips:edit`;

const discordClient = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS]});

const player = createAudioPlayer();
let voiceConnection;

discordClient.once('ready', () => {
	console.log('Discord is ready!');

  discordClient.channels.fetch(process.env.COMMAND_CHANNEL).then(channel => {
    channel.bulkDelete(100).then(() => {
      channel.send('¿Empezamos? Escribe `!autorizar` o `!empezar`');
    });
  });
});

discordClient.on('messageCreate', message => {
  if (message.channelId === process.env.COMMAND_CHANNEL) {
    if (message.content === '!autorizar') {
      message.react('✅');
      message.channel.send({
        embeds: [{
          description: `[Twitch Login](${authUrl})`
        }]
      });
    }

    if (message.content === '!empezar') {
      request.get({url: process.env.WEBHOOK_URL+'/token/app'}, (err, res) => {
        if (err) {
          message.react('❌');
          message.channel.send('Error al iniciar sesión.');
        }
        message.react('✅');
        message.channel.send('`⏲ Subscribiendo los eventos...`');

        request.get({url: process.env.WEBHOOK_URL+'/eventsub'}, (err, res) => {
          if (err) {
            message.react('❌');
            message.channel.send('Error obteniendo los eventos');
          }
          request.get({url: process.env.WEBHOOK_URL+'/eventsub/clear'}, (err, res) => {
            if (err) {
              message.react('❌');
              message.channel.send('Error obteniendo los eventos');
            }
            request.get({url: process.env.WEBHOOK_URL+'/eventsub/subscribe'}, (err, res) => {
              if (err) {
                message.react('❌');
                message.channel.send('Error obteniendo los eventos');
              }
              message.react('✅');
            });
          });
        });
      });
    }

    

    if (message.content.startsWith('`[14/14]') && message.author.bot) {
      discordClient.channels.fetch(process.env.NOTIFICATION_CHANNEL).then(channel => {
        channel.send('¡Listo para empezar el stream! ✅');
      });
    }
  }

  if (message.content === '!limpiar' && (message.channelId === process.env.COMMAND_CHANNEL || message.channelId === process.env.NOTIFICATION_CHANNEL)) {
    message.channel.bulkDelete(100).then(() => {
    });
  }

  if (message.content === '!tts on') {
    message.guild.members.fetch(message.author.id).then(member => {
      if (member.voice.channelId) {
        message.react('✅');
        voiceConnection = joinVoiceChannel({
          channelId: member.voice.channelId,
          guildId: message.guildId,
          adapterCreator: message.guild.voiceAdapterCreator,
          selfDeaf: false
        });
      } else {
        message.react('❌');
        message.channel.send('Necesitas estar en un canal de voz para usar este comando.');
      }
    });
  }

  if (message.content === '!tts test') {
    if (voiceConnection) {
      message.react('✅');
      const resource = createAudioResource('./test.wav', {
        inputType: StreamType.Arbitrary
      });

      player.play(resource);
      voiceConnection.subscribe(player);
    }
  }

  if (message.content === '!tts off') {
    if (voiceConnection) {
      message.react('✅');
      player.stop();
      voiceConnection.disconnect();
      voiceConnection = null;
    }
  }

  if (message.content === '!tts prev') {
    if (voiceConnection) {
      message.react('✅');
      const resource = createAudioResource('./call.wav', {
        inputType: StreamType.Arbitrary
      });

      player.play(resource);
      voiceConnection.subscribe(player);
    }
  }
});

export const playTTSCall = (call) => {
  say.export(call, 'Microsoft Sabina Desktop', 1, 'call.wav', (err) => {
    if (err) {
      console.log(err);
    }
    // Play sound
    if (voiceConnection) {
      const resource = createAudioResource('./call.wav', {
        inputType: StreamType.Arbitrary
      });

      player.play(resource);
      voiceConnection.subscribe(player);
    }
  });
}

export default discordClient;