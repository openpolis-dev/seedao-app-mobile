import { useTranslation } from "react-i18next";
import styled, { css } from "styled-components";
import CloseIcon from "assets/Imgs/close-circle.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const QUESTIONS = [
  {
    q: "Onboarding.QuestionOne",
    a: "Onboarding.AnswerOne",
  },
  {
    q: "Onboarding.QuestionTwo",
    a: "Onboarding.AnswerTwo",
  },
];

export default function LearnDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showAnswerContent, setShowAnswerContent] = useState("");

  const go2learn = (page_title) => {
    navigate("/course", { state: page_title });
  };

  return (
    <LeanDashboardStyle>
      <LearnDashboardContet>
        <DashboardLeft>
          <div className="title">{t("Onboarding.ContributeCamp")}</div>
          <div className="desc">{t("Onboarding.ContributeCampIntro")}</div>
          {QUESTIONS.map((item, index) => (
            <div className="question" key={index} onClick={() => setShowAnswerContent(t(item.a))}>
              {t(item.q)}
            </div>
          ))}
        </DashboardLeft>
        <DashboardRight>
          <ModuleLinkButton onClick={() => go2learn(t("Onboarding.Enroll"))}>{t("Onboarding.Enroll")}</ModuleLinkButton>
          <LinkButton href="" rel="noreferrer">
            {t("Onboarding.NewcomerReward")}
          </LinkButton>
          <LinkButton href="" rel="noreferrer">
            {t("Onboarding.JoinCommunity")}
          </LinkButton>
          <ModuleLinkButton onClick={() => go2learn(t("Onboarding.FinalExamination"))}>
            {t("Onboarding.FinalExamination")}
          </ModuleLinkButton>
        </DashboardRight>
      </LearnDashboardContet>
      {showAnswerContent && (
        <AnswerBox>
          <div className="content">{showAnswerContent}</div>
          <img src={CloseIcon} alt="" onClick={() => setShowAnswerContent("")} />
        </AnswerBox>
      )}
    </LeanDashboardStyle>
  );
}

const LeanDashboardStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const LearnDashboardContet = styled.div`
  width: 100%;
`;

const DashboardLeft = styled.div`
  padding-bottom: 20px;
  .title {
    font-size: 18px;
    margin-bottom: 16px;
  }
  .question {
    cursor: pointer;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    margin-block: 10px;
    background-color: var(--background-color);
    padding: 10px 16px;
    margin-inline: 20px;
  }
`;

const DashboardRight = styled.div`
  border-top: 1px solid #ccc;
  padding-top: 20px;
`;

const AnswerBox = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--background-color-1);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .content {
    background-color: var(--background-color);
    padding: 40px 20px;
    margin-inline: 20px;
    margin-top: -30%;
  }
  img {
    cursor: pointer;
    width: 40px;
    margin-top: 20px;
  }
`;

const BasicButton = css`
  padding-inline: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-block: 10px;
  background-color: var(--background-color);
  padding: 10px 16px;
  margin-inline: 20px;
`;

const LinkButton = styled.a`
  ${BasicButton};
  display: block;
  color: var(--font-color);
`;

const ModuleLinkButton = styled.div`
  ${BasicButton};
  cursor: pointer;
`;

const CourseBox = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: -25%;
  background-color: var(--background-color);
  padding-top: 30px;
  border-radius: 16px;
  img {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
  }
`;
