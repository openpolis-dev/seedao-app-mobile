export const debounce = (fn, wait) => {
  let timer;
  return (...args) => {
    const context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(context, args);
    }, wait);
  };
};

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
export const getRandomCode = () => {
  let str = "";
  for (let i = 0; i < 4; i++) {
    const ascii = getRandom(48, 122);
    if ((ascii > 57 && ascii < 65) || (ascii > 90 && ascii < 97)) {
      i--;
      continue;
    }
    const c = String.fromCharCode(ascii);
    str += c;
  }
  return str;
};

export const isInPWA = () => {
  return window.navigator?.standalone === true || !!window.matchMedia("(display-mode: standalone)").matches;
}

export const getProposalSIPSlug = (sip, suffix = ": ") => {
  if (!sip) return "";
  if (suffix) {
    return `SIP-${sip}${suffix}`;
  }
  return sip;
};