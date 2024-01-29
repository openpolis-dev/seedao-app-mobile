import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { publicList } from '../../api/publicData';


const Box = styled.div`
  margin: 0 24px;
`

const UlBox = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
  .libox {
    width: 100%;
    margin-bottom: 24px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 16px;
  }
`;

const InnerBox = styled.ul`
  background: var(--bs-box-background);
  box-shadow: var(--box-shadow);

  border-radius: 16px;
  box-sizing: border-box;
  height: 100%;

  .imgBox {
    width: 100%;
    height: 140px;
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

const Tit = styled.li`
  font-size: 16px;
  color: var(--bs-body-color_active);
  font-family: 'Poppins-SemiBold';
`;

const TagBox = styled.div`
  background: var(--bs-primary);
  display: inline-block;
  color: #fff;
  padding: 3px 10px;
  border-radius: 5px;
  margin-right: 10px;
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


const TitleBox = styled.div`
  margin-bottom: 16px;
  font-size: 20px;
  font-family: Poppins-SemiBold;
  font-weight: 600;
  color: #1A1323;
  line-height: 22px;
`

const FlexLine = styled.div`
    display: flex;
  align-items: center;
  flex-wrap: wrap;
  &>div{
    padding-bottom: 10px;
  }
`
export default function Hub() {

    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const { t } = useTranslation();

    const [pageCur, setPageCur] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getList();
    }, [pageCur]);

    const getList = async () => {
        const obj = {
            page: pageCur,
            size: pageSize,
        };
        setLoading(true);
        try {
            let result = await publicList(obj);
            const { rows, page, size } = result.data;
            const rt = rows.filter((item)=>(item.properties['悬赏状态']?.select?.name ==="招募中"))
            setList(rt.slice(0,2));
            setPageSize(size);
            setPageCur(page);
        } catch (e) {
            logError(e);
        } finally {
            setLoading(false);
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
        navigate(`/hubDetail/${id}`);
    };

    const returnStatus = (str) => {
        let cStr = '';
        switch (str?.trim()) {
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

    return (
        <>
            {
                !!list?.length && <Box>
                    <TitleBox>{t("Explore.HubTitle")}</TitleBox>
                    <UlBox>
                        {list?.map((item, index) => (
                            <li className="libox" key={index} onClick={() => ToGo(item.id)}>
                                <InnerBox>
                                    <div className="imgBox">
                                        <img src={item?.cover?.file?.url || item?.cover?.external.url} alt="" />
                                    </div>
                                    <ul className="btm">
                                        <Tit>{item.properties['悬赏名称']?.title[0]?.plain_text}</Tit>
                                        <FlexLine>
                                            {item.properties['悬赏状态']?.select?.name && (
                                                <div>
                                                    <TagBox className={returnStatus(item.properties['悬赏状态']?.select?.name)}>
                                                        {item.properties['悬赏状态']?.select?.name}
                                                    </TagBox>
                                                </div>
                                            )}
                                            <div>
                                                {!!item.properties['悬赏类型']?.multi_select?.length &&
                                                    (item.properties['悬赏类型']?.multi_select).map((innerItem, innerIndex) => (
                                                        <TypeBox key={`${index}_${innerIndex}`} className={returnColor(innerItem.name)}>
                                                            {innerItem?.name}
                                                        </TypeBox>
                                                    ))}
                                            </div>
                                        </FlexLine>

                                        <li>招募截止时间：{item.properties['招募截止时间']?.rich_text[0]?.plain_text}</li>

                                        <li className="line2">{item.properties['贡献报酬']?.rich_text[0]?.plain_text}</li>
                                    </ul>
                                </InnerBox>
                            </li>
                        ))}
                    </UlBox>
                </Box>
            }

    </>
);
}
