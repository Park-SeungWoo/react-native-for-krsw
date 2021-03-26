const express = require('express');
const morgan = require('morgan'); // for log
const router = express.Router();
const mongoose = require('mongoose');
const user = require('../../schemas/user');
// require('../../schemas/user');
let Users = mongoose.model('user');

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
  const data = req.body;

  if (data.id.length >= 8) {
    user.find({id: data.id}, (err, user) => {
      if (user.length != 0) {
        // dupicated id
        res.json({access: false, err: 'id가 중복되었습니다.'});
      } else {
        // unique id
        res.json({access: true});
      }
    });
  } else if (data.id.length == 0) {
    res.json({access: false, err: 'id를 입력해주세요.'});
  } else {
    res.json({access: false, err: 'id는 8자 이상 설정 가능합니다.'});
  }
});

module.exports = router;
