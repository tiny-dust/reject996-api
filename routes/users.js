const express = require('express');
const {
  sendEmail,
  getT,
} = require('../utils/email');

const router = express.Router();

router.get('/getCode', async (req, res) => {
  let codeStr = ''; // 验证码
  const codeLen = 6; // 验证码长度
  for (let i = 0; i < codeLen; i += 1) {
    codeStr += Math.floor(Math.random() * 10);
  }
  const mail = {
    from: 'idioticzhou@foxmail.com', // 发件邮箱
    subject: '验证码',
    to: req.query.email, // 收件邮箱
    html: getT(codeStr),
  };
  const emailRes = await sendEmail(mail);
  res.send = {
    code: 200,
    data: emailRes.info,
    msg: 'success',
  };
});

router.get('/demo', async (req, res) => {
  res.send = {
    code: 200,
    data: '',
    msg: 'success',
  };
});

module.exports = router;
