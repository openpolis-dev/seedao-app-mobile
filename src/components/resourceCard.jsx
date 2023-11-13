import styled from "styled-components";
import { MultiLineStyle } from "assets/styles/common";

export default function ResourceCard({ data }) {
  return (
    <ResourceCardItem>
      <img src={data.icon} alt="" />
      <Title>{data.name}</Title>
      <Desc line={1}>{data.desc}</Desc>
    </ResourceCardItem>
  );
}

const ResourceCardItem = styled.div`
  img {
    width: 26px;
  }
`;

const Title = styled.div`
  font-size: 16px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: var(--font-color);
  line-height: 24px;
`;

const Desc = styled.div`
  font-size: 12px;
  color: var(--font-light-color);
  line-height: 18px;
  margin-top: 4px;
  ${MultiLineStyle}
`;
