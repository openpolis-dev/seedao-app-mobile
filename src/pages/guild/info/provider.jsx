import React, { useReducer, createContext, useContext } from "react";

const GuildContext = createContext();

export const GUILD_ACTIONS = {
  SET_ID: "set_id",
  SET_DATA: "set_data",
}

const reducer = (state, action) => {
  switch (action.type) {
    case GUILD_ACTIONS.SET_ID:
      return { ...state, id: action.payload };
    case GUILD_ACTIONS.SET_DATA:
      return { ...state, data: action.payload };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const INIT_STATE = {
  id: undefined,
  data: undefined,
};

const GuildProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  return <GuildContext.Provider value={{ state, dispatch }}>{props.children}</GuildContext.Provider>;
};

export const useGuildContext = () => ({ ...useContext(GuildContext) });

export default GuildProvider;
