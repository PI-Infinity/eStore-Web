import Button from "../../components/button";
import { Input } from "../../components/input";
import { useAppContext } from "../../context/app";
import { useCurrentUserContext } from "../../context/currentUser";
import { useShippingContext } from "../../context/shipping";
import { useTheme } from "../../context/theme";
import axios from "axios";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { MdArrowDropDown, MdArrowDropUp, MdClose } from "react-icons/md";
import styled from "styled-components";

interface PropsType {
  // shippingVariants: any;
}

const Total: React.FC<PropsType> = () => {
  const { theme } = useTheme();

  const { currentUser } = useCurrentUserContext();

  // app context
  const {
    storeInfo,
    backendUrl,
    activeLanguage,
    isMobile,
    setPageLoading,
    setAlert,
  } = useAppContext();

  // order
  const { order, setOrder, discount, subtotal, total } = useShippingContext();

  // find coupon
  const FindCoupon = async (specialId: any) => {
    try {
      const response = await axios.get(
        backendUrl + "/api/v1/coupons/" + specialId + "?user=" + currentUser._id
      );
      return response.data.data.coupon;
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  // open coupon field
  const [openCoupon, setOpenCoupon] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = async (specialId: any) => {
    const coupon = await FindCoupon(specialId);

    if (coupon) {
      // Check if the coupon is already applied
      const isCouponAlreadyApplied = order?.promotions.some(
        (promotion: any) => promotion.specialId === coupon.specialId
      );

      if (!isCouponAlreadyApplied) {
        // Add the coupon to the promotions array if it's not already applied
        setOrder({
          ...order,
          promotions: [
            ...order?.promotions,
            {
              specialId: coupon.specialId,
              description: coupon.description,
              discount: coupon.discount,
              discountType: coupon.discountType,
            },
          ],
        });
      } else {
        // Optionally, alert the user that the coupon is already applied
        setAlert({
          active: true,
          type: "warning",
          text: activeLanguage.couponAlreadyApplied,
        });
      }
    } else {
      setAlert({
        active: true,
        type: "error",
        text: activeLanguage.couponNotFound,
      });
    }

    // Clear the coupon input field
    setCouponInput("");
  };

  return (
    <TotalContainer
      style={{
        border: `1px solid ${theme.lineDark}`,
        width: isMobile ? "100%" : "30%",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "600",
          marginBottom: "8px",
        }}
      >
        {activeLanguage.summary}
      </h2>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10000,
          cursor: "pointer",
        }}
        className="hover"
        onClick={() => setOpenCoupon(!openCoupon)}
      >
        <h2 style={{ fontSize: "16px", fontWeight: "600" }}>
          {activeLanguage.doYouHaveAPromoCode}
        </h2>
        <div style={{ cursor: "pointer" }}>
          {openCoupon ? (
            <MdArrowDropDown fontSize={24} />
          ) : (
            <MdArrowDropUp fontSize={24} />
          )}
        </div>
      </div>

      {openCoupon && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            zIndex: 10000,
          }}
        >
          {!currentUser ? (
            <Link
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                zIndex: 100,
                color: "inherit",
                fontWeight: 500,
              }}
              to={"/login"}
            >
              {activeLanguage.firstJoinInstructions}
            </Link>
          ) : (
            <>
              <Input
                label={activeLanguage.addCouponId}
                type="text"
                value={couponInput}
                onChange={setCouponInput}
                warning={false}
              />

              <div
                style={{
                  width: "40%",
                  color: theme.lightBackground,
                  fontWeight: "500",
                  textAlign: "center",
                  background: theme.primary,
                  borderRadius: "10px",
                  height: "80%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleApplyCoupon(couponInput)}
                className="hover"
              >
                {activeLanguage.apply}
              </div>
            </>
          )}
        </div>
      )}

      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 500,
        }}
      >
        <h2 style={{ fontSize: "16px" }}>{activeLanguage.subtotal}: </h2>
        <span style={{ color: theme.primaryText }}>
          {storeInfo?.currency === "Dollar"
            ? "$"
            : storeInfo?.currency == "Euro"
            ? "€"
            : "₾"}
          {parseInt(subtotal)?.toFixed(2)}
        </span>
      </div>
      {order?.promotions.length > 0 &&
        order?.promotions[0].specialId?.length > 0 && (
          <div
            style={{
              zIndex: 10000,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {order?.promotions.map((it: any, indx: number) => {
              return (
                <div
                  key={indx}
                  style={{
                    width: "100%",
                    padding: "4px",
                    borderRadius: "50px",
                    border: `1px solid ${theme.lineDark}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "4px 16px",
                      gap: "8px",
                      fontWeight: "500",
                    }}
                  >
                    <div style={{ width: "60%", overflow: "hidden" }}>
                      <h3
                        style={{
                          whiteSpace: "nowrap",
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        {it.specialId}
                      </h3>
                      <p
                        style={{
                          fontSize: 12,
                          color: theme.secondaryText,
                          whiteSpace: "nowrap",
                          letterSpacing: "0px",
                        }}
                      >
                        {it.description}
                      </p>
                    </div>
                    -
                    {it.discountType === "%"
                      ? "%"
                      : storeInfo?.currency === "Dollar"
                      ? "$"
                      : storeInfo?.currency == "Euro"
                      ? "€"
                      : "₾"}
                    {it.discount}
                    <div
                      style={{ padding: "4px", cursor: "pointer" }}
                      onClick={() =>
                        setOrder({
                          ...order,
                          promotions: order?.promotions.filter(
                            (i: any) => i.specialId !== it.specialId
                          ),
                        })
                      }
                    >
                      <MdClose color={theme.primary} size={18} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 500,
        }}
      >
        <h2 style={{ fontSize: "16px" }}>{activeLanguage.discount}: </h2>
        <span style={{ color: theme.primaryText }}>
          {discount > 0
            ? storeInfo?.currency === "Dollar"
              ? "—$"
              : storeInfo?.currency == "Euro"
              ? "—€"
              : "—₾" + discount.toFixed(2)
            : "—"}
        </span>
      </div>

      <div
        style={{
          height: "1px",
          width: "100%",
          background: theme.line,
          margin: "16px 0 8px 0",
        }}
      />
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 500,
        }}
      >
        <h2 style={{ fontSize: "16px" }}>{activeLanguage.total}: </h2>
        <span style={{ color: theme.primaryText, fontWeight: 800 }}>
          {storeInfo?.currency === "Dollar"
            ? "$"
            : storeInfo?.currency == "Euro"
            ? "€"
            : "₾"}
          {(total - order?.shipping?.cost || 0).toFixed(2)}
        </span>
      </div>
      <div
        style={{
          height: "1px",
          width: "100%",
          background: theme.line,
          margin: "8px 0 16px 0",
        }}
      />
      <Link
        to={"/checkout"}
        style={{ width: "100%", color: "inherit", textDecoration: "none" }}
      >
        <Button
          title={activeLanguage.checkout}
          color={theme.lightBackground}
          background={theme.primary}
          onClick={() => {
            setPageLoading(true);
            setOrder((prev: any) => ({
              ...prev,
              subtotal: subtotal,
              discount: discount,
              total: total,
            }));
          }}
        />
      </Link>
    </TotalContainer>
  );
};

export default Total;

const TotalContainer = styled.div`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 24px;
  gap: 16px;

  .hover {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;
