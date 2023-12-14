import styled from "styled-components";
import { RectangularSkeleton } from "components/common/skeleton";

export default function EventCard({ event, handleClick }) {
  return (
    <EventItem onClick={() => handleClick(event.id)}>
      <Cover src={event.thumbnail} />
      <Title>{event.subject}</Title>
      <InfoBox>
        <InfoLeft>
          <div>{event.startTime}</div>
          <div>{event.city.name}</div>
        </InfoLeft>
        <InfoRight>🚀 {event.status}</InfoRight>
      </InfoBox>
      <TagBox>
        {event.tags?.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </TagBox>
    </EventItem>
  );
}

export const EventCardSkeleton = () => {
  return (
    <EventItem>
      <RectangularSkeleton height="180px" radius="16px" />
      <RectangularSkeleton height="20px" style={{ marginTop: "14px", marginBottom: "10px" }} />
      <InfoBox>
        <InfoLeft>
          <RectangularSkeleton width="100px" height="16px" style={{ marginBottom: "4px" }} />
          <RectangularSkeleton width="100px" height="16px" />
        </InfoLeft>
      </InfoBox>
      <TagBox>
        <RectangularSkeleton width="46px" height="22px" />
        <RectangularSkeleton width="46px" height="22px" />
      </TagBox>
    </EventItem>
  );
};

const EventItem = styled.div`
  padding-bottom: 16px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.02);
`;

const Cover = styled.img`
  width: 100%;
  height: 188px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  object-fit: cover;
`;

const Title = styled.div`
  font-size: 13px;
  font-family: Poppins-SemiBold;
  font-weight: 600;
  margin-top: 14px;
  margin-bottom: 10px;
  padding: 0 16px;
`;

const InfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  padding: 0 16px;
`;
const InfoLeft = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: var(--font-light-color);
  line-height: 17px;
`;

const InfoRight = styled.div`
  font-size: 12px;
`;

const TagBox = styled.ul`
  font-size: 12px;
  display: flex;
  gap: 8px;
  margin-top: 8px;
  padding: 0 16px;
  li {
    height: 22px;
    line-height: 22px;
    padding-inline: 10px;
    background-color: var(--primary-color);
    border-radius: 6px;
    color: #fff;
  }
`;
