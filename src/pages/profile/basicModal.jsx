import {X} from "lucide-react"
import styled from "styled-components";

const Mask = styled.div`
  background: rgba(13, 12, 15, 0.8);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .btn {
    margin-right: 20px;
  }
`;

const CardBox = styled.div`
    background: var(--background-color-1);
    max-width: 95vw;
    box-sizing: border-box;
  border-radius: 16px;
  padding: 20px 34px 40px;
  position: relative;
  .btn-close-modal {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
  }
`;

const HeaderBox = styled.div`
  text-align: center;
  position: relative;
  font-size: 16px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: var(--bs-body-color_active);
  margin-bottom: 24px;
`;

const HeaderTitle = styled.div`
  text-align: center;
  width: 100%;
`;

export default function BasicModal({ title, handleClose, children, disabledClose, closeColor, ...rest }){
    return   <Mask>
        <CardBox {...rest}>
            {!disabledClose && (
                <X className="btn-close-modal" onClick={() => handleClose && handleClose()} color={closeColor} />
            )}
            {title && (
                <HeaderBox className="modal-header">
                    <HeaderTitle>{title}</HeaderTitle>
                </HeaderBox>
            )}
            {children}
        </CardBox>
    </Mask>
}
