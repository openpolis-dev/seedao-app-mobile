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
  height: 99px;
  border-radius: 16px;
  background: url(${props => props.url}) no-repeat center;
  background-size: cover;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  box-sizing: border-box;
  padding: 24px 0;
`
const TitleBox = styled.div`
    text-align: center;
  font-size: 15px;
  font-family: Poppins-SemiBold;
  font-weight: 600;
  color: #FFFFFF;
  white-space: nowrap;
  width: 90%;
  box-sizing: border-box;
  text-overflow: ellipsis;
  overflow: hidden;
`

const DescBox = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 1.5em;
  flex-grow: 1;
  margin-right: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const LinkBox = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 1.5em;
  flex-shrink: 0;
`

const Bfst = styled.div`
    display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
`

export default function Adv(){
  const { t } = useTranslation();
  const openLink = (link) => {
    if (link) {
      window.open(link, "_blank")
    }
  }
    return <BannerBox>
        <Swiper
            modules={[Autoplay]}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
            }}
        >
            {
                banner?.map((item,index)=>( <SwiperSlide key={`banner_${index}`}>
                    <BannerLi url={item.img} onClick={() => openLink(item.link)}>
                        <TitleBox>{item.name}{item.desc}</TitleBox>
                        <Bfst>
                      <DescBox>{item.desc}</DescBox>
                      {item.link && <LinkBox>{t('home.more')} &gt;</LinkBox>}
                        </Bfst>

                    </BannerLi>
                </SwiperSlide>))
            }
        </Swiper>


    </BannerBox>
}
