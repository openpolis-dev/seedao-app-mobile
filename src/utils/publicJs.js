const AddressToShow = (address) => {
  if (!address) {
    return "...";
  }
  if (address.length <= 8) {
    return address;
  }

  const frontStr = address.substring(0, 4);

  const afterStr = address.substring(address.length - 4, address.length);

  return `${frontStr}...${afterStr}`;
};

export default {
  AddressToShow,
};
