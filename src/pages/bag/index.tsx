import { useAppContext } from "../../context/app";
import { useCurrentUserContext } from "../../context/currentUser";
import { useTheme } from "../../context/theme";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Items from "./Items";
import Total from "./total";
import { useEffect } from "react";

const Bag = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { theme } = useTheme();

  // define shippings
  const { storeInfo, language, isMobile } = useAppContext();

  // current user
  const { currentUser } = useCurrentUserContext();

  // bag page advertisements

  let ads = storeInfo?.advertisements?.filter(
    (i: any) => i.page === "Bag" && i.active
  );

  let advertisements;
  if (ads?.length > 0) {
    if (currentUser) {
      advertisements = ads?.filter(
        (i: any) => i.users === "Auth" || i.users === "All"
      );
    } else {
      advertisements = ads?.filter(
        (i: any) => i.users === "No Auth" || i.users === "All"
      );
    }
  }

  return (
    <Container
      style={{
        color: theme.primaryText,
        padding: isMobile ? "0" : "24px",
        justifyContent: isMobile ? "start" : "center",
      }}
    >
      <Wrapper
        style={{
          width: isMobile ? "100%" : "80vw",
          padding: isMobile ? "8px" : "24px",
          border: isMobile ? "none" : `1px solid ${theme.lineDark}`,
          minHeight: isMobile ? "auto" : "80vh",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            width: "100%",
            height: "100%",
            gap: isMobile ? "8px" : "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              width: isMobile ? "100%" : "70%",
              height: "100%",
              gap: isMobile ? "8px" : "16px",
            }}
          >
            {advertisements?.length > 0 && (
              <Offer style={{ border: `1px solid ${theme.line}` }}>
                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: "600",
                    color: theme.primaryText,
                  }}
                >
                  {language === "en"
                    ? advertisements[0]?.title.en
                    : language === "ru"
                    ? advertisements[0]?.title.ru
                    : advertisements[0]?.title.ka}
                </h2>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {advertisements && advertisements[0]?.description && (
                    <p
                      style={{
                        fontWeight: "500",
                        color: theme.primaryText,
                      }}
                    >
                      {language === "en"
                        ? advertisements[0]?.description.en
                        : language === "ru"
                        ? advertisements[0]?.description.ru
                        : advertisements[0]?.description.ka}
                    </p>
                  )}
                  {advertisements && advertisements[0]?.linkButtonTitle && (
                    <Link
                      to={advertisements && advertisements[0]?.link}
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                        cursor: "pointer",
                        zIndex: 1000,
                        marginLeft: "8px",
                      }}
                    >
                      {language === "en"
                        ? advertisements[0]?.linkButtonTitle.en
                        : language === "ru"
                        ? advertisements[0]?.linkButtonTitle.ru
                        : advertisements[0]?.linkButtonTitle.ka}
                    </Link>
                  )}
                </div>
              </Offer>
            )}

            <Items />
          </div>
          <Total />
        </div>
      </Wrapper>
    </Container>
  );
};

export default Bag;

const Container = styled.div`
  width: 100%;
  display: flex;
  box-sizing: border-box;
  letter-spacing: 0.5px;
`;

const Wrapper = styled.div`
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  gap: 24px;
`;
const Offer = styled.div`
  border-radius: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 8px 16px;
  letter-spacing: 0.5px;
  z-index: 999;
`;
