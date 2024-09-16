import React from 'react';
import Leads from './Leads/Leads';
import LeadAbove from './Leads/LeadAbove';

const AdminLead = () => {
  return (
    <div className='main-content'>
      <LeadAbove/>
      <Leads />
    </div>
  );
};

export default AdminLead;
