import styled from "styled-components";
import { RectangularSkeleton } from "components/common/skeleton";

export default function EventCard({ event, handleClick }) {
  return (
    <EventItem onClick={() => handleClick(event.id)}>
      <Cover src={event.thumbnail} />
      <Title>{event.subject}</Title>
      <InfoBox>
        <div>
          <InfoDate>{event.startTime}</InfoDate>
          <InfoBottom>
            <div className="_city">{event.city?.name}</div>
            <div>🚀 {event.status}</div>
          </InfoBottom>
        </div>
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
      <div>
        <InfoDate>
          <RectangularSkeleton width="100px" height="16px" style={{ marginBottom: "4px" }} />
        </InfoDate>
        <InfoBottom>
          <RectangularSkeleton width="100px" height="16px" />
        </InfoBottom>
      </div>
      <TagBox>
        <RectangularSkeleton width="46px" height="22px" />
        <RectangularSkeleton width="46px" height="22px" />
      </TagBox>
    </EventItem>
  );
};

const EventItem = styled.div`
  padding-bottom: 16px;
`;

const Cover = styled.img`
  width: 100%;
  height: 23vw;
  border-radius: 16px;
  object-fit: cover;
`;

const Title = styled.div`
  font-size: 13px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  margin-top: 14px;
  margin-bottom: 10px;
`;

const InfoBox = styled.div``;
const InfoDate = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: var(--font-light-color);
  line-height: 17px;
`;

const InfoBottom = styled.div`
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  ._city {
    color: var(--font-light-color);
  }
`;

const TagBox = styled.ul`
  font-size: 12px;
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
  li {
    height: 22px;
    line-height: 22px;
    padding-inline: 10px;
    background-color: var(--primary-color);
    border-radius: 6px;
    color: #fff;
  }
`;
