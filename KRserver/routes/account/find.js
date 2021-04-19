const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const nodemailer = require('nodemailer'); // to send verification code to email
const ejs = require('ejs'); // for sending ejs form to email
const user = require('../../schemas/user');
const otp = require('../../schemas/otp');
const mongoose = require('mongoose');
const OTPS = mongoose.model('otp');
const {EMAIL, EMAILPW} = process.env;

router.use(express.json());
router.use(morgan('dev'));

// find user id
router.get('/findid', (req, res, next) => {
  const targetemail = req.query.email;
  user.find({name: req.query.name, email: targetemail}, (err, user) => {
    if (user.length == 0) {
      res.send(false);
    } else {
      res.send(true);
      console.log(user);
      // render email content
      ejs.renderFile(
        './forms/emailformid.ejs',
        {UserId: `${user[0].id}`, UserName: `${user[0].name}`},
        function (err, data) {
          if (err) console.log(err);
          else emailtemplete = data;
        },
      );

      // send user id to user's email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: EMAIL,
          pass: EMAILPW,
        },
      });

      // set email content
      const option = {
        from: EMAIL,
        to: targetemail,
        subject: '계정 아이디를 확인해주세요!',
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
    }
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
  const targetid = req.query.id;
  let emailtemplete;
  let code = new Array();

  // create code
  code.push(Math.floor((Math.random() * 10).toString()));
  code.push(Math.floor((Math.random() * 10).toString()));
  code.push(Math.floor((Math.random() * 10).toString()));
  code.push(Math.floor((Math.random() * 10).toString()));

  // save code in db temporarilly
  otp.find({email: targetemail, id: targetid}, (err, data) => {
    if (data.length == 1) {
      otp.updateOne(
        {email: targetemail, id: targetid},
        {$set: {code: code.join('')}},
        (err, status) => {
          if (err) console.log('set code err');
          else
            console.log(`${targetid} ${targetemail} code => ${code.join('')}`);
        },
      );
    } else {
      const otpdata = new OTPS({
        email: targetemail,
        id: targetid,
        code: code.join(''),
      });
      try {
        otpdata.save();
        console.log('success add otp', targetid, targetemail, code.join(''));
      } catch (e) {
        console.log(e);
      }
    }
  });

  // render email form
  ejs.renderFile(
    './forms/emailformcode.ejs',
    {
      authcode1: code[0],
      authcode2: code[1],
      authcode3: code[2],
      authcode4: code[3],
    },
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
  otp.findOne({id: req.query.id}, (err, user) => {
    if (user.code == req.query.code) {
      otp.deleteOne({id: req.query.id, code: req.query.code}, (err, data) => {
        if (err) console.log(err);
      });
      res.send(true);
    } else res.send(false);
  });
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
