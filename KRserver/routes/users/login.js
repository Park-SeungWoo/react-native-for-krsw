const express = require('express');
const morgan = require('morgan'); // for log
const router = express.Router();
const user = require('../../schemas/user');

router.use(express.json());
router.use(morgan('dev'));

// validate id, pw
router.post('/validate', (req, res, next) => {
  user.find({id: req.body.id}, (err, user) => {
    if (req.body.pw == user[0].password) res.send(true);
    else res.send(false);
  });
});

module.exports = router;
