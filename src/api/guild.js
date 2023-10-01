// Guild Module API
import request from './index';
const PATH_PREFIX = '/guilds/';

export const createGuild = data => {
  return request.post(PATH_PREFIX, data);
};

export const getGuilds = data => {
  return request.get(PATH_PREFIX, data);
};
export const getMyGuilds = data => {
  return request.get(`/my_guilds`, data);
};

export const getGuildById = guildId => {
  return request.get(`${PATH_PREFIX}${guildId}`);
};

export const UpdateBudget = (guildId, data) => {
  return request.post(`${PATH_PREFIX}${guildId}/update_budget`, data);
};
export const UpdateInfo = (guildId, data) => {
  return request.put(`${PATH_PREFIX}${guildId}`, data);
};
export const updateMembers = (guildId, data) => {
  return request.post(`${PATH_PREFIX}${guildId}/update_members`, data);
};
export const updateSponsors = (guildId, data) => {
  return request.post(`${PATH_PREFIX}${guildId}/update_sponsors`, data);
};

export const addRelatedProposal = (guildId, proposalId) => {
  return request.post(
    `${PATH_PREFIX}${guildId}/add_related_proposal/${proposalId}`,
  );
};
