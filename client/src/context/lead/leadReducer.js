import {
  DELETE_DUPS,
  UPLOAD_FILES,
  SEND_TODAYS,
  UPLOAD_SUPPRESS,
  CLEAR_LEADS,
  POST_LEADS,
  SET_LEADS
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case UPLOAD_FILES:
      return {
        ...state,
        data: action.payload,
      };
     case POST_LEADS:
      return {
        ...state,
        leads: action.payload,
      };
     case SET_LEADS:
      return {
        ...state,
        leads: action.payload,
      };
    case CLEAR_LEADS:
      return {
        ...state,
        leads: [],
      };
    case SEND_TODAYS:
      return {
        ...state,
        todays: action.payload,
      };

    case UPLOAD_SUPPRESS:
      return {
        ...state,
        data: action.payload,
      };
    case DELETE_DUPS:
      return {
        ...state,
        leads: state.leads.filter(
          (lead) => lead.dupId !== action.payload
        ),
      };
  
  


  }
};