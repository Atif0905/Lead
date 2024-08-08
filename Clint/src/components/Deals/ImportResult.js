import React, { useState } from 'react';
import axios from 'axios';
import './Deals.css'

export default function ImportResult() {
    const [fileType, setFileType] = useState('xlsx');
    const [file, setFile] = useState(null);
  
    const handleRadioChange = (event) => {
      setFileType(event.target.value);
    };
  
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
      <>
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-12 p-3'>
                    <form>
                        <p>Choose file format for export</p>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="fileFormat"
                                id="formatXlsx"
                                value="xlsx"
                                checked={fileType === 'xlsx'}
                                onChange={handleRadioChange}
                            />
                            <label className="form-check-label" htmlFor="formatXlsx">
                                XLSX (Excel)
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="fileFormat"
                                id="formatCsv"
                                value="csv"
                                checked={fileType === 'csv'}
                                onChange={handleRadioChange}
                            />
                            <label className="form-check-label" htmlFor="formatCsv">
                                CSV (comma separated values)
                            </label>
                        </div>

                        {fileType === 'csv' && (
                          <div className="mt-3">
                            <input
                              type="file"
                              accept=".csv"
                              className="form-control"
                              id="csvUpload"
                              onChange={handleFileUpload}
                            />
                          </div>
                        )}
                    </form>
                    <p className='mt-3'>All 100 items will be exported.</p>
                </div>
            </div>
        </div>
        <div className='bottomimport_div'>
                <button className='cancel_btn1 me-2'>Cancel</button>
                <button className='save_btn1' onClick={handleUpload}>Import</button>
              </div>
         </>
    );
}
