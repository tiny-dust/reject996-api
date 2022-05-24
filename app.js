const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const usersRouter = require('./routes/users');
const companyRouter = require('./routes/company');

const privateKey = fs.readFileSync(path.join(__dirname, './rsa/private_key.pem'));
const limiter = rateLimit({
  windowMs: 1 * 1000,
  max: 5,
  standardHeaders: true, // 在 `RateLimit-*` 标头中返回速率限制信息
  legacyHeaders: false, // 禁用 `X-RateLimit-*` 标头
});
const userLimit = rateLimit({
  windowMs: 60 * 1000, // 1m
  max: 2, // 将每个 IP 限制为每个 `window` 2 个请求（此处为每 1m)
  standardHeaders: true, // 在 `RateLimit-*` 标头中返回速率限制信息
  legacyHeaders: false, // 禁用 `X-RateLimit-*` 标头
});
const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/company', limiter);
app.use('/users', userLimit);

app.use('/company', companyRouter);
app.use('/users', usersRouter);

app.use(jwt({
  secret: privateKey,
  algorithms: ['RS256'],
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.token) {
      return req.headers.token;
    }
    return null;
  },
}).unless({
  path: ['users'],
}));

// catch 404 and forward to error handler
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.send({
      code: 401,
      message: 'invalid token...',
      data: '',
    });
  } else {
    next(err);
  }
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
