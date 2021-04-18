const express = require('express');
const morgan = require('morgan'); // for log
const router = express.Router();
const relation = require('../schemas/relation');
const temprelation = require('../schemas/temprelation');
const mongoose = require('mongoose');
const Relation = mongoose.model('relation');
const Temprelation = mongoose.model('temprelation');
const Chats = mongoose.model('chat');

router.use(express.json());
router.use(morgan('dev'));

// find if someone is a couple
router.get('/find', (req, res, next) => {
  relation.find({persons: {$in: [req.query.id]}}, (err, user) => {
    if (err) res.send(err);
    else if (user.length != 0) {
      console.log(user);
      res.send(user[0]);
    } else res.send(false);
  });
});

router.get('/reqorres', (req, res, next) => {
  const {id} = req.query;
  temprelation.find({reqid: id}, (err, user) => {
    if (err) res.json({data: err});
    else if (user.length != 0) res.json({data: 'reqid'});
    else {
      temprelation.find({resid: id}, (err, user) => {
        if (err) res.json({data: err});
        else if (user.length != 0) res.json({data: 'resid'});
        else res.json({data: false});
      });
    }
  });
});

router.post('/add', (req, res, next) => {
  const {reqid, reqname, resid, resname, startdate} = req.body;
  relation.find({persons: {$in: [resid]}}, async (err, user) => {
    if (err) res.json({status: false, data: err});
    else if (user.length != 0) {
      res.json({status: false, data: '이미 등록되어 있는 사용자입니다.'});
    } else {
      temprelation.find({resid: reqid}, (err, user) => {
        if (err) res.json({status: false, data: err});
        else if (user.length != 0) res.json({status: true, data: false});
        else {
          const temprelation = new Temprelation({
            reqid: reqid,
            reqname: reqname,
            resid: resid,
            resname: resname,
            startdate: startdate,
          });
          temprelation.save();
          res.json({status: true, data: true});
        }
      });
    }
  });
});

router.get('/gettemp', (req, res, next) => {
  const {id} = req.query;
  temprelation.find({resid: id}, (err, user) => {
    if (err) res.json({status: false});
    else {
      res.json({status: true, data: user});
    }
  });
});

router.get('/gettempr', (req, res, next) => {
  const {id} = req.query;
  temprelation.find({reqid: id}, (err, user) => {
    if (err) res.json({status: false});
    else {
      res.json({status: true, data: user});
    }
  });
});

router.post('/addrelation', (req, res, next) => {
  const {persons, startdate, roomname, firstp, secondp} = req.body;
  const data = new Relation({
    persons: persons,
    firstp: firstp,
    secondp: secondp,
    startdate: startdate,
    roomname: roomname,
    nicknames: [firstp, secondp],
  });
  const chatting = new Chats({
    roomname: roomname,
    chat: new Array(),
  });
  data.save();
  chatting.save();
  res.redirect('/');
});

router.delete('/deletetemp', (req, res, next) => {
  const {id} = req.body;
  console.log(id);
  temprelation.deleteMany({resid: id}, err => {
    console.log(err);
  });
  res.redirect('/');
});

module.exports = router;
