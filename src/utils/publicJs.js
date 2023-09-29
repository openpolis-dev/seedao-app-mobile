
const AddressToShow = address => {
  if (!address) {
    return '...';
  }

  let frontStr = address.substring(0, 4);

  let afterStr = address.substring(address.length - 4, address.length);

  return `${frontStr}...${afterStr}`;
};



export default {
  AddressToShow,
};
