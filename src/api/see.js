import request from "./index";

const PATH_PREFIX = '/asset_trade/';



export const transferSEE = (data) => {
  return request.post(`${PATH_PREFIX}`,data);
};


export const getSeeList = (data)=> {

  const {from_user,to_user,page,size} = data;
  return request.get(`${PATH_PREFIX}?from_user=${from_user??""}&to_user=${to_user??""}&page=${page}&size=${size}`);
};
