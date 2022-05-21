const Nodemailer = require('nodemailer');

const config = {
  host: 'smtp.qq.com',
  port: 465,
  secure: false,
  secureConnection: true,
  service: 'qq',
  auth: {
    user: 'idioticzhou@foxmail.com', // 发件账号
    pass: 'sdbnawrutuvfebcj', // 发件邮箱授权码
  },
  rejectUnauthorized: false,
};
const transport = Nodemailer.createTransport(config);

const sendEmail = async (mail) => {
  const res = {};
  const startTime = new Date().getTime();
  return new Promise((resolve) => {
    transport.sendMail(mail, (err, info) => {
      res.err = err;
      res.info = info;
      console.log(new Date().getTime() - startTime, 'ms');
      resolve(res);
    });
  });
};

const getT = (code) => `<head>
  <base target="_blank" />
  <style type="text/css">
    ::-webkit-scrollbar {
      display: none;
    }

  </style>
  <style id="cloudAttachStyle" type="text/css">
    #divNeteaseBigAttach,
    #divNeteaseBigAttach_bak {
      display: none;
    }

  </style>
  <style id="blockquoteStyle" type="text/css">
    blockquote {
      display: none;
    }

  </style>
  <style type="text/css">
    body {
      font-size: 14px;
      font-family: arial, verdana, sans-serif;
      line-height: 1.666;
      padding: 0;
      margin: 0;
      overflow: auto;
      white-space: normal;
      word-wrap: break-wor d;
      min-height: 100px
    }

    td,
    input,
    button,
    select,
    body {
      font-family: Helvetica, 'Microsoft Yahei', verdana
    }

    pre {
      white-space: pre-wrap;
      white-space: -moz-pre-wrap;
      white-space: -pre-wrap;
      white-space: -o-pre-wrap;
      word-wrap: break-word;
      width: 95%
    }

    th,
    td {
      font-family: arial, verdana, sans-serif;
      line-height: 1.666
    }

    img {
      border: 0
    }

    header,
    footer,
    section,
    aside,
    article,
    nav,
    hgroup,
    figure,
    figcaption {
      display: block
    }

    blockquote {
      margin-right: 0px
    }

  </style>
</head>

<body tabindex="0" role="listitem">
  <table width="700" border="0" align="center" cellspacing="0" style="width:700px;">
    <tbody>
      <tr>
        <td>
          <div style="width:700px;margin:0 auto;border-bottom:1px solid #ccc;margin-bottom:30px;">
            <table border="0" cellpadding="0" cellspacing="0" width="700" height="39"
              style="font:12px Tahoma, Arial, 宋体;">
              <tbody>
                <tr>
                  <td width="210"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="width:680px;padding:0 10px;margin:0 auto;">
            <div style="line-height:1.5;font-size:14px;margin-bottom:25px;color:#4d4d4d;">
              <strong style="display:block;margin-bottom:15px;">尊敬的⽤户：<span
                  style="color:#f60;font-size: 16px;"></span>您好！</strong>
              <strong style="display:block;margin-bottom:15px;">
                您正在进⾏<span style="color: red">注册账号</span>操作，请在验证码输⼊框中输⼊：<span style="color:#f60;font-size: 24px">${code}
                  </sp an>，以完成操作。
              </strong>
            </div>
            <div style="margin-bottom:30px;">
              <small style="display:block;margin-bottom:20px;font-size:12px;">
                <p style="color:#747474;">
                  注意：此操作可能会修改您的密码、登录邮箱或绑定⼿机。如⾮本⼈操作，请及时登录并修改密码以保证帐户安全
                  <br>（⼯作⼈员不会向你索取此验证码，请勿泄漏！)
                </p>
              </small>
            </div>
          </div>
          <div style="width:700px;margin:0 auto;">
            <div
              style="padding:10px 10px 0;border-top:1px solid #ccc;color:#747474;margin-bottom:20px;line-height:1.3em;font-size:12px;">
              <p>此为系统邮件，请勿回复<br>
                请保管好您的邮箱，避免账号被他⼈盗⽤
              </p>
              <p>小卷村⽹络科技团队</p>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</body>
`;

module.exports = {
  sendEmail,
  getT,
};
