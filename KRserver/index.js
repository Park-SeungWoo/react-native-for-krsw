const express = require('express');
require('dotenv').config();
const app = express();

// router
const login = require('./routes/users/login');
const register = require('./routes/users/register');

app.use('/login', login);
app.use('/register', register);

// listen
app.listen(process.env.PORT || 3000, process.env.HOST, () => {
  console.log(
    `Server is listening at ${process.env.HOST}:${process.env.PORT || 3000}`,
  );
});

app.use(function (err, req, res, next) {
  res.json({mes: err.message});
});
