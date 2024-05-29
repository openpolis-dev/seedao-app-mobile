export const formatNumber = (num) => {
  if (isNaN(num)) return "0";
  const prefix = num >= 0 ? "" : "-";
  const numSplitStr = String(num).split(".");
  const intNum = Math.abs(Number(numSplitStr[0])).toLocaleString("en-US");
  return prefix + intNum + (numSplitStr.length > 1 ? `.${numSplitStr[1]}` : "");
};

export const getShortDisplay = (v, num = 2) => {
  if (!v) return v;
  const tp = typeof v;
  if (tp === "number") v = String(v);
  const arr = v.split(".");
  let res = arr[0];
  if (arr[1] && num > 0) {
    const more = `.${arr[1].slice(0, num)}`;
    if (more.length < num + 1) {
      res += more + "0".repeat(num + 1 - more.length);
    } else if (more.length === num + 1) {
      res += more;
    }
  } else if (num > 0) {
    res += "." + "0".repeat(num);
  }
  return res;
};

Number.prototype.format = function (n = 2) {
  return getShortDisplay(formatNumber(this), n);
};
