import { Link } from "react-router-dom";
import styled from "styled-components";
import ArrowIconSVG from "components/svgs/back";

export default function ProposalNav({ navs }) {
  return (
    <Nav>
      {navs.map((n, i) => (
        <li key={n.category_id}>
          {i !== 0 && (
            <ImageBox>
              <ArrowIconSVG color="var(--font-light-color)" />
            </ImageBox>
          )}
          <Link to={n.to}>
            <NavText style={{ color: i === navs.length - 1 ? "var(--font-color)" : "var(--font-light-color)" }}>
              {n.name}
            </NavText>
          </Link>
        </li>
      ))}
    </Nav>
  );
}

const Nav = styled.ul`
  display: flex;
  line-height: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 13px;
  li {
    display: flex;
    align-items: center;
    height: 22px;
  }
`;

const NavText = styled.span``;

const ImageBox = styled.span`
  svg {
    transform: rotate(180deg) scale(0.7);
    position: relative;
    top: 2px;
  }
`;
