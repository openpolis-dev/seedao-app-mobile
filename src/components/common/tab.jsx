import styled from "styled-components";

export default function Tab({ data, onChangeTab, value, ...rest }) {
  return (
    <TabMenu {...rest}>
      {data &&
        data.map((item, idx) => (
          <li key={idx} onClick={() => onChangeTab(item.value)} className={value === item.value ? "selected" : ""}>
            {item.label}
          </li>
        ))}
    </TabMenu>
  );
}

const TabMenu = styled.ul`
  width: 100%;
  overflow-x: auto;
  display: flex;
  height: 40px;
  line-height: 40px;
  color: var(--bs-primary);
  li {
    padding-inline: 20px;
    text-align: center;
    &.selected {
      border-bottom: 3px solid var(--bs-primary);
    }
  }
`;
