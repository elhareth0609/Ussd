const Pusher = require('pusher-js');

const pusher = new Pusher('f513c6dba43174cbee4d', {
  cluster: 'eu',
  encrypted: true
});

const channel = pusher.subscribe('Mychannel');
channel.bind('Myevent', function(data) {
  console.log('Received data:', data);
  // Handle the data in your `server.exe` application
});
