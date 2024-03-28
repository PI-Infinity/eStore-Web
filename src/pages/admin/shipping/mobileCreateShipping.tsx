import { MdClose } from "react-icons/md";
import styled from "styled-components";
import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";

import MapAutoComplete from "../orders/mapAutocomplete";

export default function MobileCreateShipping({
  openCreateShipping,
  setOpenCreateShipping,
  shippingTime,
  shippingArea,
  shippingTitle,
  setShippingArea,
  setShippingCost,
  setShippingTime,
  setShippingTitle,
  shippingCost,
  CreateShipping,
}: any) {
  const { theme } = useTheme();

  const { storeInfo, activeLanguage } = useAppContext();

  return (
    <Container
      style={{
        background: theme.background,
        transform: `scale(${openCreateShipping ? 1 : 0})`,
        opacity: openCreateShipping ? 1 : 0,
        borderRadius: openCreateShipping ? "0" : "500px",
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
        onClick={() => setOpenCreateShipping(false)}
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
        <AddNewShippingArea>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: theme.primaryText,
              paddingLeft: "8px",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {activeLanguage.createNewShipping}
          </h1>
          <div>
            <Input
              label={activeLanguage.shippingTitle + "*"}
              value={shippingTitle}
              onChange={setShippingTitle}
              warning={false}
              type="text"
            />
          </div>
          <div>
            <h2
              style={{
                color: theme.primaryText,
                fontWeight: "600",
                fontSize: "14px",
                margin: "0 0 8px 16px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {activeLanguage.shippingArea}:
              <span style={{ color: theme.secondaryText }}>
                ({activeLanguage.country}, {activeLanguage.region},{" "}
                {activeLanguage.city}, {activeLanguage.village},{" "}
                {activeLanguage.etc})
              </span>
            </h2>
            <div>
              <MapAutoComplete
                setShippingVariants={undefined}
                setOrder={undefined}
                setState={setShippingArea}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "50%",
              alignItems: "center",
              gap: "8px",
              color: theme.primaryText,
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
            <h2
              style={{
                marginBottom: "16px",
                color: theme.primaryText,
                fontWeight: 600,
              }}
            >
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
          <div>
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
          </div>
        </AddNewShippingArea>
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 100vh;
  position: fixed;
  top: 0px;
  transition: ease-in 150ms;
  z-index: 100999;

  @media (max-width: 768px) {
    height: 90vh;
  }
`;

const AddNewShippingArea = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 15px;
  // padding-bottom: 24px;
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
