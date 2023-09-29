import axios from 'axios';
/**
 * get
 * @method get
 * @param {url, params}
 */
const get = function (url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params,
        headers: {
          api_key: 'metaforo_website',
        },
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};
export const getCategories = () => {
  return get('https://forum.seedao.xyz/api/custom/group/info');
};

export const getAllProposals = data => {
  return get(
    'https://forum.seedao.xyz/api/thread/list?filter=all&category_index_id=0&tag_id=0&sort=latest&group_name=seedao',
    data,
  );
};

export const getProposalsBySubCategory = data => {
  return get(
    'https://forum.seedao.xyz/api/thread/list?filter=category&tag_id=0&group_name=seedao',
    data,
  );
};
export const getProposalDetail = pid => {
  return get(
    `https://forum.seedao.xyz/api/get_thread/${pid}?group_name=seedao`,
  );
};
