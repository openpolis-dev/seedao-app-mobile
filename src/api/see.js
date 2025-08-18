import request from "./index";

const PATH_PREFIX = '/asset_trade/';



export const transferSEE = (data) => {
  return request.post(`${PATH_PREFIX}/new`,data);
};


export const getSeeList = (data)=> {

  const {page,size} = data;
  return request.get(`${PATH_PREFIX}/my?page=${page}&size=${size}`);
};



export const claimSee = ()=> {

  return request.post(`${PATH_PREFIX}claim_see`);
};
