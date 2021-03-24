const express = require('express');
const morgan = require('morgan'); // for log
const router = express.Router();

router.use(express.json());
router.use(morgan('dev'));

router.post('/add', (req, res, next) => {
  const id = req.body.id;
  const pw = req.body.pw;

  // 비밀번호 보안 수칙 (길이 >= 8, 영어 대or소문자, 특수문자1개)
  reg = /^((?=.*?[A-Z])|(?=.*?[a-z]))(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;
  if (reg.test(pw) == false) {
    res.json({access: false});
  } else {
    res.json({access: true});
  }
});

module.exports = router;
