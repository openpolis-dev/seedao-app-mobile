export const formatNumber = (num) => {
  if (isNaN(num)) return "0";
  return (num >= 0 ? "" : "-") + Math.abs(num).toLocaleString("en-US");
};

export const getShortDisplay = (v, num = 2) => {
  if (!v) return v;
  const tp = typeof v;
  if (tp === "number") v = String(v);
  const arr = v.split(".");
  let res = arr[0];
  if (arr[1]) {
    const more = `.${arr[1].slice(0, num)}`;
    res += more;
    if (more.length < num + 1) {
      res += "0".repeat(num + 1 - more.length);
    }
  } else if (num > 0) {
    res += "." + "0".repeat(num);
  }
  return res;
};

Number.prototype.format = function (n = 2) {
  return getShortDisplay(formatNumber(this), n);
};
