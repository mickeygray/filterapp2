import React, { useContext, useEffect } from "react";
import ListItem from "./ListItem";
import LeadContext from "../context/lead/leadContext";

const ListViewer = () => {
  const leadContext = useContext(LeadContext);

  const { leads, clearLeads, postLeads, getDups } = leadContext;

  return (
    <div className='sidebar'>
    <button onClick={()=>getDups()}> Get All Dups </button>  
      {leads.length > 0 ? 
      
      <div className='grid-2'>
        <div> <button onClick={()=>clearLeads()} className='btn btn-dark'>Clear Leads</button></div>
        <div> <button onClick={()=>postLeads(leads)}className='btn btn-success'>Post Leads</button></div>

      
      </div>:''}
      {leads.length > 0 ?
        
         leads.map((lead) => <ListItem key={lead.dupId} lead={lead} />)
        : ""}
    </div>
  );
};

export default ListViewer;
