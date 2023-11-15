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
  height: 40px;
  line-height: 40px;
  color: var(--bs-primary);

  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;

  ul {
    display: flex;
    height: 40px;
    background: #EEEEF4;
    border-radius: 8px;
    overflow: hidden;
  }
  li {
    padding-inline: 20px;
    white-space: nowrap;
    text-align: center;
    &.selected {
      background: var(--primary-color);
      color:#fff;
    }
  }
`;
