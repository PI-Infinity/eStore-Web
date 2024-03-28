import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useCurrentUserContext } from "../context/currentUser";
import { useTheme } from "../context/theme";
// import Logo from "../assets/logo.png";
import { MdLocationPin } from "react-icons/md";
import { useProductsContext } from "../context/productsContext";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaTwitter,
  FaViber,
  FaWhatsapp,
} from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import { useAppContext } from "../context/app";

export const Footer = () => {
  // route pathname
  const pathname = window.location.pathname;

  // current user
  const { currentUser } = useCurrentUserContext();

  // theme
  const { theme } = useTheme();

  // app context
  const { isMobile, storeInfo, setLanguage, language, activeLanguage } =
    useAppContext();

  return (
    <>
      {!pathname.includes("admin") && (
        <>
          <Container
            style={{
              // borderTop: `1.5px solid ${theme.line}`,
              paddingBottom: "24px",
              background: theme.lightBackground,
            }}
          >
            <Links>
              <Link
                className="link"
                to="/"
                style={{
                  textDecoration: "none",
                  width: "20vw",
                  display: "flex",
                  justifyContent: isMobile ? "start" : "center",
                  zIndex: 10002,
                }}
              >
                <img
                  src={storeInfo?.logo}
                  width={isMobile ? 70 : 100}
                  alt="nike"
                />
              </Link>
              {/* <div
                style={{
                  zIndex: 10001,
                  position: "absolute",
                  left: "-100px",
                  top: "-20px",
                }}
                className="flex place-items-start before:w-full sm:before:w-[880px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[25vw] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"
              ></div> */}
              <div
                style={{
                  width: isMobile ? "90%" : "20%",
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box",
                  padding: isMobile ? "0" : "1px 3vw 0 3vw",
                  letterSpacing: "0.5px",
                  zIndex: 100001,
                  position: "relative",
                }}
              >
                <LinksContainer
                  style={{
                    letterSpacing: "0.5px",
                  }}
                >
                  <Link
                    className="link"
                    // secondarytext={theme.secondaryText}
                    to="/contact"
                    style={{
                      textDecoration: "none",
                      fontSize: "14px",
                      color: theme.primaryText,
                      fontWeight: "700",
                    }}
                  >
                    {activeLanguage.findUs}
                  </Link>

                  <Link
                    className="link"
                    // secondarytext={theme.secondaryText}
                    to="/about"
                    style={{
                      textDecoration: "none",
                      fontSize: "14px",
                      color: theme.primaryText,
                      fontWeight: "700",
                    }}
                  >
                    {activeLanguage.about}
                  </Link>

                  <Link
                    className="link"
                    // secondarytext={theme.secondaryText}
                    to={currentUser ? "/profile" : "/login"}
                    style={{
                      textDecoration: "none",
                      fontSize: "14px",
                      color: theme.primaryText,
                      fontWeight: "700",
                    }}
                  >
                    {currentUser
                      ? activeLanguage.profile
                      : activeLanguage.login}
                  </Link>
                  {currentUser?.admin && (
                    <>
                      <Link
                        className="link"
                        // secondarytext={theme.secondaryText}
                        to={"/admin/orders"}
                        style={{
                          textDecoration: "none",
                          fontSize: "14px",
                          color: theme.primaryText,
                          fontWeight: "700",
                        }}
                      >
                        {activeLanguage.admin}
                      </Link>
                    </>
                  )}
                </LinksContainer>
              </div>
              <div
                style={{
                  width: isMobile ? "90%" : "20%",
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box",
                  letterSpacing: "0.5px",
                  zIndex: 100001,
                  position: "relative",
                }}
              >
                <LinksContainer
                  style={{
                    letterSpacing: "0.5px",
                  }}
                >
                  <Link
                    className="link"
                    // secondarytext={theme.secondaryText}
                    to="/terms"
                    style={{
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: pathname?.includes("contact")
                        ? theme.primaryText
                        : theme.secondaryText,
                      borderBottom: `1.5px solid ${
                        pathname?.includes("contact")
                          ? theme.primary
                          : "rgba(0,0,0,0)"
                      }`,
                    }}
                  >
                    {activeLanguage.termsAndRules}
                  </Link>

                  <Link
                    className="link"
                    to={"/privacy"}
                    style={{
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: pathname?.includes("contact")
                        ? theme.primaryText
                        : theme.secondaryText,
                      borderBottom: `1.5px solid ${
                        pathname?.includes("contact")
                          ? theme.primary
                          : "rgba(0,0,0,0)"
                      }`,
                    }}
                  >
                    {activeLanguage.privacyPolicy}
                  </Link>
                </LinksContainer>
              </div>
              <LinksContainer
                style={{
                  width: "20%",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {storeInfo?.links?.map((i: any, x: number) => {
                  return (
                    <div
                      className="link"
                      key={x}
                      style={{
                        textDecoration: "none",
                        height: "24px",
                        width: "24px",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        let url = "";

                        if (i.type === "Whatsapp") {
                          // Format for WhatsApp with international phone number without '+' e.g., "1234567890"
                          url = `https://wa.me/${i.link}`;
                        } else if (i.type === "Viber") {
                          // Viber links might require a different format or direct app interaction. Adjust as needed.
                          // Example: viber://chat?number=%2B1234567890, ensure the link is properly encoded
                          url = `viber://chat?number=${i.link}`;
                        } else {
                          // Assuming other platforms use a URL structure where the username can be appended
                          // Adjust the base URLs as needed for your application's requirements
                          type ServiceType =
                            | "Facebook"
                            | "Instagram"
                            | "Telegram"
                            | "Linkedin"
                            | "Twitter";

                          const baseUrls: { [key in ServiceType]: string } = {
                            Facebook: "https://facebook.com/",
                            Instagram: "https://instagram.com/",
                            Telegram: "https://t.me/",
                            Linkedin: "https://linkedin.com/in/",
                            Twitter: "https://twitter.com/",
                          };

                          if (Object.keys(baseUrls).includes(i.type)) {
                            const baseUrl = baseUrls[i.type as ServiceType];
                            url = `${baseUrl}${
                              i.link.startsWith("@")
                                ? i.link.substring(1)
                                : i.link
                            }`;
                          }
                        }

                        if (url) {
                          window.open(url, "_blank", "noopener,noreferrer");
                        }
                      }}
                    >
                      {i.type === "Facebook" ? (
                        <FaFacebook
                          color={theme.secondaryText}
                          size={20}
                          style={{ cursor: "pointer" }}
                        />
                      ) : i.type === "Instagram" ? (
                        <FaInstagram
                          color={theme.secondaryText}
                          size={20}
                          style={{ cursor: "pointer" }}
                        />
                      ) : i.type === "Whatsapp" ? (
                        <FaWhatsapp
                          color={theme.secondaryText}
                          size={20}
                          style={{ cursor: "pointer" }}
                        />
                      ) : i.type === "Telegram" ? (
                        <FaTelegram
                          color={theme.secondaryText}
                          size={20}
                          style={{ cursor: "pointer" }}
                        />
                      ) : i.type === "Viber" ? (
                        <FaViber
                          color={theme.secondaryText}
                          size={20}
                          style={{ cursor: "pointer" }}
                        />
                      ) : i.type === "Linkedin" ? (
                        <FaLinkedin
                          color={theme.secondaryText}
                          size={20}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <FaTwitter
                          color={theme.secondaryText}
                          size={20}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </div>
                  );
                })}
              </LinksContainer>
              <div
                style={{
                  width: isMobile ? "90%" : "20%",
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: isMobile ? "0" : "40px",
                  gap: "16px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  letterSpacing: "0.5px",
                  zIndex: 10000,
                  color: theme.secondaryText,
                  borderRadius: "15px",
                }}
              >
                <div
                  onClick={() => setLanguage("ka")}
                  style={{
                    borderRadius: "15px",
                    padding: isMobile ? "0" : "4px 8px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color:
                      language === "ka" ? theme.primary : theme.primaryText,
                  }}
                >
                  <ReactCountryFlag
                    className="emojiFlag"
                    countryCode="GE"
                    aria-label="Georgia"
                  />
                  ქართული
                </div>
                <div
                  onClick={() => setLanguage("en")}
                  style={{
                    borderRadius: "15px",
                    padding: isMobile ? "0" : "4px 8px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color:
                      language === "en" ? theme.primary : theme.primaryText,
                  }}
                >
                  <ReactCountryFlag
                    className="emojiFlag"
                    countryCode="US"
                    aria-label="Georgia"
                  />
                  English
                </div>
                <div
                  onClick={() => setLanguage("ru")}
                  style={{
                    borderRadius: "15px",
                    padding: isMobile ? "0" : "4px 8px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color:
                      language === "ru" ? theme.primary : theme.primaryText,
                  }}
                >
                  <ReactCountryFlag
                    className="emojiFlag"
                    countryCode="RU"
                    aria-label="Georgia"
                  />
                  Russian
                </div>
              </div>
            </Links>
          </Container>
          <BottomBar
            style={{
              color: theme.primaryText,
              // border: `1px solid ${theme.line}`,
              fontWeight: "600",
            }}
          >
            <MdLocationPin size={18} color={theme.primaryText} />
            Georgia{" "}
            <span style={{ marginLeft: "24px", color: theme.secondaryText }}>
              &#169; {activeLanguage.allRightsReserved}
            </span>
          </BottomBar>
        </>
      )}
    </>
  );
};

const Container = styled.div`
  width: 100%;
  height: 280px;
  box-sizing: border-box;
  padding: 24px;

  @media (max-width: 768px) {
    height: auto;
    padding: 8px;
  }
`;

const Links = styled.div`
  width: 100%;
  padding: 24px;
  display: flex;
  align-items: start;
  gap: 36px;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 10002;
  gap: 16px;
  letter-spacing: 0.4px;
  color: #f1f1f1;
  font-size: 14px;

  .link {
    &:hover {
      filter: brightness(0.7);
    }
  }
`;

const BottomBar = styled.div`
  width: 100%;
  height: 40px;

  display: flex;
  align-items: center;
  padding: 0 40px;
  font-size: 14px;
  gap: 4px;

  @media (max-width: 768px) {
    padding: 0 32px;
  }
`;
