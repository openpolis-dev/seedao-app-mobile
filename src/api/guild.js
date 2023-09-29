// Guild Module API
import request from './index';
const PATH_PREFIX = '/guilds/';

export const createProjects = data => {
  return request.post(PATH_PREFIX, data);
};

export const getProjects = data => {
  return request.get(PATH_PREFIX, data);
};
export const getMyProjects = data => {
  return request.get(`/my_guilds`, data);
};

export const getProjectById = projectId => {
  return request.get(`${PATH_PREFIX}${projectId}`);
};
export const closeProjectById = projectId => {
  return request.post(`${PATH_PREFIX}${projectId}/close`);
};
export const UpdateBudget = (projectId, data) => {
  return request.post(`${PATH_PREFIX}${projectId}/update_budget`, data);
};
export const UpdateInfo = (projectId, data) => {
  return request.put(`${PATH_PREFIX}${projectId}`, data);
};
export const updateMembers = (projectId, data) => {
  return request.post(`${PATH_PREFIX}${projectId}/update_members`, data);
};
export const updateSponsors = (projectId, data) => {
  return request.post(`${PATH_PREFIX}${projectId}/update_sponsors`, data);
};

export const addRelatedProposal = (projectId, proposalId) => {
  return request.post(
    `${PATH_PREFIX}${projectId}/add_related_proposal/${proposalId}`,
  );
};
