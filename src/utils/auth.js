
export const clearStorage = () => {
  localStorage.removeItem('SEEDAO_USER');
  localStorage.removeItem("SEE_AUTH");
  localStorage.removeItem('sdn_user_id');
  localStorage.removeItem('SEEDAO_USER_DATA');
  localStorage.removeItem("joyid-address");
  localStorage.removeItem("joyid-status");
  localStorage.removeItem("joyid-msg");
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
