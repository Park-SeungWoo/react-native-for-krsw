const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const nodemailer = require('nodemailer'); // to send verification code to email
const ejs = require('ejs'); // for sending ejs form to email
const user = require('../../schemas/user');
const {EMAIL, EMAILPW} = process.env;

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
router.get('/getcode', async (req, res, next) => {
  const targetemail = req.query.email;
  let emailtemplete;

  ejs.renderFile(
    './forms/emailform.ejs',
    {authcode1: '0', authcode2: '9', authcode3: '2', authcode4: '7'},
    function (err, data) {
      if (err) console.log(err);
      else emailtemplete = data;
    },
  );

  // send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: EMAILPW,
    },
  });

  const option = {
    from: EMAIL,
    to: targetemail,
    subject: '비밀번호 변경을 위한 인증번호를 입력해주세요.',
    html: emailtemplete,
  };

  transporter.sendMail(option, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Finish sending email : ' + info.response);
    }
    transporter.close();
  });
  res.redirect('/');
});

// verificate code
router.get('/valcode', (req, res, next) => {
  if (req.query.code == '0927') {
    res.send(true);
  } else {
    res.send(false);
  }
});

router.patch('/changepw', (req, res, next) => {
  user.updateOne(
    {email: req.body.email},
    {$set: {password: req.body.pw}},
    (err, status) => {
      if (err) {
        console.log(err);
        res.json({access: false});
      } else {
        res.json({access: true});
      }
    },
  );
});

module.exports = router;
