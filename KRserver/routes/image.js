const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');
const router = express.Router();
const user = require('../schemas/user');
const album = require('../schemas/album');
const albumimg = require('../schemas/albumimg');
const mongoose = require('mongoose');
const {update} = require('../schemas/user');
const Albumimg = mongoose.model('albumimg');
require('dotenv').config();

router.use(express.json());
router.use(morgan('dev'));

const s3 = new aws.S3({
  accessKeyId: process.env.S3_KEYID,
  secretAccessKey: process.env.S3_PRIVATE_KEY,
  region: process.env.REGION,
});

// multer s3 - avartar
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AVARTARBUCKET,
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(
        null,
        `avartar/${Math.floor(
          Math.random() * 1000,
        )}${Date.now()}.${path.extname(file.originalname)}`,
      );
    },
  }),
});

// set avartar
router.post('/set', upload.single('img'), (req, res, next) => {
  console.log(req.file.location);
  const {userid, userpw} = req.body;
  user.updateOne(
    {id: userid, password: userpw},
    {$set: {avartar: req.file.location}},
    (err, res) => {
      console.log('update avartar : ' + JSON.stringify(res));
    },
  ); // save img domain to db
  console.log('success');
  res.json({status: true, url: req.file.location});
});

router.post('/get', (req, res, next) => {
  const {id, name} = req.body;
  user.find(
    {
      id: id,
      name: name,
    },
    (err, user) => {
      if (!err) {
        res.json({data: user[0].avartar});
      }
    },
  );
});

router.patch('/setori', (req, res) => {
  const {id, pw} = req.body;
  const query = {
    id: id,
    password: pw,
  };
  const updatequery = {
    $set: {
      avartar:
        'https://krapp-bucket.s3.ap-northeast-2.amazonaws.com/blank-profile-picture-973460_1280.png',
    },
  };
  user.updateOne(query, updatequery, (err, result) => {
    if (!err) {
      console.log('set avartar to original : ' + JSON.stringify(result));
      res.json({
        status: true,
        url:
          'https://krapp-bucket.s3.ap-northeast-2.amazonaws.com/blank-profile-picture-973460_1280.png',
      });
    } else {
      res.json({status: false});
    }
  });
});

// album method
router.post('/addalbum', (req, res) => {
  const {roomname, albumobj, changedid, secchangedid} = req.body;
  const albumid = albumobj.albumid;
  const query = {
    roomname: roomname,
  };
  // add album in albumimg
  const albumimg = new Albumimg({
    albumid: albumid,
    images: [],
    changedimg: secchangedid,
  });
  albumimg.save();
  // add album in album
  album.find(query, (err, data) => {
    let newalbum = data[0].albums;
    newalbum[albumid] = albumobj;
    const updatequery = {
      $set: {
        albums: newalbum,
        changedalbum: changedid,
      },
    };
    album.updateOne(query, updatequery, (err, result) => {
      if (!err) console.log(`add album : ${JSON.stringify(result)}`);
      else console.log(err);
    });
  });
  res.redirect('/');
});

router.post('/deletealbum', (req, res) => {
  const {roomname, albumid, changedid} = req.body;
  const query = {
    roomname: roomname,
  };
  console.log(albumid);
  // have to delete album in albumimg
  albumimg.deleteOne({albumid: albumid}, (err, result) =>
    console.log(`delete album in albumimgs : ${JSON.stringify(result)}`),
  );
  // delete album in album
  album.find(query, (err, data) => {
    let newalbum = data[0].albums;
    delete newalbum[albumid];
    const updatequery = {
      $set: {
        albums: newalbum,
        changedalbum: changedid,
      },
    };
    album.updateOne(query, updatequery, (err, result) => {
      if (!err)
        console.log(`delete album in albums : ${JSON.stringify(result)}`);
      else console.log(err);
    });
  });
  res.redirect('/');
});

router.get('/getalbum', (req, res) => {
  const {roomname} = req.query;
  album.find({roomname: roomname}, (err, data) => {
    if (!err) {
      res.json({
        status: true,
        albums: data[0].albums,
        changedid: data[0].changedalbum,
      });
    } else res.json({status: false});
  });
});

// images in album
// multer s3 - album image
const uploadimg = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'krapp-bucket',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(
        null,
        `albumimgs/${Math.floor(
          Math.random() * 1000,
        )}${Date.now()}.${path.extname(file.originalname)}`,
      );
    },
  }),
});

router.post('/addimage', uploadimg.single('img'), (req, res) => {
  const {data, albumid, roomname} = req.body;
  const findq = {
    albumid: albumid,
  };
  albumimg.find(findq, (err, data) => {
    const albumd = data[0];
    if (albumd.images.length == 0) {
      const findaq = {
        roomname: roomname,
        // 'albums.albumid': albumid,
      };
      album.find(findaq, (err, dataa) => {
        let albumD = dataa[0];
        albumD.albums[albumid].thumbnail = req.file.location;
        const updateaq = {
          albums: albumD.albums,
        };
        album.updateOne(findaq, updateaq, (err, result) => {
          console.log(`set thumbnail : ${JSON.stringify(result)}`);
        });
      });
    }
  });
  let imagedata = JSON.parse(data);
  imagedata.url = req.file.location;
  const query = {
    albumid: albumid,
  };
  const updatequery = {
    $push: {images: imagedata},
  };
  albumimg.updateOne(query, updatequery, (err, result) => {
    console.log(`add images to albumid=${albumid} : ${JSON.stringify(result)}`);
  });

  res.redirect('/');
});

router.get('/getimages', (req, res) => {
  const {albumid} = req.query;
  albumimg.find({albumid: albumid}, (err, data) => {
    if (!err) res.json({status: true, data: data[0]});
    else res.json({status: false});
  });
});

router.patch('/saved', (req, res) => {
  const {albumid, imageid} = req.body;
  const query = {
    albumid: albumid,
    'images.imageid': imageid,
  };
  const updatequery = {
    $set: {
      'images.$.saved': true,
    },
  };
  albumimg.updateOne(query, updatequery, (err, result) => {
    console.log(`image saved : ${JSON.stringify(result)}`);
  });
  res.redirect('/');
});

router.get('/removeimg', (req, res) => {
  const {albumid, imageid, idx} = req.query;
  const query = {
    albumid: albumid,
    'images.imageid': imageid,
  };
  const updatequery = {
    $pull: {
      images: {imageid: imageid},
    },
  };
  albumimg.updateOne(query, updatequery, (err, result) => {
    console.log(`image deleted : ${JSON.stringify(result)}`);
  });
  res.redirect('/');
});

module.exports = router;
