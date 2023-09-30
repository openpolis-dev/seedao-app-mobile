import React, { useReducer, createContext, useContext } from "react";

const ProjectContext = createContext();

export const PROJECT_ACTIONS = {
  SET_ID: "set_id",
  SET_DATA: "set_data",
}

const reducer = (state, action) => {
  switch (action.type) {
    case PROJECT_ACTIONS.SET_ID:
      return { ...state, id: action.payload };
    case PROJECT_ACTIONS.SET_DATA:
      return { ...state, data: action.payload };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const INIT_STATE = {
  id: undefined,
  data: undefined,
};

const ProjectProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {props.children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => ({ ...useContext(ProjectContext) });

export default ProjectProvider;
