const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path'); // 解析 token 的中间件

const privateKey = fs.readFileSync(path.join(__dirname, '../rsa/private_key.pem'));
const publicKey = fs.readFileSync(path.join(__dirname, '../rsa/public_key.pem'));
exports.createToken = (email, id) => {
  const payload = {
    id,
    email,
  };
  const options = {
    expiresIn: '10h',
    algorithm: 'RS256',
  };
  return jwt.sign(
    payload,
    privateKey,
    options,
  );
};

exports.parseToken = (token) => {
  const res = jwt.verify(token, publicKey);
  console.log('res: ', res);
};
