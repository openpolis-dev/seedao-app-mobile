import styled from "styled-components";


const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-direction: column;
  flex-shrink: 0;
  width: 126px;
  height: 110px;
  background: #fff;
  border-radius: 20px;
  margin-right: 12px;
`
const InnerBox = styled.div`
  display: flex;
  align-items: center;
  .imgBox{
    width: 44px;
    height: 44px;
    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius:120px;
      border:2px solid #fff;

    }
  }
  .fst{
    position: relative;

  }
  .snd{
    
    margin-left: -20px;
    z-index: 10;
  }
`

const FlexBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  .decBtm{
    z-index: 9;
    font-size: 12px;
    font-weight: 400;
    color: #000000;
    line-height: 14px;
    .nft{
      font-size: 10px;
      font-weight: 400;
      color: #9A9A9A;
      line-height: 14px;
    }
  }
  .num{
    z-index: 9;
    font-size: 32px;
    font-family: Poppins-SemiBold;
    font-weight: 600;
    color: #000000;
    line-height: 32px;
  }
`
export default function SbtCatMobile({item}){
    return <Box>
        <InnerBox>
            {
                !!item && item?.tokens[0] &&<div className="imgBox fst">
                    <img src={item?.tokens[0]?.url} alt=""/>
                </div>
            }
            {
                item?.tokens[1] &&  <div className="imgBox snd">
                    <img src={item?.tokens[1]?.url} alt=""/>
                </div>
            }
        </InnerBox>
        <FlexBox>
            <div className="num">{item?.tokens?.length}</div>
            <div className="decBtm">
                <div className="nft">{item?.category}</div>
                <div className="seed">SBT</div>
            </div>
        </FlexBox>


    </Box>
}
