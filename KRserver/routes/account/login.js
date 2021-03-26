const express = require('express');
const morgan = require('morgan'); // for log
const router = express.Router();
const user = require('../../schemas/user');

router.use(express.json());
router.use(morgan('dev'));

// validate id, pw
router.post('/validate', (req, res, next) => {
  user.find({id: req.body.id}, (err, user) => {
    if (user.length == 0) res.json({login: false, iderr: true});
    // id is not exsist in db
    else {
      if (req.body.pw == user[0].password)
        res.json({login: true, userdata: user[0]});
      // access approved
      else res.json({login: false, iderr: false}); // password error
    }
  });
});

module.exports = router;
