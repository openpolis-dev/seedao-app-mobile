import styled from "styled-components";

import {Swiper,SwiperSlide} from "swiper/react";

import 'swiper/css';
import 'swiper/css/pagination';

const BannerBox = styled.div`
    width: 100%;
  
  img{
    width: 100%;

  }
`

const BannerLi = styled.div`
    margin: 0 20px;
  height: 198px;
  border-radius: 16px;
  background: url(${props => props.url}) no-repeat center;
  background-size: cover;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  position: relative;
`
const TitleBox = styled.div`
    text-align: center;
  font-size: 22px;
  font-family: Poppins-SemiBold;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 9px;
`

const DescBox = styled.div`
  width: 62%;
  font-size: 15px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 1.5em;
  text-align: center;
`

const LinkBox = styled.div`
  position: absolute;
  font-size: 13px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 1.5em;
  right: 15px;
  bottom: 10px;
`

export default function Adv(){
    return <BannerBox>
        <Swiper>
            <SwiperSlide>
                <BannerLi url="https://img0.baidu.com/it/u=741268616,1401664941&fm=253&fmt=auto&app=138&f=JPEG?w=748&h=500">
                    <TitleBox>SeeDAO APP</TitleBox>
                    <DescBox>正式v0.0.1开始发布！含测试奖励怎么领取奖励呢</DescBox>
                    <LinkBox>查看内容 &gt;</LinkBox>
                </BannerLi>
            </SwiperSlide>
            <SwiperSlide>
                <BannerLi url="https://img2.baidu.com/it/u=2257799194,2566047008&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=800">
                    <TitleBox>SeeDAO APP</TitleBox>
                    <DescBox>正式v0.0.1开始发布！含测试奖励怎么领取奖励呢</DescBox>
                    <LinkBox>查看内容 &gt;</LinkBox>
                </BannerLi>
            </SwiperSlide>
            <SwiperSlide>
                <BannerLi url="https://img2.baidu.com/it/u=3012806272,1276873993&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500">
                    <TitleBox>SeeDAO APP</TitleBox>
                    <DescBox>正式v0.0.1开始发布！含测试奖励怎么领取奖励呢</DescBox>
                    <LinkBox>查看内容 &gt;</LinkBox>
                </BannerLi>
            </SwiperSlide>
        </Swiper>


    </BannerBox>
}
