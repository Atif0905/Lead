import React from 'react'
import './Tools.css'
import { IoIosDownload } from "react-icons/io";
import { FaFileExport } from "react-icons/fa";
import { LuMerge } from "react-icons/lu";
import { FaCloudUploadAlt } from "react-icons/fa";

const ImportData = () => {
  return (
    <div className='tools-maindiv'>
        <div className='tools_sidebar'>
<div className='d-flex data_div align-items-center'>
<IoIosDownload  className='import_icons'/>
<p className='ms-3 import_txt'>Import data</p>
</div>
<div className='d-flex  data_div align-items-center'>
<FaFileExport className='import_icons' />
<p className='ms-3 import_txt'>Export data</p>
</div>
<div className='d-flex  data_div align-items-center'>
<LuMerge className='import_icons'/>
<p className=' ms-3 import_txt'>Merge duplicates</p>
</div>

        </div>
<div className='tools_content'>
    
<h5 className='import_head'>Import data</h5>
<p className='import_text'>Import people, organizations, deals, activities, notes, and leads directly from other CRM software, or simply upload a file with the data you need.</p>
<div className='sheet_div mt-5 d-flex align-items-center justify-content-center'>
    <div>
    <p className='sheet_text1'>Import data from a spreadsheet (CSV, XLS and XLSX files).</p>
    <div className='d-flex align-items-center justify-content-center mt-5'>
    <button className='sheet_btn' ><FaCloudUploadAlt className='upload_icon' />Upload spreadsheet</button>
    </div>
    <p className='sheet_text1 mt-2'>Or drag and drop the file here</p>
    <p className='sheet_text1 mt-4'>Download a sample file <span className='sheet_color'> (.XLS, .CSV)</span></p>
</div>
</div>
<div className='sheet_div2 mt-2 d-flex align-items-center justify-content-center'>
  <div>
  <p className='sheet_text1'>Import data from another CRM software through our third-party partner, Import2.</p>
  <div className='d-flex align-items-center justify-content-center'>
<button className='sheet_btn2'>Import with import2</button>
</div>
</div>
</div>
<h5 className='import_head mt-5'>Import history</h5>
<p className='import_text'>Import sessions are kept for 30 days, but can only be reverted in the first 48 hours after upload.<br/>
<span className='import_text2'>(for example, permission to delete deals)</span></p>
<div className='mt-5'>
<table className='history_table'>
  <tr>
    <th>Date and time</th>
    <th>File name</th>
    <th>User</th>
    <th>Type</th>
    <th>Status</th>
  </tr>
  <tr>
    <td>You have not imported any files yet.</td>
    
  </tr>
</table>
</div>
</div>



</div>
 
  )
}

export default ImportData