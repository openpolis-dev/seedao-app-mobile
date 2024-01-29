import styled from "styled-components";
import LoadingBox from "components/common/loading";

export default function LoadingModal({ msg }) {
  return (
    <Modal>
      <ModalMask />
      <ModalContainer>
        <ModalBox>
          <LoadingBox />
          {msg && <Message>{msg}</Message>}
        </ModalBox>
      </ModalContainer>
    </Modal>
  );
}

const Modal = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
`;

const ModalMask = styled.div`
  background: rgba(244, 244, 248, 0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(10px);
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
`;

const ModalContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  text-align: center;
`;

const Message = styled.div`
  margin-top: 16px;
`;
