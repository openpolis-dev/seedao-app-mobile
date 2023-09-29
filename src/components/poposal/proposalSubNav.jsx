import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

export default function ProposalSubNav({ onSelect, value }) {
  const { t } = useTranslation();

  return (
    <SubNav>
      <li className={value === 0 ? "selected" : ""} onClick={() => onSelect(0)}>
        {t("Proposal.TheNeweset")}
      </li>
      <li className={value === 1 ? "selected" : ""} onClick={() => onSelect(1)}>
        {t("Proposal.TheOldest")}
      </li>
    </SubNav>
  );
}

const SubNav = styled.ul`
  display: flex;
  padding-inline: 20px;
  margin-block: 15px;
  gap: 20px;
  li {
    padding-inline: 20px;
    height: 30px;
    line-height: 30px;
    background-color: #ddd;
    border-radius: 20px;
    color: #444;
    &.selected {
      background-color: var(--bs-primary);
      color: #fff;
    }
  }
`;
