import Layout from "../components/layout/layout";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import styled from "styled-components";
import {useEffect, useState} from "react";
import UserModal from "../components/userModal";
import publicJs from "../utils/publicJs";
import Avatar from "../components/common/avatar";
import {getCityHallNode} from "../api/cityhall";
import useQuerySNS from "../hooks/useQuerySNS";
import {getUsers} from "../api/user";
import {useSelector} from "react-redux";
import useToast from "../hooks/useToast";

const LayoutContainer = styled.div`
  padding-inline: 20px;
  padding-bottom: 20px;
  background-color: var(--background-color);
`;


const GroupItemStyle = styled.div`
  margin-top: 16px;
`;


const GroupName = styled.div`
  font-size: 13px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: var(--font-light-color);
  line-height: 17px;
  margin-bottom: 10px;
`;


const GroupMembers = styled.div`
  min-height: 100px;
  background: #ffffff;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.02);
  border-radius: 16px;
  display: flex;
  box-sizing: border-box;
  padding:20px;
  flex-direction: column;

`;

const MemberAvatarStyle = styled.div`
  display: flex;
  
  font-size: 12px;
  align-items: flex-start;
  margin-top: 20px;
  &:first-child{
    margin-top: 0;
  }
.rhtBox{
  flex-grow: 1;
}
  .sns {
    margin-top: 8px;
    line-height: 21px;
    color: var(--font-color-1);
    box-sizing: border-box;
    padding: 0 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
  }
  .name {
    width: 100%;
    box-sizing: border-box;
    color: #9a9a9a;
    padding: 0 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const AvatarBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
  }
`;


const MemberAvatar = ({ user, onSelect }) => {
    const reFormat = () =>{
        if(user?.sns?.toLowerCase() === user?.wallet?.toLowerCase()){
            return  publicJs.AddressToShow(user.wallet,10)
        }else{
            return user.sns;
        }
    }

    return (
        <MemberAvatarStyle line={1}>
            <AvatarBox onClick={onSelect}>
                <Avatar src={user.avatar|| user?.sp?.avatar} size="44px" />
            </AvatarBox>
            <div className="rhtBox">
                <div className="sns">{reFormat()}</div>
                <div className="name">{user.name || user?.sp?.nickname}</div>
            </div>

        </MemberAvatarStyle>
    );
};


const GroupItem = ({ name, members }) => {
    const [user, setUser] = useState();

    return (
        <GroupItemStyle>
            {user && <UserModal user={user} handleClose={() => setUser(undefined)} />}
            <GroupMembers>
                {members.map((item, i) => (
                    <MemberAvatar key={i} user={item} onSelect={() => setUser(item)} />
                ))}
            </GroupMembers>
        </GroupItemStyle>
    );
};




export default function Node(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [walletList, setWalletList] = useState([]);
    const { getMultiSNS } = useQuerySNS();
    const [userMap, setUserMap] = useState(null);
    const [techMembers, setTechMembers] = useState([]);
    const { Toast, toast } = useToast();
    const snsMap = useSelector((state) => state.snsMap);

    const getDetail = async () => {
        try {
            const dt = await getCityHallNode();
            const wallets = dt.data;
            setWalletList(wallets)
            await getUsersInfo(wallets);
            await getMultiSNS(wallets);

        } catch (error) {
            logError(error);
            toast.danger(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`);
        }
    };

    const getUsersInfo = async (wallets) => {

        try {
            const res = await getUsers(wallets);
            const userData= {};
            res.data.forEach((r) => {
                userData[(r.wallet || '').toLowerCase()] = r;
            });
            setUserMap(userData);
        } catch (error) {
            logError('getUsersInfo error:', error);
            toast.danger(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`);
        }
    };


    useEffect(() => {
        getDetail();
    }, []);

    const handleMembers = (members) => {
        return members.map((w) => {
            const user = userMap[w.toLowerCase()];

            if (user) {
                return {
                    ...user,
                    sns: snsMap[(w.toLowerCase())]
                        ? snsMap[(w.toLowerCase())]
                        : w,
                };
            } else {
                return {
                    id: '',
                    name: '',
                    avatar: '',
                    discord_profile: '',
                    twitter_profile: '',
                    wechat: '',
                    mirror: '',
                    bio: '',
                    assets: [],
                    wallet: w.toLowerCase(),
                    sns: '',
                };
            }
        });
    };

    useEffect(() => {
        if(!userMap || !snsMap)return;
        let rt =  handleMembers(walletList);
        setTechMembers(rt)
    }, [userMap,snsMap]);

    return <Layout
        title={t('Governance.nodeMembers')}
        handleBack={() => {
            navigate("/home");
        }}
        headBgColor={`var(--background-color)`} bgColor="var(--background-color)"
    >
        <LayoutContainer>
            <GroupItem name={t("Governance.CityhallTech")} members={techMembers} />
        </LayoutContainer>
        {Toast}
    </Layout>
}
