
export const clearStorage = () => {
  localStorage.removeItem('SEEDAO_USER');
  localStorage.removeItem('sdn_user_id');
  localStorage.removeItem('SEEDAO_USER_DATA');
};

export const checkTokenValid = (token, expireAt) => {
  if (!token || !expireAt) {
    return;
  }
  if (Date.now() < Number(expireAt)) {
    return true;
  }
};

export const parseToken = (tokenstr) => {
  try {
    const data = JSON.parse(tokenstr);
    return { ...data };
  } catch (error) {}
  return;
};
