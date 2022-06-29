import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import router from './routes/index.js';
import dotenv from 'dotenv';
import request from 'request';
import { Client, Intents } from 'discord.js'
import { joinVoiceChannel, createAudioResource, StreamType, createAudioPlayer } from '@discordjs/voice';
import say from 'say';

dotenv.config();

const PORT = process.env.PORT || 80;

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});
app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API ROUTES
app.use('/', router);

// SERVER
app.set('port', PORT);
const server = http.createServer(app);
server.on('listening', () => {
  console.log('Listening on ' + PORT);
});

server.listen(PORT);

const authUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.WEBHOOK_URL}/token&scope=channel:manage:predictions+channel:manage:polls+channel:read:polls+bits:read+channel:read:subscriptions+channel_subscriptions+user:edit+chat:read+chat:edit+channel:moderate+moderation:read+whispers:edit+whispers:read+channel:manage:redemptions+channel:read:redemptions+channel:edit:commercial+channel_commercial+channel:manage:broadcast+channel_editor+user:edit:broadcast+clips:edit`;

export const discordClient = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS]});

const player = createAudioPlayer();
let voiceConnection;

discordClient.once('ready', () => {
	console.log('Discord is ready!');

  discordClient.channels.fetch(process.env.NOTIFICATION_CHANNEL).then(channel => {
    channel.send('¡Listo para streamear!');
  });
});

discordClient.on('messageCreate', message => {
  if (message.channelId === process.env.NOTIFICATION_CHANNEL) {
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
      }
    }

    if (message.content === '!login user') {
      message.react('✅');
      message.channel.send({
        embeds: [{
          description: `[Twitch Login](${authUrl})`
        }]
      });
    }

    if (message.content === '!login app') {
      const options = {
        url: 'http://localhost/token/app'
      };
  
      request.get(options, (err, res) => {
        if (err) {
          message.react('❌');
          message.channel.send('Error al iniciar sesión.');
        }
        message.react('✅');
      });
    }
  }
});

discordClient.login(process.env.DISCORD_TOKEN);