import React, { useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import LeadContext from "./leadContext";
import leadReducer from "./leadReducer";
import axios from "axios"
import {
UPLOAD_FILES,
UPLOAD_SUPPRESS,
DELETE_DUPS,
SEND_TODAYS, 
CLEAR_LEADS,
POST_LEADS, 
GET_DUPS,
SET_LEADS,
} from "../types";

const LeadState = (props) => {
  const initialState = {
   leads: []
  };

const [state, dispatch] = useReducer(leadReducer, initialState);

const uploadSuppress = async (data) => {

     const res = await axios.post(`/api/leads/`, data);

    dispatch({
      type: UPLOAD_SUPPRESS,
      payload: res.data,
    });

    setLeads(res.data)
  };  


  const clearLeads = () => {
    dispatch({ type: CLEAR_LEADS });
  };

  const setLeads = (leads) => {
    dispatch({ type: SET_LEADS, payload: leads });
  };
  const deleteDup = async (lead) => {
    try {
      await axios.delete(`/api/leads?q=${lead.dupId}`);

      dispatch({
        type: DELETE_DUPS,
        payload: lead.dupId,
      });
    } catch (err) {
      console.log(err);
    }
  }; 

const uploadDaily = async (data) => {

     const res = await axios.post(`/api/leads/new`, data);

    dispatch({
      type: UPLOAD_FILES,
      payload: res.data,
    });
    setLeads(res.data)
    
  };


  const postLeads = async (leads) => {

     const res = await axios.post(`/api/leads/dup`, leads);

    dispatch({
      type: POST_LEADS,
      payload: res.data,
    });
  };

 const putDup = async (lead) => {

     const res = await axios.put(`/api/leads/${lead._id}`, lead);

    dispatch({
      type: POST_LEADS,
      payload: res.data,
    });
  };

 const sendTodays = async () =>{
   const res = await axios.get(`/api/leads`)
   dispatch({
     type: SEND_TODAYS,
     payload:res.data
   })
 } 

  const getDups = async () =>{
   const res = await axios.get(`/api/leads/dups`)
   dispatch({
     type: GET_DUPS,
     payload:res.data
   })
 } 

  return (
    <LeadContext.Provider
      value={{
      uploadDaily,
      sendTodays,
      setLeads,
      uploadSuppress,
      deleteDup,
      postLeads,
      getDups,  
      clearLeads,
      putDup,
      leads:state.leads
      }}>
      {props.children}
    </LeadContext.Provider>
  );
};

export default LeadState;
