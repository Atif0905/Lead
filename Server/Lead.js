const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Lead = require('./Lead');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
}); 

const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const lead of results) {
        const { name, email } = lead;
        try {
          await Lead.create({ name, email });
        } catch (error) {
          console.error(`Error creating lead: ${error.message}`);
        }
      }
      res.send('File uploaded and data saved');
    });
});

router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.put('/:id', async (req, res) => {
  const { status, assignedto } = req.body;
  try {
    await Lead.findByIdAndUpdate(req.params.id, { status, assignedto });
    res.send('Lead status updated');
  } catch (error) {
    res.status(500).send('Server error');
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.send('Lead deleted');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
