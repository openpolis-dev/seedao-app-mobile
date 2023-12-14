import { useMemo, useState } from "react";
import styled from "styled-components";

export const TOAST_TYPE = {
  DEFAULT: "default",
  SUCCESS: "success",
  FAILED: "failed",
};

const ToastComp = ({ msg, type }) => {
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
      <InnerBox color={color}>{msg}</InnerBox>
    </ToastMask>
  );
};

export default function useToast() {
  const [msg, setMsg] = useState();
  const [type, setType] = useState(TOAST_TYPE.DEFAULT);
  const [show, setShow] = useState(false);
  const showToast = (msg, type) => {
    setMsg(msg);
    setShow(true);
    setType(type || TOAST_TYPE.DEFAULT);
    setTimeout(() => {
      setShow(false);
    }, 2000);
  };

  return {
    Toast: show ? <ToastComp msg={msg} type={type} /> : <></>,
    showToast,
    toast: {
      success: (msg) => {
        showToast(msg, TOAST_TYPE.SUCCESS);
      },
      danger: (msg) => {
        showToast(msg, TOAST_TYPE.FAILED);
      },
    },
  };
}

const ToastMask = styled.div`
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 999;
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
`;
