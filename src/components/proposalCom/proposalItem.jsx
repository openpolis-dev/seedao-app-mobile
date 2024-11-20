import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "utils/time";
import ProposalStateTag from "components/proposalCom/stateTag";
import Avatar from "components/common/avatar";
import { MultiLineStyle } from "assets/styles/common";
import { getProposalSIPSlug } from "utils";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

const CardBody = styled.div``;

export default function ProposalItem({ data, sns }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userToken = useSelector((state) => state.userToken);

  const openProposal = () => {
    navigate(`/proposal/thread/${data.id}`, { state: data });
  };

  return (
    <CardBox key={data.id}>
      <div onClick={openProposal}>
        <CardHeaderStyled>
          <Title line={2}>
            {getProposalSIPSlug(data.sip)}
            {data.title}
          </Title>
        </CardHeaderStyled>
        <Flexlft>
          {
              !!userToken && data.is_voted && data.state === "voting" &&  <VotedBox>{t('Proposal.HasVote')}</VotedBox>
          }
          {
            !!userToken && !data.is_voted && data.state === "voting" &&  <VotedBox2>{t('Proposal.notVote')}</VotedBox2>
          }
          <ProposalStateTag state={data.state} />
          <CatBox>{data.category_name}</CatBox>
        </Flexlft>
        <CardBody>
          <FlexLine>
            <AvaBox>
              <div className="left">
                <Avatar src={data.applicant_avatar} alt="" size="28px" />
              </div>
              <div className="name">{sns}</div>
            </AvaBox>
            <div className="date">
              <span>{formatDate(new Date(data.create_ts * 1000))}</span>
            </div>
          </FlexLine>
        </CardBody>
      </div>
    </CardBox>
  );
}

const Flexlft = styled.div`
  display: flex;
  align-items: center;
  margin-top: 6px;
  gap:5px;
`


const FlexLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
`;

const CardBox = styled.div`
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.02);
  cursor: pointer;
  background: var(--background-color-1);
  padding: 12px 16px;
  border-radius: 16px;
  margin-bottom: 9px;

  .name {
    font-size: 12px;
    font-family: Poppins-SemiBold !important;
    color: var(--bs-body-color_active);
  }

  .date {
    font-size: 12px;
    color: var(--font-light-color);
    padding-inline: 2px;
    line-height: 1em;
  }
`;

const CardHeaderStyled = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const AvaBox = styled.div`
  display: flex;
  align-items: center;
  .left {
    margin-right: 10px;
  }
`;

const Title = styled.div`
  //font-weight: bolder;
  font-size: 16px;
  line-height: 20px;
  font-family: Poppins-SemiBold;
  color: var(--bs-body-color_active);
  flex: 1;
  //height: 40px;
  overflow:hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  ${MultiLineStyle}
`;

const CatBox = styled.div`
  display: inline-block;
  border-radius: 4px;
  border: 1px solid var(--border-color-2);
  color: var(--border-color-2);
  font-size: 12px;
  padding: 0 6px;
  line-height: 18px;
`;



const VotedBox = styled.div`
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #08D0EA30;
    color: #08b0c5;
    font-size: 12px;
    background: #08D0EA30;
    padding: 0 5px;
    text-align: center;
    height: 18px;
`

const VotedBox2 = styled(VotedBox)`
    border: 1px solid rgba(255, 81, 209,0.2);
    color: rgba(255, 81, 209,1);
    background: rgba(255, 81, 209,0.2);

`
