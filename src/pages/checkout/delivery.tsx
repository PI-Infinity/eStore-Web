import Button from "../../components/button";
import { Input } from "../../components/input";
import MapAutoComplete from "./mapAutocomplete";
import { useAppContext } from "../../context/app";
import { useCurrentUserContext } from "../../context/currentUser";
import { useShippingContext } from "../../context/shipping";
import { useTheme } from "../../context/theme";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { MdLocationPin } from "react-icons/md";
import styled from "styled-components";
import Bag from "./bag";

interface PropsTypes {
  stepOption: string;
  setStepOption: (step: string) => void;
  setShippingVariants: any;
  shippingVariants: any;
}

const Delivery: React.FC<PropsTypes> = ({
  stepOption,
  setStepOption,
  shippingVariants,
  setShippingVariants,
}) => {
  const { theme } = useTheme();
  // shipping info
  const { order, setOrder, deliveryType, setDeliveryType } =
    useShippingContext();

  // edit current user states
  const { isMobile, backendUrl, storeInfo, activeLanguage } = useAppContext();
  const { currentUser, setCurrentUser } = useCurrentUserContext();

  const EditUser = async (p: string, a: any) => {
    if (currentUser) {
      try {
        await axios.patch(backendUrl + "/api/v1/users/" + currentUser._id, {
          phone: p,
          address: a,
        });
        setCurrentUser((prev: any) => ({ ...prev, phone: p, address: a }));
      } catch (error: any) {
        console.log(error.response.data.message);
      }
    }
  };

  // choice pickup address
  const [pickupAddress, setPickupAddress] = useState(0);

  useEffect(() => {
    if (storeInfo && storeInfo?.address) {
      setOrder((prev: any) => ({
        ...prev,
        shipping: {
          ...prev?.shipping,
          pickUpAddress: storeInfo?.address[pickupAddress],
        },
      }));
    }
  }, [deliveryType, storeInfo]);

  console.log(order);

  return (
    <Container style={{ width: "100%" }}>
      <h2
        style={{
          fontSize: isMobile ? "18px" : "24px",
          fontWeight: 600,
          marginRight: "auto",
          cursor: "pointer",
          color:
            stepOption === "delivery" ? theme.primaryText : theme.secondaryText,
        }}
        onClick={() => setStepOption("delivery")}
      >
        {activeLanguage.deliveryOptions}
      </h2>
      {stepOption === "delivery" && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              margin: isMobile ? "16px 0" : "32px 0",
            }}
          >
            <div
              className={deliveryType === "pickup" ? "hover" : ""}
              onClick={() => setDeliveryType("ship")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                background: theme.lightBackground,

                height: isMobile ? "9vw" : "3vw",
                border: `1.5px solid ${
                  deliveryType === "ship" ? theme.primary : "transparent"
                }`,
                borderRadius: "100px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              <CiDeliveryTruck
                size={isMobile ? 20 : 28}
                color={theme.primaryText}
              />{" "}
              {activeLanguage.ship}
            </div>
            <div
              className={deliveryType === "ship" ? "hover" : ""}
              onClick={() => setDeliveryType("pickup")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                background: theme.lightBackground,

                height: isMobile ? "9vw" : "3vw",
                border: `1.5px solid ${
                  deliveryType === "pickup" ? theme.primary : "transparent"
                }`,
                borderRadius: "100px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              <MdLocationPin
                size={isMobile ? 20 : 28}
                color={theme.primaryText}
              />
              {activeLanguage.pickUp}
            </div>
          </div>
          <div
            style={{
              width: isMobile ? "92vw" : "42vw",
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "16px" : "24px",
              padding: "8px 0",
            }}
          >
            <div style={{ display: "flex", gap: "16px" }}>
              <Input
                label={activeLanguage.firstName + "*"}
                type="text"
                value={order?.buyer.firstName}
                onChange={(e) =>
                  setOrder((prev: any) => ({
                    ...prev,
                    buyer: { ...prev.buyer, firstName: e },
                  }))
                }
                warning={order?.buyer.firstName.length > 30 ? true : false}
              />
              <Input
                label={activeLanguage.lastName + "*"}
                type="text"
                value={order?.buyer.lastName}
                onChange={(e) =>
                  setOrder((prev: any) => ({
                    ...prev,
                    buyer: { ...prev.buyer, lastName: e },
                  }))
                }
                warning={order?.buyer.lastName.length > 30 ? true : false}
              />
            </div>

            {deliveryType === "ship" ? (
              <MapAutoComplete
                setState={() => undefined}
                setShippingVariants={setShippingVariants}
              />
            ) : (
              <div>
                {storeInfo?.address?.map((item: any, index: number) => {
                  return (
                    <div
                      onClick={() => {
                        setPickupAddress(index);
                        setOrder((prev: any) => ({
                          ...prev,
                          shipping: { ...prev.shipping, pickUpAddress: item },
                        }));
                      }}
                      style={{
                        cursor: "pointer",
                        fontSize: isMobile ? "12px" : "14px",
                        fontWeight: "600",
                        padding: "4px 8px",
                        border: `1.5px solid ${
                          pickupAddress === index
                            ? theme.primary
                            : "transparent"
                        }`,
                        borderRadius: "10px",
                        marginBottom: "8px",
                        background: theme.lightBackground,
                        letterSpacing: "0",
                      }}
                      key={index}
                    >
                      {item.address}{" "}
                      {item?.workingHours &&
                        " / " +
                          item?.workingHours.starting +
                          " - " +
                          item?.workingHours.ending}
                    </div>
                  );
                })}
              </div>
            )}
            {deliveryType === "ship" && (
              <Input
                label={
                  activeLanguage.addationalInfo + " " + activeLanguage.optional
                }
                type="text"
                value={order?.shipping.addationalInfo}
                onChange={(e) =>
                  setOrder((prev: any) => ({
                    ...prev,
                    shipping: { ...prev.shipping, addationalInfo: e },
                  }))
                }
                warning={
                  order?.shipping?.addationalInfo?.length > 200 ? true : false
                }
              />
            )}

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "16px",
              }}
            >
              <Input
                label={activeLanguage.email + "*"}
                type="email"
                value={order?.buyer.email}
                onChange={(e) =>
                  setOrder((prev: any) => ({
                    ...prev,
                    buyer: { ...prev.buyer, email: e },
                  }))
                }
                warning={order?.buyer.email.length > 70 ? true : false}
              />

              <Input
                label={activeLanguage.phone + "*"}
                type="text"
                value={order?.shipping.phone}
                onChange={(e) =>
                  setOrder((prev: any) => ({
                    ...prev,
                    shipping: { ...prev.shipping, phone: e },
                  }))
                }
                warning={order?.buyer.lastName.length > 30 ? true : false}
              />
            </div>
            <CommentContainer
              style={{ border: `1.5px solid transparent` }}
              primary={theme.primary}
              primarytext={theme.primaryText}
              secondarytext={theme.secondaryText}
            >
              <textarea
                style={{
                  color: theme.primaryText,
                  background: theme.lightBackground,
                  boxSizing: "border-box",
                }}
                placeholder={
                  activeLanguage.addComment + " " + activeLanguage.optional
                }
                value={order?.comment}
                onChange={(e) =>
                  setOrder((prev: any) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
              ></textarea>
            </CommentContainer>
            {isMobile && <Bag shippingVariants={shippingVariants} />}

            <div
              style={{
                width: isMobile ? "100%" : "30%",
                marginLeft: "auto",
                marginTop: isMobile ? "16px" : "auto",
              }}
            >
              <Button
                title={activeLanguage.saveAndContinue}
                color={theme.lightBackground}
                background={theme.primary}
                onClick={
                  order?.subtotal > 0 &&
                  order?.buyer?.firstName &&
                  order?.buyer?.lastName &&
                  order?.buyer?.email &&
                  order?.shipping?.phone &&
                  order?.shipping?.address
                    ? () => {
                        window.scrollTo({ top: 0 });
                        setStepOption("payment");
                        EditUser(
                          order?.shipping?.phone,
                          order?.shipping?.address
                        );
                      }
                    : () => undefined
                }
                disabled={
                  order?.subtotal > 0 &&
                  order?.buyer?.firstName &&
                  order?.buyer?.lastName &&
                  order?.buyer?.email &&
                  order?.shipping?.phone &&
                  order?.shipping?.address
                    ? false
                    : true
                }
              />
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default Delivery;

interface CommentContainerProps {
  primary: string;
  primarytext: string;
  secondarytext: string;
}

const Container = styled.div`
  .hover {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const CommentContainer = styled.div<CommentContainerProps>`
  border-radius: 15px;
  height: 140px;
  width: 100%;
  box-sizing: border-box;

  & > textarea {
    color: ${(props) => props.primarytext};
    background: none;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    padding: 16px;
    border: none;
    outline: none;
    font-size: 16px;

    &::placeholder {
      color: ${(props) => props.secondarytext};
    }

    &:focus {
      border: 1.5px solid ${(props) => props.primary};
    }
  }
`;
