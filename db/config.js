const {
  createClient,
} = require('redis');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  // host: '127.0.0.1',
  host: '150.158.181.254',
  user: 'root',
  password: 'Zxcvb931224?',
  database: 'reject996',
});

class Redis {
  client;

  constructor() {
    this.client = createClient({
      socket: {
        host: '150.158.181.254',
      },
      password: 'zxcvb931224',
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
