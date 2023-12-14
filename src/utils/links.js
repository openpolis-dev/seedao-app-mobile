import RImg1 from "assets/Imgs/resources/1.png";
import RImg2 from "assets/Imgs/resources/2.png";
import RImg3 from "assets/Imgs/resources/3.png";
import RImg4 from "assets/Imgs/resources/4.png";
import RImg5 from "assets/Imgs/resources/5.png";
import RImg6 from "assets/Imgs/resources/6.png";
import RImg7 from "assets/Imgs/resources/7.png";
import RImg8 from "assets/Imgs/resources/8.png";

const links = {
  resource: [
    {
      name: "Resources.Calendar",
      link: "https://tally.so/r/mKxkWD",
      id: "resource-calendar",
      icon: RImg1,
      desc: "Resources.CalendarReviewDesc",
      hideTitle: 0,
      hiddenFields: [],
    },
    {
      name: "Resources.Community",
      link: "https://tally.so/r/mBp09R",
      id: "resource-community",
      icon: RImg2,
      desc: "Resources.CommunityDesc",
      hideTitle: 0,
      hiddenFields: ["name", "sns", "wallet"],
    },
    {
      name: "Resources.Hub",
      link: "https://tally.so/r/mDKbqb",
      id: "resource-community",
      icon: RImg3,
      desc: "Resources.HubDesc",
      hideTitle: 0,
      hiddenFields: ["name", "sns", "wallet", "seed"],
    },
    {
      name: "Resources.Media",
      link: "https://tally.so/r/wzMRBE",
      id: "resource-Media",
      icon: RImg4,
      desc: "Resources.MediaDesc",
      hideTitle: 0,
      hiddenFields: ["name", "sns", "wallet"],
    },
    {
      name: "Resources.App",
      link: "https://tally.so/r/3XozzP",
      id: "resource-Apps",
      icon: RImg5,
      desc: "Resources.AppDesc",
      hideTitle: 0,
      hiddenFields: ["name", "sns", "wallet"],
    },
    {
      name: "Resources.Project",
      link: "https://tally.so/r/w2AWlp",
      id: "resource-Projects",
      icon: RImg6,
      desc: "Resources.ProjectDesc",
      hideTitle: 0,
      hiddenFields: ["name", "sns", "wallet"],
    },
    {
      name: "Resources.Guild",
      link: "https://tally.so/r/3NXjRW",
      id: "resource-Guilds",
      icon: RImg7,
      desc: "Resources.GuildDesc",
      hideTitle: 0,
      hiddenFields: ["name", "sns", "wallet"],
    },
    {
      name: "Resources.Incubator",
      link: "https://tally.so/r/wAr0Q0",
      id: "resource-Apps",
      icon: RImg8,
      desc: "Resources.IncubatorDesc",
      hideTitle: 0,
      hiddenFields: ["name", "sns", "wallet"],
    },
    // {
    //   name: 'Resources.Seed',
    //   link: 'https://seed.seedao.xyz/',
    //   id: 'Seed',
    //   icon: SeedIcon,
    //   desc: 'Resources.SeedDesc',
    // },
  ],
};

export default links;
