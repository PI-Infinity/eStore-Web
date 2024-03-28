import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ConfirmPopup from "../../components/confirmPopup";
import { useAppContext } from "../../context/app";
import { useCurrentUserContext } from "../../context/currentUser";
import { useTheme } from "../../context/theme";
import EditInfo from "./editInfo";
import Favourites from "./favourites";
import Info from "./info";
import Orders from "./orders";

export default function Profile() {
  // theme
  const { theme } = useTheme();

  // router
  const navigate = useNavigate();

  const us = localStorage.getItem("eStore:currentUser");
  const user = us && JSON.parse(us);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  // edit info
  const [openEdit, setOpenEdit] = useState(false);

  // app states
  const { confirm, setPageLoading } = useAppContext();

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  }, []);

  return (
    <Container theme={theme}>
      {openEdit && (
        <EditInfo
          openEdit={openEdit}
          close={() => {
            setOpenEdit(false);
            document.body.style.overflowY = "auto";
          }}
        />
      )}
      {/**Delete account confirm popup */}
      <ConfirmPopup
        text={confirm?.text}
        agree={confirm?.agree}
        close={confirm?.close}
        open={confirm.active}
      />
      <Wrapper>
        <Info openEdit={openEdit} setOpenEdit={setOpenEdit} />
        <Orders />
        <Favourites />
      </Wrapper>
    </Container>
  );
}

interface StylesProps {
  theme: any;
}

const Container = styled.div<StylesProps>`
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 80vh;
  margin: 24px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: 100%;
    margin: 8px;
    gap: 8px;
  }
`;
