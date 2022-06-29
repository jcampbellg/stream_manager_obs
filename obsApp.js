import OBSWebSocket from 'obs-websocket-js';
const obs = new OBSWebSocket();

// Declare some events to listen for.
obs.on('ConnectionOpened', () => {
  console.log('Connection Opened');

  // obs.sendCallback('GetSceneList', {}, (err, data) => {
  //   console.log('Using callbacks:', err, data);
  // });

  // obs.send('GetSceneList').then(data => {
  //   console.log('Using promises:', data);
  // });

  obs.send('SetVolume', { source: 'MIC', volume: 0});
  obs.send('SetVolume', { source: 'Desktop', volume: 0});
  obs.send('SetCurrentScene', {'scene-name': 'Starting' }).catch(err => { console.log(err); });
});

// obs.on('SwitchScenes', data => {
//   console.log('SwitchScenes', data);
// });

obs.connect();

export default obs;