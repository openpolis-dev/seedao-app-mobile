import { ethers } from "ethers";

const ERROR_ABI = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "CommitmentTooNew",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "CommitmentTooOld",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "max",
        type: "uint256",
      },
    ],
    name: "ReachedMaxOwnedNumberLimit",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientPayment",
    type: "error",
  },
];

const parseError = (data) => {
  const iface = new ethers.utils.Interface(ERROR_ABI);
  const parsed = iface.parseError(data);
  console.log("parsed", parsed);
  return parsed;
};

export default parseError;
