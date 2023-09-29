import styled from "styled-components";
import {Calendar3Range} from "react-bootstrap-icons";

const Box = styled.div`
    flex: 1;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .sizeTop {
    font-size: 30px;
    margin-bottom: 10px;
  }
`
export default function NoItem(){
    return <Box>
        <div>
            <Calendar3Range className="sizeTop" />
        </div>
        <div>No data</div>
    </Box>
}
