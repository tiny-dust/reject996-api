const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const {
  expressjwt: jwt,
} = require('express-jwt');
const fs = require('fs');
const usersRouter = require('./routes/users');
const companyRouter = require('./routes/company');

const privateKey = fs.readFileSync(path.join(__dirname, './rsa/private_key.pem'));

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
