import MetaforoIcon from '../assets/Imgs/home/Metaforo.png';
import AaanyIcon from '../assets/Imgs/home/AAAny.png';
import DeschoolIcon from '../assets/Imgs/home/Deschool.png';
import DaolinkIcon from '../assets/Imgs/home/DAOlink.png';
import Cascad3Icon from '../assets/Imgs/home/Cascad3.png';
import Wormhole3Icon from '../assets/Imgs/home/Wormhole3.png';
import SeeUImg from '../assets/Imgs/home/seeuNetwork.png';
import SNSImg from "../assets/Imgs/home/SNS.jpg";

const apps =  [
    {
        id: 'Deschool',
        name: 'DeSchool',
        link: 'https://deschool.app/origin/plaza',
        icon: DeschoolIcon,
        desc: 'apps.DeschoolDesc',
    },
    {
        id: 'AAAny',
        name: 'AAAny',
        link: 'https://apps.apple.com/ca/app/aaany-ask-anyone-anything/id6450619356',
        icon: AaanyIcon,
        desc: 'apps.AAAnyDesc',
    },
    {
        id: 'Cascad3',
        name: 'Cascad3',
        link: 'https://www.cascad3.com/',
        icon: Cascad3Icon,
        desc: 'apps.Cascad3Desc',
    },
    {
        id: 'DAOLink',
        name: 'DAOLink',
        link: 'https://app.daolink.space',
        icon: DaolinkIcon,
        desc: 'apps.DAOLinkDesc',
    },
    {
        id: 'Wormhole3',
        name: 'Wormhole3',
        link: 'https://alpha.wormhole3.io',
        icon: Wormhole3Icon,
        desc: 'apps.Wormhole3Desc',
    },
    {
        id: 'Metaforo',
        name: 'Metaforo',
        link: 'https://forum.seedao.xyz/',
        icon: MetaforoIcon,
        desc: 'apps.MetaforoDesc',
    },
    // {
    //   id: 'module-pub',
    //   name: 'apps.Hub',
    //   link: '/pub',
    //   icon: '',
    //   desc: 'apps.HubDesc',
    // },
    // {
    //   id: 'online',
    //   name: 'Home.OnlineEvent',
    //   link: 'https://calendar.google.com/calendar/u/0?cid=c2VlZGFvLnRlY2hAZ21haWwuY29t',
    //   icon: <Calendar />,
    //   desc: '',
    // },
    {
        id: 'seeu',
        name: 'apps.SeeU',
        link: 'https://seeu.network/',
        icon: SeeUImg,
        desc: 'apps.SeeUDesc',
    },
    {
      id: "module-sns",
      name: "apps.SNS",
      link: "/sns/register",
      icon: SNSImg,
      desc: "apps.SNSDesc",
    },
    {
      id: "module-newcomer",
      name: "apps.Newcomer",
      link: "/newcomer",
      desc: ""
    }
];
 export default apps;
