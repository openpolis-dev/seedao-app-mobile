import axios from "axios";
import request from "./index";


export const DEEPSEEK_API_URL ="https://dschat.seedao.tech/v1"
const PATH_PREFIX = '/user';

export const getAllModels = async (apikey) => {
  const response = await axios.get(`${DEEPSEEK_API_URL}/api/models`, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apikey
    }
  });

  return response.data.data;
}


export const chatCompletions = async (obj,abortController,apiKey) => {

  const response = await fetch(`${DEEPSEEK_API_URL}/api/chat/completions`, {
    "headers": {
      "content-type": "application/json",
      'X-API-Key': apiKey
    },

    "body": obj,
    "method": "POST",
    signal: abortController.signal,

  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response;
}

export const getNewToken = async () => {
  return request.post(`${PATH_PREFIX}/refresh/dsapikey`);
}

export const loginChat = async () => {
  return request.post(`${PATH_PREFIX}/auth/dschat`);
}

