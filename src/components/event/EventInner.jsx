// import {EventDetail} from "seeucomp";
import styled from "styled-components";
import {useEffect, useState} from "react";
import store from "../../store";
import {saveLoading} from "../../store/reducer";
import {getSeeuEventDetail} from "../../api/event";
import useToast from "../../hooks/useToast";
import NewDetail from "./newDetail";

const EventDetail= styled.div`
`

const EventContent = styled.div`
  padding-inline: 20px;
  .eventDetail {
    img {
      max-width: 100%;
    }
    p {
      margin-block: 10px;
    }
    & > div:first-child {
      flex-direction: column;
      gap: 30px;
      img {
        width: unset;
        max-width: 100%;
      }
      & > div:first-child {
        flex: unset !important;
        min-width: 100%!important;
        width: unset !important;
      }
    }
    .meetDetailBlock {
      margin-block: 10px;
      padding: 10px 0 0;
      border-top: 1px solid rgb(51, 51, 51);
      dl {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
        dt {
          margin-bottom: 6px;
        }
        dd {
          line-height: 26px;
        }
      }
    }
  }
`;

export default function EventInner({id}){

    const [data, setData] = useState();
    const { Toast, toast } = useToast();

    useEffect(() => {
        const getDetail = async () => {
            if (!id) {
                return;
            }
            try {
                store.dispatch(saveLoading(true));
                // const resp = await getSeeuEventDetail(id);
                const resp = await fetch("/data/eventList.json");
                let rt = await resp.json();

                const list = rt.data.items;
                const detail = list.find((item) => item.record_id === id);
                setData(detail);
            } catch (error) {
                logError(error);
                toast.danger(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`);
            } finally {
                store.dispatch(saveLoading(false));
            }
        };
        getDetail();
    }, [id]);
    return <>
        <EventContent>{data && <NewDetail item={data} isAspect={true} />}      {Toast}</EventContent>
    </>
}
