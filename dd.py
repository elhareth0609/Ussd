import pusher

pusher_client = pusher.Pusher(
  app_id='1811895',
  key='f513c6dba43174cbee4d',
  secret='2bbacab454b65e5fb24e',
  cluster='eu',
  ssl=True
)

pusher_client.trigger('Mychannel', 'Myevent', {'message': 'hello world'})
