import React from 'react'
import '../Leads/Deals.css'

const DirDeleteForm = ({ deal, setIsFormVisible, handleDeleteDeal}) => {
  const leadId = deal?.id; 

  return (
    <div className='btnpopup'>
    <div className='dltbtnpopup_content'>
      <div className='p-4'>
        <h4>Are you sure you want to delete this deal?</h4>
    <p>All activities, notes, files, documents and invoices linked to the deal are deleted as well. Deals admins can restore deleted deals within 30 days. The linked items will be restored as well.</p>
    <div className='markdelete_div'>
            <button className='cancelbtn1' type="button" onClick={() => setIsFormVisible(false)}>Cancel</button>
            <button type='submit' className='marklost_btn ms-3'  onClick={() =>  handleDeleteDeal(leadId)}>DELETE</button>
          </div>
      </div>
    </div>
  </div>
  )
}

export default DirDeleteForm