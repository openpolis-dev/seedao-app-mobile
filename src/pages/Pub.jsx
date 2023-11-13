import Layout from "../components/layout/layout";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import styled from "styled-components";

const Box = styled.div`
    margin: 0 20px;
`
const Row = styled.div``
const Col = styled.div``

const InnerBox = styled.ul`
  background: #fff;
  border-radius: 16px;
  box-sizing: border-box;
  margin-bottom: 20px;
  box-shadow: 0 5px 10px rgba(0,0,0,0.1);

  .imgBox {
    width: 100%;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      min-height: 140px;
      object-position: center;
      object-fit: cover;
    }
  }
  .btm {
    padding: 20px;
    font-size: 12px;
    box-sizing: border-box;
  }
  li {
    margin-bottom: 10px;
    &.line2 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
`;

const TagBox = styled.div`
  background: var(--bs-primary);
  display: inline-block;
  color: #fff;
  padding: 3px 10px;
  border-radius: 5px;

  &.str1 {
    background: #b0b0b0;
  }
  &.str2 {
    background: var(--bs-primary);
  }
  &.str3 {
    background: #00a92f;
  }
`;

const TypeBox = styled(TagBox)`
  padding: 3px 10px;
  opacity: 1;
  margin: 5px 10px 10px 0;
  color: #000;
  &.type1 {
    background: rgb(250, 222, 201);
  }
  &.type2 {
    background: rgb(253, 236, 200);
  }
  &.type3 {
    background: rgb(255, 226, 221);
  }

  &.type4 {
    background: rgb(219, 237, 219);
  }
  &.type5 {
    background: rgb(227, 226, 224);
  }
  &.type6 {
    background: rgb(211, 229, 239);
  }
  &.type7 {
    background: rgb(238, 224, 218);
  }
`;



const Tit = styled.li`
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  color: var(--bs-body-color_active);
  font-family: 'Poppins-SemiBold';
`;


export default function Pub(){
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const { t } = useTranslation();


    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        //
        // try{
        //   let result = await axios.get(`https://api.notion.com/v1/databases/73d83a0a-258d-4ac5-afa5-7a997114755a`,{
        //     headers:{
        //       Authorization: `Bearer ${secretKey}`,
        //       'Notion-Version': '2022-06-28'
        //     }
        //   });
        //   console.log(result);
        // }catch (e){
        //
        // }

        // dispatch({ type: AppActionType.SET_LOADING, payload: true });
        try {
            let result = await axios.get(`https://notion-api.splitbee.io/v1/table/73d83a0a-258d-4ac5-afa5-7a997114755a`);
            setList(result.data);
        } catch (e) {
            console.error(e);
        } finally {
            // dispatch({ type: AppActionType.SET_LOADING, payload: false });
        }
    };

    const returnColor = (str) => {
        let colorStr = '';
        switch (str.trim()) {
            case '项目招募 | Project Recruitment':
            case '项目招募':
                colorStr = 'type1';
                break;
            case '外部招募 | external recruitment':
                colorStr = 'type2';
                break;
            case '公会招募  | Guild Recruitment':
                colorStr = 'type3';
                break;
            case '个人组队 | Team recruitment':
                colorStr = 'type4';
                break;
            case '市政厅招募 | City hall recruitment':
                colorStr = 'type5';
                break;
            case '新手任务':
                colorStr = 'type6';
                break;
            case '孵化器Workshop':
            default:
                colorStr = 'type7';
                break;
        }
        return colorStr;
    };

    const ToGo = (id) => {
        navigate(`/pubDetail/${id}`);
    };

    const returnStatus = (str) => {
        let cStr = '';
        switch (str.trim()) {
            case '已归档':
                cStr = 'str1';
                break;
            case '已认领':
                cStr = 'str2';
                break;
            case '招募中':
            default:
                cStr = 'str3';
                break;
        }
        return cStr;
    };

    return <Layout title={t("Home.pub")} noTab>
        <Box>


        <Row>
            {list.map((item, index) => (
                <Col md={12} xs={12} key={index} onClick={() => ToGo(item.id)}>
                    <InnerBox>
                        <div className="imgBox">
                            <img
                                src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F619174d0-2125-4cf1-b6af-1f661d73dd19%2Fbanner_1920x1080.jpg?id=7f4920bb-2ad7-41d7-a016-a6afa14aa9ce&table=block&spaceId=5a4585f0-41bf-46b1-8321-4c9d55abc37a&width=550&userId=6fa9ac45-fb72-4109-81ad-54cbd7bb6315&cache=v2"
                                alt=""
                            />
                        </div>
                        <ul className="btm">
                            <Tit>{item['悬赏名称']}</Tit>
                            {item['悬赏状态'] && (
                                <li>
                                    <TagBox className={returnStatus(item['悬赏状态'])}>{item['悬赏状态']}</TagBox>
                                </li>
                            )}
                            <li>
                                {item['悬赏类型'] &&
                                    (item['悬赏类型']).map((innerItem, innerIndex) => (
                                    <TypeBox key={`${index}_${innerIndex}`} className={returnColor(innerItem)}>
                                {innerItem}
                            </TypeBox>
                            ))}
                        </li>
                        <li>招募截止时间：{item['招募截止时间']}</li>

                        <li className="line2">{item['贡献报酬']}</li>
                    </ul>
                </InnerBox>
                </Col>
                ))}
        </Row>
        </Box>
    </Layout>

}
