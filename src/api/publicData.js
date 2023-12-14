// Public Data API
import request from './index';

const PATH_PREFIX = '/public_data';

export const publicList = (data) => {
  return request.get(`${PATH_PREFIX}/notion/database/73d83a0a-258d-4ac5-afa5-7a997114755a`, data);
};
export const pubDetail = (id) => {
  return request.get(`${PATH_PREFIX}/notion/page/${id}`);
};

export const getVaultBalance = () => {
  return request.get(`${PATH_PREFIX}/safe_vault`);
};
