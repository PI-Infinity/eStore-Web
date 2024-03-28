import { useTheme } from "../../../context/theme";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdArrowDropDown, MdArrowDropUp, MdClose } from "react-icons/md";
import styled from "styled-components";
import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { useAppContext } from "../../../context/app";
import { BounceLoader } from "react-spinners";
import { useLocation } from "react-router-dom";

interface PropsType {
  order: any;
  setOrder: any;
  setOrders: any;
  shippingVariants: any;
  deliveryType: any;
}

const Total: React.FC<PropsType> = ({
  order,
  setOrder,
  setOrders,
  shippingVariants,
  deliveryType,
}) => {
  const { theme } = useTheme();

  const location = useLocation();

  // open coupon field
  const [openCoupon, setOpenCoupon] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  // find coupon
  const FindCoupon = async (specialId: any) => {
    try {
      const response = await axios.get(
        backendUrl +
          "/api/v1/coupons/" +
          specialId +
          "?user=" +
          order.buyer.email
      );
      return response.data.data.coupon;
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  const handleApplyCoupon = async () => {
    const coupon = await FindCoupon(couponInput);

    if (coupon) {
      // Check if the coupon is already applied
      const isCouponAlreadyApplied = order?.promotions.some(
        (promotion: any) => promotion.id === coupon.id
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
        alert("Coupon is already applied");
      }
    } else {
      alert("Coupon not found");
    }

    // Clear the coupon input field
    setCouponInput("");
  };

  // calculate
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  const calculateTotalPrice = () => {
    return order?.items.reduce((acc: any, item: any) => {
      if (item.sale > 0) {
        return (
          acc +
          (item.price - (item.price / 100) * item.sale) * (item.quantity || 1)
        );
      } else {
        return acc + item.price * item.quantity;
      }
    }, 0);
  };

  const calculateTotalWithDiscounts = () => {
    const originalTotalPrice = calculateTotalPrice() || 0; // Assuming this calculates the total price before discounts
    setSubtotal(originalTotalPrice);
    let discountAmount = 0;

    // Calculate total discount amount
    order?.promotions.forEach((promotion: any) => {
      if (promotion.discountType === "%") {
        // Calculate percentage discount on the original total price, not the already discounted price
        discountAmount += (originalTotalPrice * promotion.discount) / 100;
      } else {
        // Add fixed discount amount directly
        discountAmount += promotion.discount;
      }
    });

    // Calculate final total price after applying all discounts
    let finalTotalPrice = originalTotalPrice - discountAmount;

    // Ensure the final total price does not go below zero
    finalTotalPrice = Math.max(finalTotalPrice, 0);

    // Include shipping cost in the final total
    finalTotalPrice += order?.shipping.cost || 0;

    setTotal(finalTotalPrice);
    setDiscount(discountAmount > 0 ? discountAmount : 0);
  };

  useEffect(() => {
    calculateTotalWithDiscounts();
  }, [order]);

  /**
   * Creating order
   */

  const { storeInfo, backendUrl, setAlert, activeLanguage } = useAppContext();
  const [loading, setLoading] = useState(false);
  const SetOrder = async () => {
    if (
      deliveryType === "delivery" &&
      order.shipping.address.address?.length < 1
    ) {
      return setAlert({
        active: true,
        text: activeLanguage.addNecessaryFields,
        type: "warning",
      });
    }
    if (
      order.buyer.firstName?.length < 1 ||
      order.buyer.lastName?.length < 1 ||
      order.buyer.email?.length < 1 ||
      order.shipping.phone?.length < 1 ||
      order.items?.length < 1
    ) {
      return setAlert({
        active: true,
        text: activeLanguage.addNecessaryFields,
        type: "warning",
      });
    }
    if (order.items.some((i: any) => !i.size || i.size?.length < 1)) {
      return setAlert({
        active: true,
        text: activeLanguage.itemsMustHaveSize,
        type: "warning",
      });
    }
    if (order.items.some((i: any) => i.quantity < 1 || !i.quantity)) {
      return setAlert({
        active: true,
        text: activeLanguage.itemsMustHaveQuantity,
        type: "warning",
      });
    }
    setLoading(true);
    const newOrder = {
      ...order,
      subtotal: subtotal,
      discount: discount,
      total: total,
      createdAt: new Date(),
    };

    try {
      let response = await axios.post(
        backendUrl + "/api/v1/orders?admin=true",
        {
          order: newOrder,
        }
      );
      setOrders((prev: any) => [response.data.data.order, ...prev]);
      setLoading(false);
      setAlert({
        active: true,
        text: activeLanguage.newOrderCreated,
        type: "success",
      });
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      console.log(error.response.data.message);
    }
  };
  return (
    <TotalContainer
      style={{ border: `1px solid ${theme.line}`, color: theme.primaryText }}
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
        onClick={() => setOpenCoupon(!openCoupon)}
      >
        <h2 style={{ fontSize: "16px", fontWeight: "600" }}>
          {activeLanguage.promoCode}
        </h2>
        <div>
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
              height: "32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={handleApplyCoupon}
          >
            {activeLanguage.apply}
          </div>
        </div>
      )}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: 500 }}>
          {activeLanguage.subtotal}:{" "}
        </h2>
        <span style={{ color: theme.primaryText }}>
          {storeInfo?.currency === "Dollar"
            ? "$"
            : storeInfo?.currency == "Euro"
            ? "€"
            : "₾"}
          {subtotal}
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
                    border: `1px solid ${theme.line}`,
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
                    }}
                  >
                    <div>
                      <h3 style={{ whiteSpace: "nowrap" }}>{it.id}</h3>
                      <p
                        style={{
                          fontSize: 12,
                          color: theme.secondaryText,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {it.description}
                      </p>
                    </div>
                    {it.discount}
                    {it.discountType === "%"
                      ? "%"
                      : storeInfo?.currency === "Dollar"
                      ? "$"
                      : storeInfo?.currency == "Euro"
                      ? "€"
                      : "₾"}
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
                      <MdClose color="red" size={18} />
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
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: 500 }}>
          {activeLanguage.discount}:{" "}
        </h2>
        <span style={{ color: theme.primaryText }}>
          {discount !== 0
            ? storeInfo?.currency === "Dollar"
              ? "-$"
              : storeInfo?.currency == "Euro"
              ? "-€"
              : "-₾" + discount
            : "—"}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: 500 }}>
          {activeLanguage.estimatedShippingAndHandling}:{" "}
        </h2>
        {order?.items?.length > 0 ? (
          <span style={{ color: theme.primaryText }}>
            {order?.shipping.cost > 0 ? (
              <>
                {storeInfo?.currency === "Dollar"
                  ? "$"
                  : storeInfo?.currency == "Euro"
                  ? "€"
                  : "₾"}
                {order?.shipping.cost.toFixed(2)}
              </>
            ) : (
              <span>—</span>
            )}
          </span>
        ) : (
          <span style={{ color: theme.primaryText }}>—</span>
        )}
      </div>
      <div>
        {shippingVariants?.length > 1 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "14px",
              margin: "8px 0",
            }}
          >
            {shippingVariants?.map((item: any, index: any) => {
              return (
                <div
                  key={index}
                  style={{
                    cursor: "pointer",
                    borderRadius: "10px",
                    color: theme.primaryText,
                    padding: "4px 8px",
                    border: `1px solid ${
                      order?.shipping?.shippingTitle === item.title
                        ? theme.primaryText
                        : theme.line
                    }`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() =>
                    setOrder((prev: any) => ({
                      ...prev,
                      shipping: {
                        ...prev.shipping,
                        cost: parseInt(item.shippingCost),
                        shippingTitle: item.title,
                      },
                    }))
                  }
                >
                  <span>
                    {item.title} - {item.shippingTime} {activeLanguage.day}
                  </span>

                  {storeInfo?.currency === "Dollar"
                    ? "$"
                    : storeInfo?.currency == "Euro"
                    ? "€"
                    : "₾"}
                  {item.shippingCost}
                </div>
              );
            })}
          </div>
        )}
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
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: 500 }}>
          {activeLanguage.total}:{" "}
        </h2>
        <span style={{ color: theme.primaryText, fontWeight: 600 }}>
          {storeInfo?.currency === "Dollar"
            ? "$"
            : storeInfo?.currency == "Euro"
            ? "€"
            : "₾"}
          {total}
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
      <Button
        title={
          loading ? (
            <BounceLoader size={25} color={theme.lightBackground} />
          ) : (
            activeLanguage.createOrder
          )
        }
        color={theme.lightBackground}
        background={theme.primary}
        onClick={
          location.search.includes("overview")
            ? () =>
                setAlert({
                  active: true,
                  text: "Create order is impossible, because you are in overview mode",
                  type: "warning",
                })
            : SetOrder
        }
      />
    </TotalContainer>
  );
};

export default Total;

const TotalContainer = styled.div`
  border-radius: 10px;
  min-height: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 24px;
  gap: 16px;

  @media (max-width: 768px) {
    min-height: auto;
    padding: 16px 16px 24px 16px;
  }
`;
