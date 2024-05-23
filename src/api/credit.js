import getConfig from "constant/envCofnig";
import { formatTime, getUTC } from "utils/time";

const PATH_PREFIX = `${getConfig().INDEXER_ENDPOINT}/score_lend`;

export const getVaultData = () => {
  return fetch(`${PATH_PREFIX}/total_borrow`).then((res) => res.json());
};

const formatRecord = (item) => {
  return {
    lendId: item.lendId,
    lendIdDisplay: String(88000 + Number(item.lendId)),
    status: item.lendStatus,
    debtor: item.debtor,
    borrowAmount: Number(item.borrowAmount),
    borrowTime: formatTime(item.borrowTimestamp * 1000) + " " + getUTC(),
    borrowTx: item.borrowTx,
    rate: `${Number(item.interestRate) * 100}`,
    interestDays: item.interestDays,
    interestAmount: Number(item.interestAmount),
    paybackTime: formatTime(item.paybackTimestamp * 1000) + " " + getUTC(),
    paybackTx: item.paybackTx,
    overdueTime: formatTime(item.overdueTimestamp * 1000) + " " + getUTC(),
    mortgageSCRAmount: Number(item.mortgageSCRAmount),
  };
};

export const getBorrowList = (data) => {
  const queryData = new URLSearchParams(data);
  return fetch(`${PATH_PREFIX}/lends?${queryData.toString()}`)
    .then((res) => res.json())
    .then((res) => {
      return {
        ...res,
        data: res.data.map((item) => formatRecord(item)),
      };
    });
};

export const getRecordDetail = (id) => {
  return fetch(`${PATH_PREFIX}/lend/${id}`)
    .then((res) => res.json())
    .then((item) => formatRecord(item));
};
