import styled from "styled-components";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay,Pagination } from "swiper/modules";
import banner from "../../constant/banner";

import 'swiper/css';
import "swiper/css/pagination";

import "swiper/css";
import { useTranslation } from "react-i18next";

const BannerBox = styled.div`
  width: 100%;
  img {
    width: 100%;
  }
  .mySwiper{
    padding-bottom: 30px;
    margin-bottom: -20px;
  }
  .swiper-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet, .swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet{
    background: var(--primary-color);
  }
`;

const BannerLi = styled.div`
  margin: 0 20px;
  height: 99px;
  border-radius: 16px;
  background: url(${(props) => props.url}) no-repeat center;
  background-size: cover;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  box-sizing: border-box;
  padding: 24px 0;
`;
const TitleBox = styled.div`
  font-size: 17px;
  font-family: Poppins-SemiBold;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  width: 90%;
  box-sizing: border-box;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const DescBox = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.5em;
  flex-grow: 1;
  margin-right: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LinkBox = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.5em;
  flex-shrink: 0;
`;

const Bfst = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
`;

export default function Adv() {
  const { t } = useTranslation();
  const openLink = (link) => {
    if (link) {
      window.open(link, "_blank");
    }
  };
  return (
    <BannerBox>
      <Swiper
        modules={[Autoplay,Pagination]}
        pagination={true}
        className="mySwiper"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
      >
        {banner?.map((item, index) => (
          <SwiperSlide key={`banner_${index}`}>
            <BannerLi url={item.img} onClick={() => openLink(item.link)}>
              <TitleBox>
                {item.name}
              </TitleBox>
              <Bfst>
                <DescBox>{item.desc}</DescBox>
                {item.link && <LinkBox>{t("home.more")} &gt;</LinkBox>}
              </Bfst>
            </BannerLi>
          </SwiperSlide>
        ))}
      </Swiper>
    </BannerBox>
  );
}
