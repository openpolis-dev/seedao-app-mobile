import styled from "styled-components";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const TopBox = styled.div`
    background: ${props => props.bgcolor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:0 20px;
  position: sticky;
  top: 0;
  left: 0;
  width: 100vw;
  box-sizing: border-box;
  height: 70px;
  z-index: 999;
  .AvatarBox{
    width: 36px;
    height: 36px;
    border-radius: 36px;
    overflow: hidden;
    display: block;
    img{
      width: 36px;
      height: 36px;
      object-fit: cover;

    }
  }
  .lft{
    font-size: 30px;
    font-family: Poppins-SemiBold;
    font-weight: 600;
    color: #1A1323;
    line-height: 1.2em;
  }
  &.act{
    justify-content: center;
    height: 50px;
    .lft{
      font-size: 17px;
    }
    .AvatarBox{
      display: none;
    }
  }


`

export default function StickyHeader({title,bgcolor}){
    const userToken = useSelector(state=> state.userToken);
    const [show,setShow] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener('scroll', ScrollHeight);
        return () =>{
            window.removeEventListener('scroll', ScrollHeight);
        }
    }, []);

    const ScrollHeight = () =>{
        var scrollHeight = window.pageYOffset || document.documentElement.scrollTop;
        if(scrollHeight > 80){
            setShow(true)
        }else{
            setShow(false)
        }
    }

    const toGo = () =>{
        navigate("/user/profile")
    }

    return <TopBox bgcolor={bgcolor} className={show?"act":""}>
        <div className="lft">
            {title}
        </div>
        <div className="AvatarBox" onClick={()=>toGo()}>
            <img src={userToken?.user?.avatar} alt=""/>
        </div>

</TopBox>
}
