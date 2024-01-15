import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getSeeuEventList } from "api/event";
import EventCard, { EventCardSkeleton } from "./eventCard";
import { useNavigate } from "react-router-dom";

const Box = styled.div`
  padding: 0 24px 20px;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  & > div {
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

  useEffect(() => {
    const getList = async () => {
      setLoading(true);
      try {
        const res = await getSeeuEventList({ currentPage: 1, pageSize:10 });
        const rt = res.data.data.filter((item)=>item.status==="进行中")
        setList(rt.slice(0,2));
        setLoading(false);
      } catch (error) {
        //  TODO toast
        logError(error);
      }
    };
    getList();
  }, []);
  const openEvent = (id) => {
    navigate(`/event/view?id=${id}`);
  }
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
                    list.map((item, index) => <EventCard event={item} key={index} handleClick={openEvent} />)
                )}
              </List>
            </Box>
        }

      </>


  );
}


