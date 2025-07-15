import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getSeeuEventList } from "api/event";
import EventCard, { EventCardSkeleton } from "./eventCard";
import { useNavigate } from "react-router-dom";
import useToast from "../../hooks/useToast";
import NewEvent from "./newEvent";
import dayjs from "dayjs";

const Box = styled.div`
  padding: 0 24px 20px;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  & > div {
    background: var( --background-color-1);
    border-radius: 16px;
    overflow: hidden;
    &:last-of-type {
      border-bottom: none;
    }
  }
`;

const TitleBox = styled.div`
  margin-bottom: 16px;
  font-size: 20px;
  font-family: Poppins-SemiBold;
  font-weight: 600;
  color: #1A1323;
  line-height: 22px;
`

export default function Event() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const { Toast, toast } = useToast();

  useEffect(() => {
    const getList = async () => {
      setLoading(true);
      try {
        // const res = await getSeeuEventList({ currentPage: 1, pageSize:10 });
        // const rt = res.data.data.filter((item)=>item.status==="进行中")

        const resp = await fetch("/data/eventList.json");
        let rt = await resp.json();

        const list = rt.data.items.slice(0,5);

        let arr = [];
        list.map((item) => {
          let startDay = dayjs(item.fields['活动日期']).format(`YYYY-MM-DD`);
          arr.push({
            startDay,
            startTime:item.fields['活动时间'] ? item.fields['活动时间'][0].text :"",
            poster: item.fields['活动照片/海报'] ? item.fields['活动照片/海报'][0].name :"",
            subject:item.fields['活动名称'] ? item.fields['活动名称'][0]?.text:"",
            activeTime:item.fields['活动时长'] ? item.fields['活动时长'][0].text :"",
            city:item.fields['活动地点'] ? item.fields['活动地点'][0].text :"",
            fee:item.fields['活动费用'] ?item.fields["活动费用"][0].text:"",
            type:item?.fields["活动类型"] ?? "",
            id:item?.record_id
          });
        })
        setList(arr);
        setLoading(false);
      } catch (error) {
        logError(error);
        toast.danger(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`);

      }
    };
    getList();
  }, []);
  // const openEvent = (id) => {
  //   navigate(`/event/view?id=${id}`);
  // }
  return (
      <>
        {
          !!list?.length && <Box>
              <TitleBox>{t("home.events")}</TitleBox>
              <List>
                {loading ? (
                    <>
                      <EventCardSkeleton />
                      <EventCardSkeleton />
                    </>
                ) : (
                    list.map((item, index) => <NewEvent item={item} key={index}  />)
                )}
              </List>
            </Box>
        }
        {Toast}
      </>


  );
}


