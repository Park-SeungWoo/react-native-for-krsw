const express = require('express');
const morgan = require('morgan'); // for log
const mongoose = require('mongoose');
const router = express.Router();
require('../../schemas/user');
let Users = mongoose.model('user');

mongoose.connect(
  process.env.DBADDR,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  err => {
    if (err) {
      console.log('Mongodb connection failed : ', err);
    } else {
      console.log('Successfully connected to Mongodb!!');
    }
  },
);

router.use(express.json());
router.use(morgan('dev'));

router.post('/add', (req, res, next) => {
  const userinfo = req.body;
  console.log(userinfo);
  // 계정 중복 검사 등 여러가지 처리 후 성공: true, 실패: false
  let user = new Users({
    name: userinfo.name,
    phonenum: userinfo.phnum,
    birthday: new Date(),
    id: userinfo.id,
    password: userinfo.pw,
  });
  try {
    user.save();
    console.log('saved!');
    res.json({access: true});
  } catch (e) {
    console.log(e);
    res.json({access: false});
  }
});

router.post('/dupChk', (req, res, next) => {
  const id = req.body;

  // db 연결 후 중복 검사로 바꾸기
  if (id.id.length >= 8) {
    res.send(true);
  } else {
    res.send(false);
  }
});

module.exports = router;
