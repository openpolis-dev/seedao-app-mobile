import React, { useReducer, createContext, useContext } from "react";

export const ACTIONS = {
  SET_STEP: "set_step",
  ADD_STEP: "add_step",
  SET_CONTRACT: "set_contract",
  SET_LOCAL_DATA: "set_local_data",
  SHOW_LOADING: "show_loading",
  CLOSE_LOADING: "close_loading",
  SET_SNS: "set_sns",
  SET_STORAGE: "set_storage",
};

const INIT_STATE = { step: 0, sns: "" };

const SNSContext = createContext({
  state: INIT_STATE,
  dispatch: () => null,
});

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_SNS:
      return { ...state, sns: action.payload };
    case ACTIONS.ADD_STEP:
      return { ...state, step: state.step + 1 };
    case ACTIONS.SET_STEP:
      return { ...state, step: action.payload };
    case ACTIONS.SET_CONTRACT:
      return { ...state, contract: action.payload };
    case ACTIONS.SET_LOCAL_DATA:
      return { ...state, localData: action.payload };
    case ACTIONS.SHOW_LOADING:
      return { ...state, loading: true };
    case ACTIONS.CLOSE_LOADING:
      return { ...state, loading: false };
    case ACTIONS.SET_STORAGE:
      localStorage.setItem("sns", action.payload);
      return { ...state, localData: action.payload ? JSON.parse(action.payload) : undefined };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const SNSProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  return <SNSContext.Provider value={{ state, dispatch }}>{children}</SNSContext.Provider>;
};

export const useSNSContext = () => ({ ...useContext(SNSContext) });

export default SNSProvider;