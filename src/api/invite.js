import request from "./index";

const PATH_PREFIX = '/sns_invite/';

export const getInviteCode = ()=> {
  return request.get(`${PATH_PREFIX}my_sns_invite_code`);
};

export const getMyRewards = () => {
  return request.get(`${PATH_PREFIX}my_sns_invite_rewards`);
};

export const inviteBy = (invite_code) => {
  return request.post(`${PATH_PREFIX}invited_by/${invite_code}`);
};
