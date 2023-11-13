import styled from "styled-components";

const TopBox = styled.div`
    background: var(--background-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export default function StickyHeader(   {children}){
    return <TopBox>   {children}</TopBox>
}
