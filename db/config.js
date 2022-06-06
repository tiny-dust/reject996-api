const {
  createClient,
} = require('redis');
const mysql = require('mysql2');
const config = require('./config.json');

const connection = mysql.createConnection({
  // host: '127.0.0.1',
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  // database: 'reject-996-bat',
});

class Redis {
  client;

  constructor() {
    this.client = createClient({
      socket: {
        host: config.redis.host,
      },
      password: config.redis.password,
    });
    this.client.on('error', (err) => console.log('Redis Client Error', err));
    this.client.connect();
  }

  set(key, value) {
    this.client.setEx(key, 60, value);
    return { [key]: value };
  }

  async get(key) {
    const value = await this.client.get(key);
    return value;
  }

  remove(key) {
    this.client.del(key);
  }

  close() {
    this.client.disconnect();
  }
}

const redis = new Redis();

module.exports = {
  connection,
  redis,
};
