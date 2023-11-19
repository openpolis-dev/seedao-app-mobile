// City Hall Module API
import request from './index';
const PATH_PREFIX = '/applications/';

export const getApplicationById = application_id => {
  return request.get(`${PATH_PREFIX}${application_id}`);
};

export const getApplications = (data, queryData) => {
  return request.get(`${PATH_PREFIX}`, { ...data, ...queryData, type: "new_reward" });
};
export const getProjectApplications = data => {
  return request.get(`${PATH_PREFIX}`, data);
};

export const getCloseProjectApplications = (data, queryData) => {
  return request.get(`${PATH_PREFIX}`, {
    ...data,
    entity: 'project',
    ...queryData,
  });
};

export const createCloseProjectApplication = (
  project_id,
  detailed_type = '',
  comment = '',
) => {
  return request.post(`${PATH_PREFIX}`, [
    {
      entity: 'project',
      entity_id: project_id,
      detailed_type,
      comment,
    },
  ]);
};

export const createBudgetApplications = data => {
  return request.post(`${PATH_PREFIX}`, data);
};

// approve
export const approveApplications = application_ids => {
  return request.post('/apps_approve', application_ids);
};
export const approveApplicationByID = application_id => {
  return request.post(`${PATH_PREFIX}${application_id}/approve`);
};

// reject
export const rejectApplications = application_ids => {
  return request.post('/apps_reject', application_ids);
};
export const rejectApplicationByID = application_id => {
  return request.post(`${PATH_PREFIX}${application_id}/reject`);
};

// complete
export const compeleteApplications = data => {
  return request.post('/apps_complete', {
    message: data.join(','),
  });
};
// process
export const processApplications = data => {
  return request.post('/apps_process', data);
};

// download
// export const getTemplateFileUrl = () => {
//   return `${getBaseURL()}/get_applications_upload_template`;
// };
// export const getExportFileUrl = ids => {
//   return `${getBaseURL()}/download_applications?ids=${ids.join(',')}`;
// };

// applicants
export const getApplicants = data => {
  return request.get('/apps_applicants', data);
};

export const getSeasons = () => {
  return request.get(`/seasons/`);
};
