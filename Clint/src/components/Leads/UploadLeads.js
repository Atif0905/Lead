// src/components/UploadLeads.js
import React, { useState } from 'react';
import axios from 'axios';

const UploadLeads = () => {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    console.log('Selected file:', event.target.files[0]); 
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please upload a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]); 
    }

    try {
      const response = await axios.post('http://localhost:5000/leads/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      alert('File uploaded and data saved');
    } catch (error) {
      console.error('Error uploading leads:', error);
      alert('Error uploading leads');
    }
  };

  return (
    <div>
      <h2>Upload Leads</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <button onClick={handleUpload}>Upload Leads</button>
    </div>
  );
};

export default UploadLeads;
