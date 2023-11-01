import {Swiper,SwiperSlide} from "swiper/react";
import {Grid, Pagination} from "swiper/modules";

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import styled from "styled-components";
import {useMemo} from "react";
import {useTranslation} from "react-i18next";

import MetaforoIcon from 'assets/images/apps/metaforo.png';
import AaanyIcon from 'assets/images/apps/AAAny.svg';
import DeschoolIcon from 'assets/images/apps/deschool.png';
import DaolinkIcon from 'assets/images/apps/daolink.svg';
import Cascad3Icon from 'assets/images/apps/cascad3.svg';
import Wormhole3Icon from 'assets/images/apps/wormhole3.svg';
import Calendar from "assets/images/apps/calendar.png";
import OffImg from "assets/images/apps/logo-dark.png";
import {useNavigate} from "react-router-dom";


const Box = styled.div`
    .swiper-slide{
      background: #fff;
    }
`

const CenterBox = styled(Swiper)`
    width: 90vw;
  height: 250px;
  .libox{
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .imgBox{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  img{
    height: 60px;
    width:60px;
    object-fit: contain;
    object-position: center;
  }
`

export default function SwiperBanner(){
    const { t } = useTranslation();
    const navigate = useNavigate();

    const Links = [
        {
            id: 'Deschool',
            name: 'Deschool',
            link: 'https://deschool.app/origin/plaza',
            icon: <img src={DeschoolIcon} alt="" />,
        },
        {
            id: 'AAAny',
            name: 'AAAny',
            link: 'https://apps.apple.com/ca/app/aaany-ask-anyone-anything/id6450619356',
            icon: <img src={AaanyIcon} alt="" style={{ transform: 'scale(1.3)' }} />,
        },
        {
            id: 'Cascad3',
            name: 'Cascad3',
            link: 'https://www.cascad3.com/',
            icon: <img src={Cascad3Icon} alt=""  />,
        },
        {
            id: 'DAOLink',
            name: 'DAOLink',
            link: 'https://app.daolink.space',
            icon: <img src={DaolinkIcon} alt="" />,
        },
        {
            id: 'Wormhole3',
            name: 'Wormhole3',
            link: 'https://alpha.wormhole3.io',
            icon: <img src={Wormhole3Icon} alt="" />,
        },
        {
            id: 'Metaforo',
            name: 'Metaforo',
            link: 'https://www.metaforo.io',
            icon: <img src={MetaforoIcon} alt="" />,
        },
        {
            id: 'online',
            name: 'Home.OnlineEvent',
            link: 'https://calendar.google.com/calendar/u/4?cid=YzcwNGNlNTA5ODUxMmIwYjBkNzA3MjJlNjQzMGFmNDIyMWUzYzllYmM2ZDFlNzJhYTcwYjgyYzgwYmI2OTk5ZkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t',
            icon: <img src={Calendar} />,
        },
        {
            id: 'offline',
            name: 'Home.OfflineEvent',
            link: 'https://seeu.network/',
            icon: <img src={OffImg} />,
        },
        {
            id: 'pub',
            name: 'Home.pub',
            link: '',
            icon: <img src={OffImg} />,
        },
    ]

    const events = useMemo(() => {
        // @ts-ignore
        return Links.map((item) => ({ ...item, name: t(item.name) }));
    }, [t]);


    const handleClickEvent = (id,link) => {
        if (id === 'online') {
            navigate('/online-event');
        } else  if (id === 'pub') {
            navigate('/pub');
        } else {
            window.open(link, '_blank');
        }
    };

    return <Box>
        <CenterBox
            slidesPerView={3}
            grid={{
                rows: 2,
            }}
            spaceBetween={10}
            pagination={{
                clickable: true,
            }}

            modules={[Grid, Pagination]}
        >
            {
                events.map((item,index)=>(<SwiperSlide className="libox" key={index} onClick={()=>handleClickEvent(item.id,item.link)}>
                    <div>
                        <div>
                            <div className="imgBox">
                                {
                                    item.icon
                                }
                            </div>

                            <div>{item.name}</div>
                        </div>
                    </div>
                </SwiperSlide>))
            }
        </CenterBox>
    </Box>
}
