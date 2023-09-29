import request from './index';

export const loginTestGet = () => {
  return request.get('/preview_enable');
};

export const previewLogin = () => {
  return request.post('/preview_login');
};
