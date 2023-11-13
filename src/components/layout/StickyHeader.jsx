import styled from "styled-components";

const TopBox = styled.div`
    background: ${props => props.bgcolor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  position: fixed;
  width: 100vw;
  .lft{
    font-size: 30px;
    font-family: Poppins-SemiBold;
    font-weight: 600;
    color: #1A1323;
    line-height: 36px;
  }
`
export default function StickyHeader({title,bgcolor}){
    return <TopBox bgcolor={bgcolor}>
        <div className="lft">
            {title}
        </div>
</TopBox>
}
