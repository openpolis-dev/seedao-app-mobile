import request from "./index";
const PATH_PREFIX = "/cityhall";

export const getCityHallDetail = () => {
  return request.get(`${PATH_PREFIX}/info`);
};


export const getCityHallNode = ()=> {
  return request.get(`${PATH_PREFIX}/cs_node`);
};


export const getGovernanceNodeResult = () => {
  return request.get("data_srv/aggr_scr");
};

export const getCurrentSeason = () => {
  return request.get(`/seasons/current`);
}
