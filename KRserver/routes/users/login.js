const express = require('express');
const morgan = require('morgan'); // for log
const router = express.Router();

router.use(express.json());
router.use(morgan('dev'));

// validate id, pw
router.get('/validate', (req, res, next) => {
  // db에 id 존재 여부 확인
  console.log(res.body);
  res.send(true);
});

module.exports = router;
