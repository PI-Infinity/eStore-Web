import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import * as React from "react";
import styled from "styled-components";
import { useAppContext } from "../context/app";

const SimpleSnackbar: React.FC = () => {
  const { alert, setAlert } = useAppContext();
  return (
    <>
      {alert.active && (
        <Container
          onClick={() => setAlert({ active: false, type: "", text: "" })}
        >
          <Stack
            sx={{
              width: "auto",
              position: "fixed",
              bottom: "24px",
              left: "24px",
            }}
            spacing={2}
          >
            <Alert
              severity={alert.type}
              variant="filled"
              onClick={() => setAlert({ active: false, type: "", text: "" })}
            >
              {alert.text}
            </Alert>
          </Stack>
        </Container>
      )}
    </>
  );
};

export default SimpleSnackbar;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
  z-index: 999999;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  transition: ease-in-out 200ms;
  display: flex;
  align-items: center;
  justify-content: center;
`;
