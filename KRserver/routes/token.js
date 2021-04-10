const express = require('express');
const morgan = require('morgan'); // for log
const router = express.Router();
const user = require('../schemas/user');

router.use(express.json());
router.use(morgan('dev'));

// validate id, pw
router.patch('/change', (req, res, next) => {
  const {id, token} = req.body;
  user.updateOne({id: id}, {$set: {token: token}}, (err, status) => {
    if (err) res.send(false);
    else res.send(true);
  });
});

module.exports = router;
