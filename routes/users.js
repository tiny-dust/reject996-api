const dayjs = require('dayjs');
const express = require('express');
const {
  sendEmail,
  getT,
} = require('../utils/email');
const {
  connection, redis,
} = require('../db/config');
const { createToken } = require('../utils/jwt');

const router = express.Router();

router.get('/getCode', async (req, resp) => {
  let codeStr = ''; // 验证码
  const codeLen = 6; // 验证码长度
  for (let i = 0; i < codeLen; i += 1) {
    codeStr += Math.floor(Math.random() * 10);
  }
  redis.set(codeStr, req.query.email);
  const mail = {
    from: 'idioticzhou@foxmail.com', // 发件邮箱
    subject: '验证码',
    to: req.query.email, // 收件邮箱
    html: getT(codeStr),
  };
  const emailRes = await sendEmail(mail);
  resp.send({
    code: 200,
    data: emailRes.info,
    msg: 'success',
  });
});

router.post('/register', async (req, resp) => {
  const { email, password, code } = req.body;
  const checkCode = await redis.get(code);
  if (email !== checkCode) {
    resp.send({
      code: 220,
      msg: '验证码错误',
      data: '',
    });
    redis.remove(email);
    return;
  }
  if (email !== '' && password !== '') {
    const searchSql = `select count(*) from user where email = '${email}'`;
    connection.query(searchSql, (err, res) => {
      if (err) {
        resp.send(err);
        return;
      }
      if (res[0]['count(*)'] === 0) {
        const sql = `insert into user (email, password,createTime) values('${email}','${password}','${dayjs().format('YYYY-MM-DD HH:mm:ss')}')`;
        connection.query(sql, (error, r) => {
          if (error) {
            resp.send(error);
            return;
          }
          resp.send({
            code: 200,
            msg: 'success',
            data: r,
          });
        });
      } else {
        resp.send({
          code: 403,
          msg: '邮箱已注册',
          data: '',
        });
      }
    });
  } else {
    resp.send({
      code: 403,
      data: '',
      msg: '邮箱或密码不能为空',
    });
  }
});

router.post('/login', (req, resp) => {
  const { email, password } = req.body;
  const sql = `select password, id from user where email = '${email}'`;
  connection.query(sql, (err, r) => {
    if (err) {
      resp.send(err);
      return;
    }
    if (r.length === 0) {
      resp.send({
        code: 202,
        message: '查无此人',
        data: '',
      });
      return;
    }
    if (r[0].password === password) {
      const token = createToken(email, r[0].id);
      resp.send({
        code: 200,
        msg: 'success',
        data: {
          token,
          email,
          userId: r[0].id,
        },
      });
    } else {
      resp.send({
        code: 403,
        message: '密码错误',
        data: '',
      });
    }
  });
});

router.get('/intro', async (req, resp) => {
  const sql = 'select intro from intro order by id desc limit 1';
  connection.query(sql, (err, r) => {
    if (err) {
      resp.send(err);
      return;
    }
    resp.send({
      code: 200,
      msg: 'success',
      data: r[0].intro,
    });
  });
});

module.exports = router;
