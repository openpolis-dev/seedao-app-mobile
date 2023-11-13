import styled from "styled-components";

import {Swiper,SwiperSlide} from "swiper/react";
import { Autoplay } from 'swiper/modules';
import banner from "../../constant/banner";

import 'swiper/css';
import {useTranslation} from "react-i18next";

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
    const { t } = useTranslation();
    return <BannerBox>
        <Swiper
            modules={[Autoplay]}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
        >
            {
                banner?.map((item,index)=>( <SwiperSlide key={`banner_${index}`}>
                    <BannerLi url={item.img}>
                        <TitleBox>{item.name}</TitleBox>
                        <DescBox>{item.desc}</DescBox>
                        <LinkBox>{t('home.more')} &gt;</LinkBox>
                    </BannerLi>
                </SwiperSlide>))
            }
        </Swiper>


    </BannerBox>
}
