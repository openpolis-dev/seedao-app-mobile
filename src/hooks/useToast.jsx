import { useMemo, useState } from "react";
import styled from "styled-components";

export const TOAST_TYPE = {
  DEFAULT: "default",
  SUCCESS: "success",
  FAILED: "failed",
};

const ToastComp = ({ msg, type, optionButton, handleClose }) => {
  const color = useMemo(() => {
    switch (type) {
      case TOAST_TYPE.SUCCESS:
        return "green";
      case TOAST_TYPE.FAILED:
        return "darkred";
      default:
        return "";
    }
  }, [type]);
  return (
    <ToastMask>
      <InnerBox color={color}>
        {msg}
        {optionButton && <div onClick={handleClose}>{optionButton}</div>}
      </InnerBox>
    </ToastMask>
  );
};

export default function useToast() {
  const [msg, setMsg] = useState();
  const [type, setType] = useState(TOAST_TYPE.DEFAULT);
  const [show, setShow] = useState(false);
  const [optionButton, setOptionButton] = useState();

  const showToast = (msg, type, option) => {
    setMsg(msg);
    setShow(true);
    setType(type || TOAST_TYPE.DEFAULT);
    if (option) {
      setOptionButton(option);
    } else {
      setTimeout(() => {
        setShow(false);
      }, 2000);
    }
  };

  const handleClose = () => {
    setShow(false);
    setOptionButton(null);
  };

  return {
    Toast: show ? <ToastComp msg={msg} type={type} handleClose={handleClose} optionButton={optionButton} /> : <></>,
    showToast,
    toast: {
      success: (msg) => {
        showToast(msg, TOAST_TYPE.SUCCESS);
      },
      danger: (msg, optionButton) => {
        showToast(msg, TOAST_TYPE.FAILED, optionButton);
      },
    },
  };
}

const ToastMask = styled.div`
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 999999;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InnerBox = styled.span`
  display: inline-block;
  background: ${({ color }) => color || "rgba(0, 0, 0, 0.75)"};
  padding: 10px 20px;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  max-width: 90vw;
`;
