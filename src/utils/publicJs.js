import {SiweMessage} from 'siwe';
import AppConfig from '../AppConfig';

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

export const createSiweMessage = (address, chainId, nonce, statement) => {
  const {host, origin} = AppConfig;
  const siweMessage = new SiweMessage({
    domain: host,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: chainId,
    nonce,
  });
  return siweMessage.prepareMessage();
};

export default {
  AddressToShow,
  createSiweMessage,
};
