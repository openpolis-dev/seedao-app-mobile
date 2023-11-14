import request from "./index";
const PATH_PREFIX = "/cityhall";

export const getCityHallDetail = () => {
  return request.get(`${PATH_PREFIX}/info`);
};
