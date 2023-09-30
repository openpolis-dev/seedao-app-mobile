import styled from "styled-components";
import DefaultAvatarIcon from "assets/images/user/avatar.svg";
import { useEffect, useState } from "react";

export default function Avatar({ src, size, ...rest }) {
  const [imgSrc, setImgSrc] = useState(DefaultAvatarIcon);

  useEffect(() => {
    src && setImgSrc(src);
  }, [src]);

  return (
    <AvatarStyle size={size} {...rest}>
      <img src={imgSrc} alt="" onError={() => setImgSrc(DefaultAvatarIcon)} />
    </AvatarStyle>
  );
}

const AvatarStyle = styled.div`
  width: ${(props) => props.size || "56px"};
  height: ${(props) => props.size || "56px"};
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
  }
`;
