import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CopyBox from "components/common/copy";
import publicJs from "utils/publicJs";

export default function VoteRulesModal({ voteGate, handleClose }) {
  const { t } = useTranslation();
  return (
    <Modal>
      <ModalMask onClick={handleClose} />
      <ModalContent>
        <Title>{t("Proposal.VoteRules")}</Title>
        {voteGate && (
          <TokenBlock>
            <div className="title">{t("Proposal.PollNFT")}:</div>
            <div className="value">
              <CopyBox text={voteGate?.contract_addr}>{publicJs.AddressToShow(voteGate?.contract_addr, 6)}</CopyBox>
            </div>
            <div className="title">Token id:</div>
            <div className="value">{voteGate?.token_id}</div>
          </TokenBlock>
        )}
        {voteGate?.name && <AliasBlock>{voteGate.name}</AliasBlock>}
      </ModalContent>
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
  position: absolute;
  background: rgba(244, 244, 248, 0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(10px);
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
`;

const ModalContent = styled.div`
  background-color: var(--background-color-1);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-top: 24px;
  padding-inline: 32px;
  padding-bottom: 29px;
  box-sizing: border-box;
`;

const Title = styled.div`
  font-family: "Poppins-SemiBold";
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  margin-bottom: 16px;
`;

const TokenBlock = styled.div`
  font-size: 14px;
  line-height: 20px;
  border-bottom: 1px solid var(--border-color-1);
  padding-bottom: 16px;
  .title {
    margin-bottom: 1px;
    margin-top: 16px;
  }
  .value {
    color: var(--font-light-color);
  }
`;

const AliasBlock = styled.div`
  color: #8c56ff;
  font-size: 14px;
  line-height: 20px;
  padding-top: 16px;
`;
