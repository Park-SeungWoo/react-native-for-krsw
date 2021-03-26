const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const user = require('../../schemas/user');

router.use(express.json());
router.use(morgan('dev'));

// find user id
router.get('/findid', (req, res, next) => {
  user.find({name: req.body.name, phonenum: req.body.phnum}, (err, user) => {
    console.log(user);
  });
});

// find user pw by id
router.get('/idexist', (req, res, next) => {
  user.find({id: req.query.id}, (err, user) => {
    if (user.length == 0) {
      res.json({access: false, errmes: 'id가 존재하지 않습니다.'});
    } else {
      res.json({access: true, username: user[0].name});
    }
  });
});

// validate email
router.get('/valemail', (req, res, next) => {
  user.find({id: req.query.id, email: req.query.email}, (err, user) => {
    if (user.length == 0) {
      res.json({
        access: false,
        mes: '회원가입시 사용하신 이메일과 일치하지 않습니다.',
      });
    } else {
      res.json({access: true, mes: '사용자 확인 되었습니다.'});
    }
  });
});

// send code to email address
router.get('/getcode', (req, res, next) => {
  const email = req.query.email;
  // add send code method
  console.log(email);
});

module.exports = router;
