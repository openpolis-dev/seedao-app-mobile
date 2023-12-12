import styled from "styled-components";
import CopyBox from "./common/copy";
import TwitterIcon from "assets/Imgs/social/twitter.svg";
import MirrorIcon from "assets/Imgs/social/mirror.svg";
import EmailIcon from "assets/Imgs/social/email.svg";
import GithubIcon from "assets/Imgs/social/github1.svg";
import Avatar from "./common/avatar";
import { useEffect } from "react";

export default function UserModal({ user, handleClose }) {
  useEffect(() => {
    document.querySelector("body").classList.add("over-hidden");
    return () => {
      document.querySelector("body").classList.remove("over-hidden");
    };
  }, []);


  const getTitle = (sns) =>{
    if(sns?.indexOf("...")>-1 || !sns){
      return user.wallet;
    }else{
      return user.sns;
    }
  }


  return (
    <UserModalModal>
      <UserModalMask onClick={handleClose} />
      <UserModalModalContent>
        <AvatarBox src={user.avatar || user?.sp?.avatar} alt="" size="84px" />
        <SnsBox>
          <div className="sns">{getTitle(user.sns)}
            <div className="copySns" >
              <CopyBox text={user.wallet}/>
            </div>
          </div>
        </SnsBox>
        <NameBox>{user.name || user.sp?.nickname}</NameBox>
        <BioBox>{user.bio || user.sp?.bio}</BioBox>
        <SocialBox>

          {
            user.sp?.social_accounts?.map((item,index)=>(
                <>
                  {item.network === "twitter" && (
                      <a href={item.identity} target="_blank" rel="noopener noreferrer">
                        <img src={TwitterIcon} alt="" />
                      </a>
                  )}
                  {user.network === "mirror" && (
                      <a href={item.identity} target="_blank" rel="noopener noreferrer">
                        <img src={MirrorIcon} alt="" />
                      </a>
                  )}



                  {user.network === "github" && (
                      <a href={item.identity} target="_blank" rel="noopener noreferrer">
                        <img src={GithubIcon} alt="" />
                      </a>
                  )}
                </>
            ))
          }
          {(user.email || user.sp?.email) && (
              <a href={`mailto:${user.email|| user.sp?.email}`} target="_blank" rel="noopener noreferrer">
                <img src={EmailIcon} alt="" />
              </a>
          )}



        </SocialBox>
      </UserModalModalContent>
    </UserModalModal>
  );
}

const UserModalModal = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
`;

const UserModalMask = styled.div`
  position: absolute;
  background: rgba(244, 244, 248, 0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(10px);
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
`;

const UserModalModalContent = styled.div`
  min-height: 20vh;
  background-color: var(--background-color-1);
  box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.05);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-top: 56px;
  text-align: center;
`;

const AvatarBox = styled(Avatar)`
  position: absolute;
  top: -42px;
  left: 50%;
  margin-left: -42px;
  background-color: #fff;
`;

const SnsBox = styled.div`
  font-size: 16px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  line-height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 70%;
  margin: 0 auto;
  word-break: break-all;
  .copySns{
    display: inline-block;
    padding-left: 10px;
  }
`;

const NameBox = styled.div`
  font-size: 14px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  margin-block: 8px;
`;

const BioBox = styled.div`
  font-size: 14px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: var(--font-light-color);
  line-height: 17px;
  width: 80%;
  margin: 0 auto;
`;

const SocialBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
  margin-bottom: 50px;
`;
