const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Lead = require('../modal/Lead')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('File received:', req.file); // Log file information for debugging

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const startTime = Date.now();

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', async (data) => {
        console.log('Parsed row:', data); // Log each parsed row
        try {
          const leadData = {}; // Initialize an empty object to store lead data
          for (const key in data) {
            leadData[key] = data[key];
          }
          await Lead.create(leadData);
        } catch (error) {
          console.error(`Error saving lead: ${error.message}`);
        }
      })
      .on('end', () => {
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        console.log(`File processing completed in ${elapsedTime} ms`);

        fs.unlinkSync(req.file.path); // Delete the uploaded file after processing

        res.send('File uploaded and data saved');
      })
      .on('error', (error) => {
        console.error('CSV processing error:', error.message);
        res.status(500).send('Error processing CSV');
      });

    // Timeout to handle processing time
    setTimeout(() => {
      console.error('File processing took longer than one minute');
      res.status(500).send('File processing took longer than one minute');
    }, 6000000); // One minute timeout
  } catch (error) {
    console.error(`Error uploading file: ${error.message}`);
    res.status(500).send('Error uploading file');
  }
});

router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    console.error(`Error fetching leads: ${error.message}`);
    res.status(500).send('Error fetching leads');
  }
});

router.put('/move/:id', async (req, res) => {
  const { id } = req.params;
  const { newStatus, assignedto } = req.body;

  if (!newStatus && !assignedto) {
    return res.status(400).send('New status or assignedto field is required');
  }

  try {
    const updateFields = {};

    if (newStatus) {
      updateFields.status = newStatus;
    }

    if (assignedto) {
      updateFields.assignedto = assignedto;
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedLead) {
      return res.status(404).send('Lead not found');
    }

    res.json(updatedLead);
  } catch (error) {
    console.error(`Error updating lead: ${error.message}`);
    res.status(500).send('Error updating lead');
  }
});

router.delete('/delete', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return res.status(404).send('Lead not found');
    }

    res.json({ message: 'Lead deleted successfully', lead: deletedLead });
  } catch (error) {
    console.error(`Error deleting lead: ${error.message}`);
    res.status(500).send('Error deleting lead');
  }
});

router.post('/create', async (req, res) => {
  try {
    const { name, email, number, status, title, assignedto } = req.body;

    if (!name || !email || !number) {
      return res.status(400).send('Name, email, and number are required.');
    }

    const newLead = new Lead({
      name,
      email,
      number,
      status,
      title,
      assignedto,
    });

    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    console.error(`Error creating lead: ${error.message}`);
    res.status(500).send('Error creating lead');
  }
});


module.exports = router;
