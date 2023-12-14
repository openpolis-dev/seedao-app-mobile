import axios from "axios";

const SEEU_API = "https://seeu-network-backend.vercel.app/api/event";

export const getSeeuEventList = async (data) => {
  try {
    const resp = await axios.get(`${SEEU_API}/list`, { params: data });
    if (resp.status === 200 && resp.data?.success && resp.data?.err_code === 0) {
      return resp.data;
    }
    throw Error(`status is ${resp.status}, err_code is ${resp.data?.err_code}`);
  } catch (error) {
    throw Error(error);
  }
};

export const getSeeuEventDetail = async (id) => {
  try {
    const resp = await axios.get(`${SEEU_API}/detail/${id}`);
    if (resp.status === 200 && resp.data?.success && resp.data?.err_code === 0) {
      return resp.data;
    }
    throw Error(`status is ${resp.status}, err_code is ${resp.data?.err_code}`);
  } catch (error) {
    throw Error(error);
  }
};
