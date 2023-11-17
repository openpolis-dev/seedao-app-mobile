import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

export default function ProposalSubNav({ onSelect, value }) {
  const { t } = useTranslation();

  return (
    <SubNav>
      <li className={value === "new" ? "selected" : ""} onClick={() => onSelect("new")}>
        {t("Proposal.TheNeweset")}
      </li>
      <li className={value === "old" ? "selected" : ""} onClick={() => onSelect("old")}>
        {t("Proposal.TheOldest")}
      </li>
    </SubNav>
  );
}

const SubNav = styled.ul`
  display: flex;
  line-height: 22px;
  li {
    padding-inline: 9px;
    font-size: 12px;
    border: 1px solid var(--border-color-1);

    &.selected {
      background-color: var(--primary-color);
      color: #fff;
    }
    &:first-child {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }
    &:last-child {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }
`;
