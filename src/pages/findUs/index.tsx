import { useAppContext } from "../../context/app";
import { useTheme } from "../../context/theme";
import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaTwitter,
  FaViber,
  FaWhatsapp,
} from "react-icons/fa";
import styled from "styled-components";
import GoogleMap from "./googleMap";

export default function FindUs() {
  const { theme } = useTheme();
  const { storeInfo, activeLanguage, setPageLoading } = useAppContext();

  // active address
  const [activeAddress, setActiveAddress] = useState(null);

  useEffect(() => {
    if (storeInfo && storeInfo?.address?.length > 0) {
      setActiveAddress(storeInfo?.address[0]);
    }

    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  }, [storeInfo]);

  return (
    <Container style={{ color: theme.primaryText }}>
      <Section style={{ border: `1px solid ${theme.line}` }}>
        <Title style={{ color: theme.primary }}>{activeLanguage.findUs}!</Title>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            margin: "8px 0 24px 0",
          }}
        >
          {storeInfo?.links?.map((i: any, x: number) => {
            return (
              <div
                key={x}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  zIndex: 1000,
                }}
                className="hover"
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
                        i.link.startsWith("@") ? i.link.substring(1) : i.link
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
                    size={24}
                    style={{ cursor: "pointer" }}
                  />
                ) : i.type === "Instagram" ? (
                  <FaInstagram
                    color={theme.secondaryText}
                    size={24}
                    style={{ cursor: "pointer" }}
                  />
                ) : i.type === "Whatsapp" ? (
                  <FaWhatsapp
                    color={theme.secondaryText}
                    size={24}
                    style={{ cursor: "pointer" }}
                  />
                ) : i.type === "Telegram" ? (
                  <FaTelegram
                    color={theme.secondaryText}
                    size={24}
                    style={{ cursor: "pointer" }}
                  />
                ) : i.type === "Viber" ? (
                  <FaViber
                    color={theme.secondaryText}
                    size={24}
                    style={{ cursor: "pointer" }}
                  />
                ) : i.type === "Linkedin" ? (
                  <FaLinkedin
                    color={theme.secondaryText}
                    size={24}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <FaTwitter
                    color={theme.secondaryText}
                    size={24}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            margin: "16px 0",
          }}
        >
          <span style={{ color: theme.secondaryText }}>
            {activeLanguage.email}:
          </span>
          <div style={{ display: "flex" }}>
            <a
              style={{
                textDecoration: "none",
                color: "inherit",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              className="hover"
              href={`mailto:${storeInfo?.email}`}
            >
              {storeInfo?.email}
            </a>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            margin: "16px 0",
          }}
        >
          <span style={{ color: theme.secondaryText }}>
            {activeLanguage.phone}:
          </span>

          {storeInfo?.phone?.map((i: any, x: number) => {
            return (
              <div style={{ fontSize: "14px", display: "flex" }} key={x}>
                <a
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                  className="hover"
                  href={`tel:${i}`}
                >
                  {i}
                </a>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            margin: "16px 0",
          }}
        >
          <span style={{ color: theme.secondaryText }}>
            {activeLanguage.address}:
          </span>
          {storeInfo?.address?.map((i: any, x: number) => {
            return (
              <div
                key={x}
                className="hover"
                onClick={() => setActiveAddress(i)}
                style={{
                  padding: "8px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  border: `1px solid ${
                    activeAddress === i ? theme.primary : theme.line
                  }`,
                  fontSize: "14px",
                }}
              >
                <div>{i.address}</div>
                <div style={{ color: theme.primary }}>
                  {i.workingHours.starting} : {i.workingHours.ending}{" "}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
      <GoogleMap activeAddress={activeAddress} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 0 40px;
  margin: 24px auto;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    margin: 0;
    padding: 8px;
  }

  .hover {
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Section = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  box-sizing: border-box;
  border-radius: 15px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 16px;
  }
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 24px;
`;
