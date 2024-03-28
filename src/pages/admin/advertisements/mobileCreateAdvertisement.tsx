import Button from "../../..//components/button";
import { Input } from "../../..//components/input";
import { useAppContext } from "../../..//context/app";
import { useTheme } from "../../..//context/theme";
// import Logo from "../../..//public/logo.png";
import { FormControlLabel, FormGroup, Radio } from "@mui/material";
import ReactCountryFlag from "react-country-flag";
import { BiPlus } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 90vh;
  position: fixed;
  top: 0px;
  transition: ease-in 150ms;
  z-index: 100999;
`;

const AddNewAdvertisement = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 15px;
  padding: 8px;
  overflow-y: auto;
  height: 80vh;
`;

const Review = styled.div`
  border-radius: 15px;
  padding: 16px;

  & > div {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    margin-bottom: 4px;
  }
`;

const MobileCreateAdvertisement = ({
  openCreateAdvertisement,
  pages,
  advertisementPage,
  setAdvertisementPage,
  setOpenPages,
  openPages,
  userStatus,
  setUserStatus,
  setInputLang,
  inputLang,
  advertisementTitle,
  setadvertisementTitle,
  advertisementUrl,
  setadvertisementUrl,
  Createadvertisements,
  advertisementDescription,
  setadvertisementDescription,
  linkButtonTitle,
  setLinkButtonTitle,
  setOpenCreateAdvertisement,
}: any) => {
  const { theme } = useTheme();

  const { storeInfo, activeLanguage } = useAppContext();

  return (
    <Container
      style={{
        background: theme.background,
        transform: `scale(${openCreateAdvertisement ? 1 : 0})`,
        opacity: openCreateAdvertisement ? 1 : 0,
        borderRadius: openCreateAdvertisement ? "0" : "500px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "50px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "24px",
            top: "0px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <img src={storeInfo?.logo} width={50} height={40} alt="nike" />
        </div>
      </div>
      <MdClose
        onClick={() => setOpenCreateAdvertisement(false)}
        size={32}
        color={theme.primary}
        style={{ position: "absolute", right: "8px", top: "12px" }}
      />
      <div
        style={{
          paddingBottom: "88px",
          padding: "8px",
        }}
      >
        <AddNewAdvertisement style={{ border: `1px solid ${theme.line}` }}>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: theme.primaryText,
              marginBottom: "16px",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px",
            }}
          >
            <BiPlus size={24} /> {activeLanguage.createNewAdvertisement}
          </h1>
          <div style={{ position: "relative", width: "100%" }}>
            <div
              style={{
                width: "100%",
                height: "53px",
                border: `1px solid ${
                  advertisementPage?.page.length > 0
                    ? theme.primary
                    : theme.lineDark
                }`,
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                marginBottom: "8px",
                fontWeight: 600,
              }}
              className="icon"
              onClick={() => setOpenPages((prev: boolean) => !prev)}
            >
              {advertisementPage?.page.length > 0 ? (
                <span>
                  <span style={{ color: theme.secondaryText }}>
                    {activeLanguage.page}:{" "}
                  </span>
                  {advertisementPage?.label}
                </span>
              ) : (
                activeLanguage.choiceAdvertisementPage
              )}
            </div>
            {openPages && (
              <div
                style={{
                  marginTop: "8px",
                  position: "absolute",
                  width: "100%",
                  border: `1px solid ${theme.line}`,
                  borderRadius: "15px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background: theme.background,
                  zIndex: 1001,
                  padding: "24px",
                  boxShadow: `0px 1px 5px ${theme.primaryText}`,
                }}
              >
                {pages?.map((it: any, x: number) => {
                  return (
                    <span
                      onClick={() => {
                        setAdvertisementPage({
                          page: it?.page,
                          label: it?.label,
                        });
                        setOpenPages(false);
                      }}
                      style={{
                        width: "100%",
                        border: `1px solid ${
                          advertisementPage?.page === it?.page
                            ? theme.primary
                            : theme.line
                        }`,
                        borderRadius: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        padding: "8px",
                      }}
                      className="icon"
                      key={x}
                    >
                      {it?.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <h2>{activeLanguage.userType}</h2>
            <span style={{ color: theme.secondaryText }}>
              ({activeLanguage.typeInstruction})
            </span>
          </div>
          <FormGroup row sx={{ marginLeft: "16px", marginBottom: "0px" }}>
            <FormControlLabel
              control={
                <Radio
                  checked={userStatus?.value === "All"} // Determine if the item is selected
                  onChange={(e) => {
                    setUserStatus({ value: "All", label: activeLanguage.all });
                  }}
                  name="All"
                  sx={{ color: theme.secondaryText }}
                />
              }
              label={activeLanguage.all}
            />
            <FormControlLabel
              control={
                <Radio
                  checked={userStatus?.value === "Auth"}
                  onChange={(e) => {
                    setUserStatus({
                      value: "Auth",
                      label: activeLanguage.auth,
                    });
                  }}
                  name="Auth"
                  sx={{ color: theme.secondaryText }}
                />
              }
              label={activeLanguage.auth}
            />
            <FormControlLabel
              control={
                <Radio
                  checked={userStatus?.value === "No Auth"}
                  onChange={(e) => {
                    setUserStatus({
                      value: "No Auth",
                      label: activeLanguage.noAuth,
                    });
                  }}
                  name="No Auth"
                  sx={{ color: theme.secondaryText }}
                />
              }
              label={activeLanguage.noAuth}
            />
          </FormGroup>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "16px 0",
                gap: "16px",
              }}
            >
              <ReactCountryFlag
                className="emojiFlag"
                onClick={() => setInputLang("en")}
                countryCode="US"
                style={{
                  opacity: inputLang === "en" ? 1 : 0.3,
                  cursor: "pointer",
                }}
                aria-label="United States"
              />
              <ReactCountryFlag
                className="emojiFlag"
                onClick={() => setInputLang("ka")}
                countryCode="GE"
                style={{
                  opacity: inputLang === "ka" ? 1 : 0.3,
                  cursor: "pointer",
                }}
                aria-label="Georgia"
              />
              <ReactCountryFlag
                className="emojiFlag"
                onClick={() => setInputLang("ru")}
                countryCode="RU"
                style={{
                  opacity: inputLang === "ru" ? 1 : 0.3,
                  cursor: "pointer",
                }}
                aria-label="Russia"
              />
            </div>
            <Input
              label={activeLanguage.title + ` (${inputLang})*`}
              value={
                advertisementTitle && inputLang
                  ? advertisementTitle[
                      inputLang as keyof typeof advertisementTitle
                    ] || ""
                  : ""
              }
              onChange={(e) =>
                setadvertisementTitle((prev: any) => ({
                  ...prev,
                  [inputLang === "ka"
                    ? "ka"
                    : inputLang === "ru"
                    ? "ru"
                    : "en"]: e,
                }))
              }
              warning={false}
              type="text"
            />
          </div>
          {advertisementPage?.page !== "Main" && (
            <Input
              label={
                activeLanguage.description +
                ` (${inputLang}) ${activeLanguage.optional}`
              }
              value={
                advertisementDescription && inputLang
                  ? advertisementDescription[
                      inputLang as keyof typeof advertisementDescription
                    ] || ""
                  : ""
              }
              onChange={(e) =>
                setadvertisementDescription((prev: any) => ({
                  ...prev,
                  [inputLang === "ka"
                    ? "ka"
                    : inputLang === "ru"
                    ? "ru"
                    : "en"]: e,
                }))
              }
              warning={false}
              type="text"
            />
          )}

          <Input
            label={
              activeLanguage?.linkButtonTitle +
              ` (${inputLang}) ${activeLanguage?.optional}`
            }
            value={
              linkButtonTitle?.[inputLang as keyof typeof advertisementTitle]
            }
            onChange={(e) =>
              setLinkButtonTitle((prev: any) => ({
                ...prev,
                [inputLang === "ka" ? "ka" : inputLang === "ru" ? "ru" : "en"]:
                  e,
              }))
            }
            warning={false}
            type="text"
          />

          <Input
            label={
              activeLanguage.destinationLink + " " + activeLanguage.optional
            }
            value={advertisementUrl}
            onChange={setadvertisementUrl}
            warning={false}
            type="text"
          />
          <Review
            style={{
              color: theme.primaryText,
              border: `1px solid ${theme.line}`,
            }}
          >
            <h2 style={{ marginBottom: "16px", fontWeight: 600 }}>
              {activeLanguage.review}
            </h2>
            <div>
              <h2 style={{ color: theme.secondaryText }}>
                {activeLanguage.users}:
              </h2>
              <span>{userStatus?.label}</span>
            </div>
            <div>
              <h2 style={{ color: theme.secondaryText }}>
                {activeLanguage.title} ({inputLang}):{" "}
              </h2>
              <span>
                {advertisementTitle?.en?.length > 0
                  ? advertisementTitle?.en
                  : "—"}
              </span>
            </div>
            {advertisementPage?.page !== "Main" && (
              <div>
                <h2 style={{ color: theme.secondaryText }}>
                  {activeLanguage.description} ({inputLang}):
                </h2>
                <span>
                  {advertisementDescription?.en?.length > 0
                    ? advertisementDescription?.en
                    : "—"}
                </span>
              </div>
            )}
            <div>
              <h2 style={{ color: theme.secondaryText }}>
                {activeLanguage.linkButtonTitle} ({inputLang}):
              </h2>
              <span>
                {linkButtonTitle?.en?.length > 0 ? linkButtonTitle?.en : "—"}
              </span>
            </div>
            <div>
              <h2 style={{ color: theme.secondaryText }}>
                {activeLanguage.link}:
              </h2>
              <span>
                {advertisementUrl?.length > 0 ? advertisementUrl : "—"}
              </span>
            </div>
          </Review>
          <div>
            <Button
              disabled={false}
              title={activeLanguage.create}
              background={theme.primary}
              color={theme.lightBackground}
              onClick={() =>
                Createadvertisements({
                  active: true,
                  page: advertisementPage.page,
                  users: userStatus?.value,
                  title: advertisementTitle,
                  description:
                    advertisementPage?.page !== "Main"
                      ? advertisementDescription
                      : "",
                  linkButtonTitle: linkButtonTitle,
                  link: advertisementUrl,
                })
              }
            />
          </div>
        </AddNewAdvertisement>
      </div>
    </Container>
  );
};
export default MobileCreateAdvertisement;
