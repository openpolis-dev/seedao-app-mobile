export const formatNumber = (num) => {
  return (num >= 0 ? '' : '-') + Math.abs(num).toLocaleString('en-US');
};
