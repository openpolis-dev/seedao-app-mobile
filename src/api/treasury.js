// Assets Module API
import request from './index';

const PATH_PREFIX = '/treasury';

export const getTreasury = () => {
  return request.get(`${PATH_PREFIX}/current`);
};

export const updateTokenBudget = (amount) => {
  return request.post(`${PATH_PREFIX}/update_assets`, [
    { total_amount: amount, asset_name: 'USDT', budget_type:  'token' },
  ]);
};

export const updateBudget = (amount, type, asset_name) => {
  return request.post(`${PATH_PREFIX}/update_assets`, [
    { total_amount: amount, asset_name: asset_name, budget_type: type },
  ]);
};
