const express = require('express');
const morgan = require('morgan'); // for log
const router = express.Router();
const relation = require('../schemas/relation');

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

module.exports = router;
