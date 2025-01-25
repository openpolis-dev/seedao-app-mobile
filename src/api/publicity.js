import request from './index';

const PATH_PREFIX = '/publicity/';


export const getPublicity = (page,size) =>{
  return request.get(`${PATH_PREFIX}list?page=${page}&size=${size}&type=list`);
}


export const getPublicityDetail = (id) =>{
  return request.get(`${PATH_PREFIX}detail/${id}`);
}

export const createPublicity = (data) =>{
  return request.post(`${PATH_PREFIX}create`,data);
}

export const updatePublicity = (data) =>{
  return request.post(`${PATH_PREFIX}update/${data.id}`,data);
}

export const deletePublicity = (id) =>{
  return request.delete(`${PATH_PREFIX}delete/${id}`);
}
