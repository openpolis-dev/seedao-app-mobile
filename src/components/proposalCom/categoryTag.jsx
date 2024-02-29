import styled from 'styled-components';

const CategoryTag = styled.div`
  display: inline-block;
  border-radius: 4px;

  border: 1px solid var(--border-color-2);
  color: var(--border-color-2);
  font-size: 12px;
  padding: 0 6px;
  line-height: 20px;
  height: 20px;
  box-sizing: border-box;
`;

export default CategoryTag;


export const formatCategory = (name) => {
  if (name.includes("节点共识大会")) {
    return "公共项目";
  }
  if (name.includes("市政厅联席会议")) {
    return "市政厅联席会议";
  }
  if (name.includes("立项")) {
    return name.replace("立项", "");
  }
  return name;
};

