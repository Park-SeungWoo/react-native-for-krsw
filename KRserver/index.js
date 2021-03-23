const express = require('express');
require('dotenv').config();
const app = express();

app.use(express.json());

app.get('/', (req, res, next) => {
  console.log('ip : ', req.ip);
  res.send('Hi my server!');
});

app.post('/userinfo', (req, res, next) => {
  console.log('/userinfo => ip : ', req.ip);
  const id = req.body.id;
  const pw = req.body.pw;
  console.log(req.body);
  res.send({id: id, pw: pw});
});

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server is listening at ${process.env.HOST}:${process.env.PORT}`);
});
