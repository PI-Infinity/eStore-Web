import { useAppContext } from "../../context/app";
import { useShippingContext } from "../../context/shipping";
import { useTheme } from "../../context/theme";
import { Link } from "react-router-dom";
import React from "react";
import { MdClose } from "react-icons/md";
import styled from "styled-components";

interface PropsTypes {
  shippingVariants: any;
}

const Bag: React.FC<PropsTypes> = ({ shippingVariants }) => {
  const { storeInfo, setPageLoading } = useAppContext();

  // order
  const { order, setOrder, discount, subtotal, total, deliveryType } =
    useShippingContext();

  const { activeLanguage, isMobile } = useAppContext();

  const { theme } = useTheme();

  return (
    <Container
      style={{
        border: `1px solid ${theme.lineDark}`,
        width: isMobile ? "100%" : "35%",
        padding: isMobile ? "16px" : "24px",
        // background: theme.lightBackground,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{ width: "100%", margin: isMobile ? "0 0 16px 0" : "16px 0" }}
        >
          <h2
            style={{
              fontSize: "24px",
              marginRight: "auto",
              color: theme.primaryText,
              fontWeight: "600",
            }}
          >
            {activeLanguage.inYourBag}{" "}
          </h2>
        </div>
        <Link
          className="hover"
          style={{
            textDecoration: "underline",
            color: theme.primaryText,
            zIndex: 1000,
            cursor: "pointer",
            fontWeight: "600",
          }}
          to={"/cart"}
        >
          {activeLanguage.edit}
        </Link>
      </div>
      <Total style={{ fontWeight: "500" }}>
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
            {parseInt(subtotal)?.toFixed(2)}
          </span>
        </div>
        {order?.promotions.length > 0 &&
          order?.promotions[0].id?.length > 0 && (
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
                              (i: any) => i.id !== it.id
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
            {discount > 0
              ? storeInfo?.currency === "Dollar"
                ? "—$"
                : storeInfo?.currency == "Euro"
                ? "—€"
                : "—₾" + discount.toFixed(2)
              : "—"}
          </span>
        </div>
        {deliveryType === "ship" && (
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
                {storeInfo?.currency === "Dollar"
                  ? "$"
                  : storeInfo?.currency == "Euro"
                  ? "€"
                  : "₾"}
                {parseInt(order?.shipping.cost)?.toFixed(2)}
              </span>
            ) : (
              <span style={{ color: theme.primaryText }}>—</span>
            )}
          </div>
        )}
        {deliveryType === "ship" && (
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
                        border: `1.5px solid ${
                          order?.shipping?.shippingTitle === item.title
                            ? theme.primary
                            : theme.line
                        }`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        fontWeight: "600",
                        background: theme.lightBackground,
                      }}
                      onClick={() =>
                        setOrder((prev: any) => ({
                          ...prev,
                          shipping: {
                            ...prev.shipping,
                            cost: parseInt(item.shippingCost),
                            shippingTitle: item.title,
                            shippingTime: item.shippingTime,
                          },
                        }))
                      }
                    >
                      <span>
                        {item.title} - {item.shippingTime} {activeLanguage.days}
                      </span>

                      {storeInfo?.currency === "Dollar"
                        ? "$"
                        : storeInfo?.currency == "Euro"
                        ? "€"
                        : "₾"}
                      {parseInt(item.shippingCost).toFixed(2)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "16px",
            fontWeight: "bold",
          }}
        >
          <h2 style={{ fontSize: "16px", fontWeight: 800 }}>
            {activeLanguage.total}:{" "}
          </h2>
          <span style={{ color: theme.primaryTex }}>
            {storeInfo?.currency === "Dollar"
              ? "$"
              : storeInfo?.currency == "Euro"
              ? "€"
              : "₾"}
            {total.toFixed(2)}
          </span>
        </div>
      </Total>
      <div
        style={{
          height: "1px",
          width: "100%",
          background: theme.lineDark,
          margin: "24px 0",
        }}
      />

      <div style={{ padding: "16px" }}>
        {order?.items.length < 1 ? (
          <h2 style={{ color: theme.secondaryText, marginLeft: "24px" }}>
            {activeLanguage.bagIsEmpty}
          </h2>
        ) : (
          order?.items.map((item: any, index: number) => {
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "24px",
                  letterSpacing: "0",
                  fontWeight: 300,
                }}
              >
                <ImageWrapper
                  style={{
                    width: isMobile ? "25vw" : "70px",
                    height: isMobile ? "25vw" : "70px",
                  }}
                >
                  <Link
                    to={`/products/${item.id}`}
                    onClick={() => {
                      setPageLoading(true);
                    }}
                  >
                    {item.cover.type.includes("video") ? (
                      <video
                        key={item.cover?.url}
                        controls={false}
                        autoPlay
                        loop
                        muted
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      >
                        <source src={item.cover?.url} type={item.cover?.type} />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={item.cover.url || "/cosmetics.png"}
                        alt="Item"
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          aspectRatio: 1,
                        }}
                      />
                    )}
                  </Link>
                </ImageWrapper>
                <div
                  style={{
                    width: "70%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    letterSpacing: "0.5px",
                    position: isMobile ? "relative" : "static",
                    bottom: isMobile ? "4px" : "0",
                    fontWeight: 500,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      fontWeight: 500,
                      marginBottom: isMobile ? "4px" : "0px",
                    }}
                  >
                    <h2 style={{ fontSize: "16px", fontWeight: "bold" }}>
                      {item.title}
                    </h2>
                  </div>
                  <h2
                    style={{
                      fontSize: isMobile ? "14px" : "16px",
                      color: theme.secondaryText,
                      fontWeight: 500,
                    }}
                  >
                    {item.category} / {item.subCategory[0]}
                  </h2>
                  {/* <h2
                    style={{
                      fontSize: isMobile ? "14px" : "16px",
                      color: theme.secondaryText,
                      fontWeight: 500,

                    }}
                  >
                    {activeLanguage.brand}: {item.brand}
                  </h2> */}
                  <h2
                    style={{
                      fontSize: isMobile ? "14px" : "16px",
                      color: theme.secondaryText,
                      fontWeight: 500,
                    }}
                  >
                    {activeLanguage.size}: {item.size}
                  </h2>
                  <h2
                    style={{
                      fontSize: isMobile ? "14px" : "16px",
                      color: theme.secondaryText,
                      fontWeight: 500,
                    }}
                  >
                    {activeLanguage.color}: {item.color}
                  </h2>
                  <h2
                    style={{
                      fontSize: isMobile ? "14px" : "16px",
                      color: theme.secondaryText,
                      fontWeight: 500,
                    }}
                  >
                    {activeLanguage.qnt}: {item.quantity}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "4px",
                    }}
                  >
                    {item.sale > 0 && (
                      <span
                        style={{
                          fontSize: isMobile ? "14px" : "16px",
                          fontWeight: "600",
                          color: theme.primaryText,
                        }}
                      >
                        {storeInfo?.currency === "Dollar"
                          ? "$"
                          : storeInfo?.currency == "Euro"
                          ? "€"
                          : "₾"}
                        {(
                          (item.price - (item.price / 100) * item.sale) *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: isMobile ? "14px" : "16px",
                        fontWeight: "600",
                        color:
                          item.sale > 0
                            ? theme.secondaryText
                            : theme.primaryText,
                        textDecoration: item.sale > 0 ? "line-through" : "none",
                      }}
                    >
                      {storeInfo?.currency === "Dollar"
                        ? "$"
                        : storeInfo?.currency == "Euro"
                        ? "€"
                        : "₾"}
                      {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Container>
  );
};

export default Bag;

const Container = styled.div`
  border-radius: 15px;

  .hover {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const Total = styled.div`
  border-radius: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  gap: 8px;
`;

const ImageWrapper = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  transition: ease-in 200ms;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
