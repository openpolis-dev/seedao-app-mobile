import Layout from "../components/layout/layout";
import styled from "styled-components";
import {useState} from "react";
import {useTranslation} from "react-i18next";

const Box = styled.div`
    padding: 0 20px;
`
export default function Setting() {

    const {t,i18n} = useTranslation();
    const [list] = useState([
        {
            name: "中文",
            value: "zh"
        },
        {
            name: "English",
            value: "en"
        }
    ])
    const returnLan = () =>{
        const arr = list.filter(item=>item.value === i18n.language )
        return arr[0].name
    };

    const changeLan = (index) =>{
        i18n.changeLanguage(list[index].value);
        // setShow(false);

        // let str = list[index].value === "zh"? "zh-Hans":list[index].value
    }


    return <Layout noTab title="Setting">
        <Box>

            {list.map((l, i) => (
                <div
                    key={i}
                    onClick={()=>changeLan(i)}
                >
                        <div>{l.name}</div>
                </div>
            ))}

            lan
            <div>{returnLan()}</div>
        </Box>
    </Layout>
};
