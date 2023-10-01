import styled from "styled-components";

export default function Tab({ data, onChangeTab, value, ...rest }) {
  return (
    <TabMenu {...rest}>
      <ul>
        {data &&
          data.map((item, idx) => (
            <li key={idx} onClick={() => onChangeTab(item.value)} className={value === item.value ? "selected" : ""}>
              {item.label}
            </li>
          ))}
      </ul>
    </TabMenu>
  );
}

const TabMenu = styled.div`
  width: 100%;
  overflow-x: auto;
  height: 40px;
  line-height: 40px;
  color: var(--bs-primary);
  ul {
    display: flex;
    height: 40px;
  }
  li {
    padding-inline: 20px;
    white-space: nowrap;
    text-align: center;
    &.selected {
      border-bottom: 3px solid var(--bs-primary);
    }
  }
`;
