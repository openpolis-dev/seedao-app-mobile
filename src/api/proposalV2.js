import request from "./index";
import axios from "axios";
import { METAFORO_TOKEN } from "utils/constant";
import store from "store";

const PATH_PREFIX = "/proposals/";

const instance = axios.create({
  baseURL: "https://metaforo.io/api",
});

export function loginByWallet(param, token) {
  return instance
    .post("/wallet/sso", param, {
      headers: {
        api_key: "metaforo_website",
      },
    })
    .then((res) => {
      return res.data?.data;
    });
}

export const getMetaforoData = () => {
  return store.getState().metaforoToken;
};

export const getProposalCategoryList = () => {
  return request.get(`/proposal_categories/list`);
};

export const getProposalList = (data) => {
  return request.get(`${PATH_PREFIX}list`, data);
};

export const getProposalDetail = (id, startPostId) => {
  return request.get(
    `${PATH_PREFIX}show/${id}`,
    {
      start_post_id: startPostId,
      access_token: getMetaforoData()?.token,
    },
    {},
  );
};

export const prepareMetaforo = (userId) => {
  const token = getMetaforoData()?.token;
  return request.post("/user/prepare_metaforo", {
    api_token: token,
    user: { id: userId },
  });
};

// =========== vote ===========

export const checkCanVote = (id) => {
  return request.post(`${PATH_PREFIX}can_vote/${id}`);
};

export const castVote = (id, vote_id, option) => {
  return request.post(`${PATH_PREFIX}vote/${id}`, {
    vote_id,
    options: option,
    metaforo_access_token: getMetaforoData()?.token,
  });
};

export const getVotersOfOption = (option_id, page) => {
  return request.get(`${PATH_PREFIX}vote_detail/${option_id}`, {
    page,
  });
};

// =========== comment ===========

// NOTE: reply_id is metaforo_id
export const addComment = (id, content, reply_id) => {
  return request.post(`${PATH_PREFIX}add_comment/${id}`, {
    content,
    reply_id,
    editor_type: 1,
    metaforo_access_token: getMetaforoData()?.token,
  });
};

export const editCommet = (id, content, cid) => {
  return request.post(`${PATH_PREFIX}edit_comment/${id}`, {
    post_id: cid,
    content,
    editor_type: 1,
    metaforo_access_token: getMetaforoData()?.token,
  });
};

export const deleteCommet = (id, cid) => {
  return request.post(`${PATH_PREFIX}delete_comment/${id}`, {
    post_id: cid,
    metaforo_access_token: getMetaforoData()?.token,
  });
};

export const getTemplate = () => {
  return request.get("/proposal_tmpl/");
};
export const getComponents = () => {
  return request.get("/proposal_components/");
};
