require('dotenv').config();
const amqp = require('amqplib');
const PlaylistSongsService = require('./PlaylistSongsService');
const MailSender = require('./MailSender');
const Listener = require('./listener');
const config = require('./utils/config');

async function init() {
  const playlistSongsService = new PlaylistSongsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistSongsService, mailSender);

  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();
  await channel.assertQueue('export:playlistSongs', { durable: true });
  channel.consume('export:playlistSongs', listener.listen, { noAck: true });
}

init();
