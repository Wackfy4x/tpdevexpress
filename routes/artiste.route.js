const express = require('express');
let router = express.Router();
const artisteserv = require('../service/artiste.service');

const multer  = require('multer');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: function(req, file, cb) {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const mimeType = allowedTypes.test(file.mimetype);
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
      if (mimeType && extname) {
        return cb(null, true);
      }
      cb(new Error('Seuls les fichiers images sont autorisés'));
    }
  });


router.get('/', async function(req, res, next) {
    try {
        res.json(await artisteserv.findAll(req.query.page));
    } catch(err) {
        console.error(`error while getting students`, err.message);
        next(err)
    }
})
router.get('/id', async function(req, res, next) {
    try {
        res.json(await artisteserv.findById(req.query.id));
    } catch(err) {
        console.error(`error while getting students`, err.message);
        next(err)
    }
})

router.post('/', upload.single("image"), async function(req, res, next) {
    try {
        console.log(req.file)
        
        const artistData = {
            ...req.body,
            image: req.file ? `/uploads/${req.file.filename}` : null,
        };
        // console.log(req.file)
        console.log(artistData.image)
        res.json(await artisteserv.create(artistData));
    } catch(err) {
        console.error(`error while creating student`, err.message);
        next(err);
    }
})

router.post('/network', async function(req, res, next) {
    try {
        res.json(await artisteserv.createnetwork(req.body));
    } catch(err) {
        console.error(`error while creating student`, err.message);
        next(err);
    }
})

router.delete('/', async function(req, res, next) {
    try {
        res.json(await artisteserv.deletea(req.query.id));
    } catch(err) {
        console.error(`error while deleting student`, err.meaage);
        next(err);
    }
})

router.put('/', upload.single("image"), async function(req, res, next) {
    try {
        console.log(req.file)
        
        const artistData = {
            ...req.body,
            image: req.file ? `/uploads/${req.file.filename}` : null,
        };
        // console.log(req.file)
        console.log(artistData.image)
        res.json(await artisteserv.update(req.query.id, artistData));
    } catch(err) {
        console.error(`error while creating student`, err.message);
        next(err);
    }
})

module.exports = router;