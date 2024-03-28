import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import { FormControlLabel, FormGroup, Radio } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { BarLoader } from "react-spinners";
import styled from "styled-components";
import AddvertismentItem from "./advertisementItem";
import ReactCountryFlag from "react-country-flag";
import MobileCreateAdvertisement from "./mobileCreateAdvertisement";
import { useLocation } from "react-router-dom";

export default function Advertisements() {
  // loading
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // theme
  const { theme } = useTheme();

  // advertisementss
  const {
    storeInfo,
    setStoreInfo,
    backendUrl,
    setAlert,
    activeLanguage,
    isMobile,
  } = useAppContext();

  // advertisements page
  const pages = [
    { label: activeLanguage?.main, page: "Main" },
    { label: activeLanguage?.bag, page: "Bag" },
  ];

  // open page options
  const [openPages, setOpenPages] = useState(false);

  // fields
  const [inputLang, setInputLang] = useState(storeInfo.language);
  const [userStatus, setUserStatus] = useState({
    value: "All",
    label: activeLanguage.all,
  });
  const [advertisementPage, setAdvertisementPage] = useState({
    page: "",
    label: "",
  });
  const [advertisementTitle, setadvertisementTitle] = useState({
    en: "",
    ka: "",
    ru: "",
  });
  const [advertisementDescription, setadvertisementDescription] = useState({
    en: "",
    ka: "",
    ru: "",
  });
  const [linkButtonTitle, setLinkButtonTitle] = useState({
    en: "",
    ka: "",
    ru: "",
  });
  const [advertisementUrl, setadvertisementUrl] = useState("");

  // create advertisements
  const Createadvertisements = async (newAdvertisements: any) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Create advertisement is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    if (
      newAdvertisements?.title.en?.length < 1 ||
      newAdvertisements?.title.ru?.length < 1 ||
      newAdvertisements?.title.ka?.length < 1 ||
      advertisementPage.page?.length < 1
    ) {
      return setAlert({
        active: true,
        type: "warning",
        text: activeLanguage.pleaseInputNecessaryFields,
      });
    }
    if (
      storeInfo?.advertisements?.some(
        (i: any) =>
          i.title.en === newAdvertisements.title.en &&
          i.title.ka === newAdvertisements.title.ka &&
          i.title.ru === newAdvertisements.title.ru &&
          i.users.en === newAdvertisements.users.en &&
          i.users.ka === newAdvertisements.users.ka &&
          i.users.ru === newAdvertisements.users.ru &&
          i.page === newAdvertisements.page &&
          newAdvertisements.users === i.users
      )
    ) {
      return setAlert({
        active: true,
        type: "warning",
        text: activeLanguage.similarAdAlreadyDefined,
      });
    } else if (
      storeInfo?.advertisements?.some(
        (i: any) =>
          i.page === newAdvertisements.page &&
          newAdvertisements.page !== "Main" &&
          (i.users === newAdvertisements.users ||
            storeInfo?.advertisements?.filter(
              (it: any) => it.page === newAdvertisements.page
            ).length === 2)
      )
    ) {
      return setAlert({
        active: true,
        type: "warning",
        text: `In ${newAdvertisements.page} ${activeLanguage.tooManyAdInPage}`,
      });
    }
    let updatedList = storeInfo?.advertisements
      ? [newAdvertisements, ...storeInfo?.advertisements]
      : [newAdvertisements];
    try {
      // Assuming you have an endpoint to save or update the store details
      const response = await axios.post(
        backendUrl + `/api/v1/project?id=${storeInfo._id}`,
        {
          advertisements: updatedList,
        }
      );
      if (response.data.status === "success") {
        setStoreInfo(response.data.data.project);
        setAlert({
          active: true,
          type: "success",
          text: activeLanguage.adCreatedSuccessfully,
        });
      }
    } catch (error: any) {
      console.log(error);
      console.log(error.response.data.message);
    }
  };

  // open create advertisement in mobile device
  const [openCreateAdvertisement, setOpenCreateAdvertisement] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  return (
    <Container
      style={{ color: theme.primaryText, border: `1px solid ${theme.line}` }}
    >
      {isMobile && (
        <MobileCreateAdvertisement
          openCreateAdvertisement={openCreateAdvertisement}
          pages={pages}
          advertisementPage={advertisementPage}
          setAdvertisementPage={setAdvertisementPage}
          setOpenPages={setOpenPages}
          openPages={openPages}
          userStatus={userStatus}
          setUserStatus={setUserStatus}
          setInputLang={setInputLang}
          inputLang={inputLang}
          advertisementTitle={advertisementTitle}
          setadvertisementTitle={setadvertisementTitle}
          advertisementUrl={advertisementUrl}
          setadvertisementUrl={setadvertisementUrl}
          Createadvertisements={Createadvertisements}
          advertisementDescription={advertisementDescription}
          setadvertisementDescription={setadvertisementDescription}
          linkButtonTitle={linkButtonTitle}
          setLinkButtonTitle={setLinkButtonTitle}
          setOpenCreateAdvertisement={setOpenCreateAdvertisement}
        />
      )}
      {isMobile && (
        <h1
          className="icon"
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: theme.lightBackground,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            border: `1px solid ${theme.line}`,
            borderRadius: "50px",
            padding: "4px 8px",
            background: theme.primary,
            margin: "8px 8px 0 8px",
          }}
          onClick={() => setOpenCreateAdvertisement(!openCreateAdvertisement)}
        >
          <BiPlus size={24} /> {activeLanguage.createNewAdvertisement}
        </h1>
      )}
      <List>
        {loading ? (
          <div
            style={{
              margin: "24px",
              height: "70%",
              width: "100%",
            }}
          >
            <BarLoader color={theme.primaryText} height={6} />
          </div>
        ) : (
          <>
            {storeInfo?.advertisements?.map((item: any, index: number) => {
              return (
                <AddvertismentItem item={item} index={index} key={index} />
              );
            })}
          </>
        )}
      </List>
      {!isMobile && (
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
                    : theme.line
                }`,
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                marginBottom: "8px",
              }}
              className="icon"
              onClick={() => setOpenPages((prev: boolean) => !prev)}
            >
              {advertisementPage?.page.length > 0 ? (
                <span>
                  <span style={{ color: theme.secondaryText }}>
                    {activeLanguage.page}:{" "}
                  </span>
                  {advertisementPage.label}
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
                  background: theme.dark,
                  zIndex: 1001,
                  padding: "24px",
                  boxShadow: `0px 1px 5px ${theme.primary}`,
                }}
              >
                {pages?.map((it: any, x: number) => {
                  return (
                    <span
                      onClick={() => {
                        setAdvertisementPage({
                          page: it.page,
                          label: it.label,
                        });
                        setOpenPages(false);
                      }}
                      style={{
                        width: "100%",
                        border: `1px solid ${
                          advertisementPage.page === it.page
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
                      {it.label}
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
                  checked={userStatus.value === "All"} // Determine if the item is selected
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
                  checked={userStatus.value === "Auth"}
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
                  checked={userStatus.value === "No Auth"}
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
                  opacity: inputLang === "en" ? 1 : 0.5,
                  cursor: "pointer",
                }}
                aria-label="United States"
              />
              <ReactCountryFlag
                className="emojiFlag"
                onClick={() => setInputLang("ka")}
                countryCode="GE"
                style={{
                  opacity: inputLang === "ka" ? 1 : 0.5,
                  cursor: "pointer",
                }}
                aria-label="Georgia"
              />
              <ReactCountryFlag
                className="emojiFlag"
                onClick={() => setInputLang("ru")}
                countryCode="RU"
                style={{
                  opacity: inputLang === "ru" ? 1 : 0.5,
                  cursor: "pointer",
                }}
                aria-label="Russia"
              />
            </div>
            <Input
              label={activeLanguage.title + ` (${inputLang})*`}
              value={
                advertisementTitle[inputLang as keyof typeof advertisementTitle]
              }
              onChange={(e) =>
                setadvertisementTitle((prev) => ({
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
          {advertisementPage.page !== "Main" && (
            <Input
              label={
                activeLanguage.description +
                ` (${inputLang}) ${activeLanguage.optional}`
              }
              value={
                advertisementDescription[
                  inputLang as keyof typeof advertisementTitle
                ]
              }
              onChange={(e) =>
                setadvertisementDescription((prev) => ({
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
              activeLanguage.linkButtonTitle +
              ` (${inputLang}) ${activeLanguage.optional}`
            }
            value={
              linkButtonTitle[inputLang as keyof typeof advertisementTitle]
            }
            onChange={(e) =>
              setLinkButtonTitle((prev) => ({
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
              <span>{userStatus.label}</span>
            </div>
            <div>
              <h2 style={{ color: theme.secondaryText }}>
                {activeLanguage.title} ({inputLang}):{" "}
              </h2>
              <span>
                {advertisementTitle?.en?.length > 0
                  ? advertisementTitle.en
                  : "—"}
              </span>
            </div>
            {advertisementPage.page !== "Main" && (
              <div>
                <h2 style={{ color: theme.secondaryText }}>
                  {activeLanguage.description} ({inputLang}):
                </h2>
                <span>
                  {advertisementDescription?.en?.length > 0
                    ? advertisementDescription.en
                    : "—"}
                </span>
              </div>
            )}
            <div>
              <h2 style={{ color: theme.secondaryText }}>
                {activeLanguage.linkButtonTitle} ({inputLang}):
              </h2>
              <span>
                {linkButtonTitle?.en?.length > 0 ? linkButtonTitle.en : "—"}
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
                  users: userStatus.value,
                  title: advertisementTitle,
                  description:
                    advertisementPage.page !== "Main"
                      ? advertisementDescription
                      : undefined,
                  linkButtonTitle: linkButtonTitle,
                  link: advertisementUrl,
                })
              }
            />
          </div>
        </AddNewAdvertisement>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 95vh;
  border-radius: 15px;
  padding: 24px;
  padding-bottom: 64px;
  position: relative;
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0px;
    gap: 0px;
  }

  .icon {
    cursor: pointer;
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const List = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 15px;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    width: 100%;
    gap: 8px;
    padding: 8px;
    height: 75vh;
  }
`;

const AddNewAdvertisement = styled.div`
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 15px;
  padding: 24px;
  overflow-y: auto;
`;

const Review = styled.div`
  border-radius: 15px;
  padding: 24px;

  & > div {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    margin-bottom: 4px;
  }
`;
