import request from "./index";
const PATH_PREFIX = "/cityhall";

export const getCityHallDetail = () => {
  return request.get(`${PATH_PREFIX}/info`);
};

export const getGovernanceNodeResult = () => {
  return request.get("data_srv/aggr_scr");
};

export const getCurrentSeason = () => { 
  return request.get(`/seasons/current`); 
}