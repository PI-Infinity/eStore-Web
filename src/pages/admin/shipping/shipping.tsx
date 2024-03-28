import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { useTheme } from "../../../context/theme";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import styled from "styled-components";
import MapAutoComplete from "../orders/mapAutocomplete";
import { useAppContext } from "../../../context/app";
import axios from "axios";
import { BiPlus } from "react-icons/bi";
import ShippingItem from "./shippingItem";
import MobileCreateShipping from "./mobileCreateShipping";
import { useLocation } from "react-router-dom";

export default function Shipping() {
  // loading
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // theme
  const { theme } = useTheme();

  // shippings
  const {
    storeInfo,
    setStoreInfo,
    backendUrl,
    setAlert,
    activeLanguage,
    isMobile,
  } = useAppContext();

  // fields
  const [shippingTitle, setShippingTitle] = useState("");
  const [shippingArea, setShippingArea] = useState({ address: null });
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingTime, setShippingTime] = useState("");

  // create shipping
  const CreateShipping = async (newShipping: any) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Create shipping is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    if (storeInfo.shipping.some((i: any) => i.title === newShipping.title)) {
      return setAlert({
        active: true,
        type: "warning",
        text: activeLanguage.shippingWithSameTitleExists,
      });
    }
    if (
      shippingTime?.length < 1 ||
      shippingArea.address === null ||
      shippingTime?.length < 1
    ) {
      return setAlert({
        active: true,
        type: "warning",
        text: activeLanguage.pleaseInputNecessaryFields,
      });
    }
    try {
      // Assuming you have an endpoint to save or update the store details
      const response = await axios.post(
        backendUrl + `/api/v1/project?id=${storeInfo._id}`,
        {
          shipping: [newShipping, ...storeInfo?.shipping],
        }
      );
      if (response.data.status === "success") {
        setStoreInfo(response.data.data.project);
        setAlert({
          active: true,
          type: "success",
          text: activeLanguage.newShippingCreatedSuccessfully,
        });
      }
    } catch (error: any) {
      console.log(error);
      console.log(error.response.data.message);
    }
  };

  // creat shipping
  const [openCreateShipping, setOpenCreateShipping] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  return (
    <Container
      style={{
        color: theme.primaryText,
        border: isMobile ? "none" : `1px solid ${theme.line}`,
      }}
    >
      {isMobile && (
        <MobileCreateShipping
          openCreateShipping={openCreateShipping}
          setOpenCreateShipping={setOpenCreateShipping}
          shippingTime={shippingTime}
          shippingArea={shippingArea}
          shippingTitle={shippingTitle}
          setShippingArea={setShippingArea}
          setShippingCost={setShippingCost}
          setShippingTime={setShippingTime}
          setShippingTitle={setShippingTitle}
          shippingCost={shippingCost}
          CreateShipping={CreateShipping}
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
          onClick={() => setOpenCreateShipping(!openCreateShipping)}
        >
          <BiPlus size={24} /> {activeLanguage.createNewShipping}
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
            {storeInfo?.shipping?.map((item: any, index: number) => {
              return <ShippingItem item={item} index={index} key={index} />;
            })}
          </>
        )}
      </List>
      {!isMobile && (
        <AddNewShippingArea style={{ border: `1px solid ${theme.line}` }}>
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
            <BiPlus size={24} /> {activeLanguage.createNewShipping}
          </h1>
          <Input
            label={activeLanguage.shippingTitle + "*"}
            value={shippingTitle}
            onChange={setShippingTitle}
            warning={false}
            type="text"
          />
          <div>
            <h2
              style={{
                color: theme.primaryText,
                fontWeight: "500",
                fontSize: "14px",
                margin: "0 0 8px 16px",
              }}
            >
              {activeLanguage.shippingArea}: ({activeLanguage.country},{" "}
              {activeLanguage.region}, {activeLanguage.city},{" "}
              {activeLanguage.village}, {activeLanguage.etc})
            </h2>
            <MapAutoComplete
              setShippingVariants={undefined}
              setOrder={undefined}
              setState={setShippingArea}
            />
          </div>
          <div
            style={{
              display: "flex",
              width: "50%",
              alignItems: "center",
              gap: "8px",
              color: theme.primary,
              fontSize: "18px",
            }}
          >
            <Input
              label={activeLanguage.shippingCost + "*"}
              value={shippingCost}
              onChange={setShippingCost}
              warning={false}
              type="number"
            />
            {storeInfo?.currency === "Dollar"
              ? "$"
              : storeInfo?.currency == "Euro"
              ? "€"
              : "₾"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Input
              label={activeLanguage.deliveryTime + "* (1-2)"}
              value={shippingTime}
              onChange={setShippingTime}
              warning={false}
              type="text"
            />
            <div style={{ width: "150px" }}>{activeLanguage.days}</div>
          </div>
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
                {activeLanguage.title}:
              </h2>
              <span>{shippingTitle?.length > 0 ? shippingTitle : "—"}</span>
            </div>
            <div>
              <h2 style={{ color: theme.secondaryText }}>
                {activeLanguage.area}:
              </h2>
              <span>{shippingArea?.address ? shippingArea.address : "—"}</span>
            </div>
            <div>
              <h2 style={{ color: theme.secondaryText }}>
                {activeLanguage.cost}:
              </h2>
              <span>
                {storeInfo?.currency === "Dollar"
                  ? "$"
                  : storeInfo?.currency == "Euro"
                  ? "€"
                  : "₾" + shippingCost}
              </span>
            </div>
            <div>
              <h2 style={{ color: theme.secondaryText }}>
                {activeLanguage.deliveryTime}:
              </h2>
              <span>{shippingTime?.length > 0 ? shippingTime : "—"}</span>
            </div>
          </Review>
          <Button
            disabled={false}
            title={activeLanguage.create}
            background={theme.primary}
            color={theme.lightBackground}
            onClick={() =>
              CreateShipping({
                active: true,
                title: shippingTitle,
                shippingArea,
                shippingCost,
                shippingTime,
              })
            }
          />
        </AddNewShippingArea>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 90vh;
  border-radius: 15px;
  padding: 24px;
  padding-bottom: 64px;
  position: relative;
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 0;
    height: 80vh;
    flex-direction: column;
    gap: 16px;
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
    padding: 0 8px 8px 8px;
    width: 100%;
    gap: 8px;
    padding-bottom: 24px;
  }
`;

const AddNewShippingArea = styled.div`
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 15px;
  padding: 24px;
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
