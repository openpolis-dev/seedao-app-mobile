import MetaforoIcon from '../assets/Imgs/home/Metaforo.png';
import AaanyIcon from '../assets/Imgs/home/AAAny.png';
import DeschoolIcon from '../assets/Imgs/home/Deschool.png';
import DaolinkIcon from '../assets/Imgs/home/DAOlink.png';
import Cascad3Icon from '../assets/Imgs/home/Cascad3.png';
import Wormhole3Icon from '../assets/Imgs/home/Wormhole3.png';
import SeeUImg from '../assets/Imgs/home/seeuNetwork.png';
import SNSImg from "../assets/Imgs/home/SNS.jpg";
import EchoImg from "../assets/Imgs/home/echo.svg";
import CreditImg from "../assets/Imgs/home/credit.jpg";
import PodcastImg from '../assets/Imgs/home/podcast.jpeg';
import SNSQueryImg from "../assets/Imgs/home/snsquery.png"
import AssistantImg from "../assets/Imgs/home/assistant.png";
import AiImg from "../assets/Imgs/home/ai.jpeg";

const apps =  [
    {
        id: 'module-ai',
        name: 'apps.chatAI',
        link: '/ai',
        icon: AiImg,
        desc: 'apps.chatAITips',
    },
    {
        id: "module-sns",
        name: "apps.SNS",
        link: "/sns/register",
        icon: SNSImg,
        desc: "apps.SNSDesc",
    },
    {
        id: 'podcast',
        name: 'apps.podcastTitle',
        link: 'https://www.xiaoyuzhoufm.com/podcast/64a27b216d90c5786108abbc',
        icon: PodcastImg,
        desc: 'apps.podcastDesc',
    },
    {
        id: 'module-sns',
        name: 'apps.snsQuery',
        link: '/search-profile',
        icon: SNSQueryImg,
        desc: 'apps.SNSQueryDesc',
    },
    {
        id: 'module-assistant',
        name: 'apps.assistant',
        link: '/assistant',
        icon: AssistantImg,
        desc: 'apps.assistantDes',
    },

    {
        id: 'module-credit',
        name: 'apps.Credit',
        link: '/credit',
        icon: CreditImg,
        desc: 'apps.CreditDesc',
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
      id: 'coming-soon',
      name: 'See Swap',
      link: '',
      icon: 'https://avatars.githubusercontent.com/u/36115574?s=200&v=4',
      desc: 'Coming Soon',
    },
    // {
    //   id: "module-newcomer",
    //   name: "apps.Newcomer",
    //   link: "/newcomer",
    //   desc: ""
    // }
];
 export default apps;
