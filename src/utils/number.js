export const formatNumber = (num) => {
  return (num >= 0 ? "" : "-") + Math.abs(num).toLocaleString("en-US");
};

export const getShortDisplay = (v, num) => {
  if (!v) return v;
  const tp = typeof v;
  if (tp === "number") v = String(v);
  const arr = v.split(".");
  let res = arr[0];
  if (arr[1]) {
    res += `.${arr[1].slice(0, num || 6)}`;
  } else {
    res += ".00";
  }
  return res;
};

Number.prototype.format = function (n = 2) {
  return getShortDisplay(formatNumber(this), n);
};
