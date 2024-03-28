import styled from "styled-components";
import Facts from "./facts";
import Last30Days from "./last30days";
import Monthly from "./monthly";

export default function Users() {
  return (
    <Container>
      <Facts />
      <Last30Days />
      <Monthly />
      <div style={{ height: "16px" }}></div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  position: relative;
  gap: 24px;
  padding-bottom: 100px;

  .icon {
    cursor: pointer;
    &:hover {
      filter: brightness(0.9);
    }
  }
`;
