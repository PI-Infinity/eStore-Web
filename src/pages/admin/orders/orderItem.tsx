import axios from "axios";
import { useState } from "react";
import { BiCopy } from "react-icons/bi";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdDelete,
  MdLocationPin,
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";

export default function OrderItem({ item, setOrders, setResults }: any) {
  //theme
  const { theme } = useTheme();
  const location = useLocation();
  // app
  const { storeInfo, setConfirm, activeLanguage, isMobile } = useAppContext();
  // copy id function
  const [copy, setCopy] = useState(null);

  const handleCopyClick = (textToCopy: any) => {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;

    // Prevent scrolling to bottom of page in MS Edge.
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        console.log("Text successfully copied to clipboard");
        setCopy(textToCopy);
        setTimeout(() => {
          setCopy(null);
        }, 2000);
      } else {
        console.error("Failed to copy text.");
      }
    } catch (err) {
      console.error("Could not copy text: ", err);
    }

    document.body.removeChild(textArea);
  };

  // format order date to display format
  const DefineDate = (dateValue: any) => {
    const date = new Date(dateValue);

    // Example format: "February 25, 2024, 16:35"
    // Adjust the format according to your needs
    const formattedDate = date.toLocaleString("en-US", {
      month: "short", // "February"
      day: "2-digit", // "25"
      year: "numeric", // "2024"
      hour: "2-digit", // "16"
      minute: "2-digit", // "35"
      hour12: false,
    });
    return formattedDate;
  };

  /**
   * delete order
   */
  const { backendUrl, setAlert } = useAppContext();
  const DeletOrder = async () => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Delete order is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    try {
      setOrders((prev: any) =>
        prev.filter((i: any) => i._id.toString() !== item?._id.toString())
      );

      await axios.delete(backendUrl + "/api/v1/orders/" + item?._id);
      setResults((prev: any) => {
        // Assuming item?.status is a string like "pending" or "completed"
        let statusKey;
        if (item?.status === "Pending") {
          statusKey = "new";
        } else {
          statusKey = item?.status.toLowerCase(); // Get the status as a key
        }

        // Ensure the status key exists in prev and is a number
        const updatedCount =
          prev[statusKey] && typeof prev[statusKey] === "number"
            ? prev[statusKey] - 1
            : prev[statusKey];

        return {
          ...prev,
          total: prev.total - 1,
          [statusKey]: updatedCount,
        };
      });
      setConfirm({ active: false, agree: null, text: "", close: null });
      setAlert({
        active: true,
        text: activeLanguage.orderDeletedSuccessfully,
        type: "success",
      });
    } catch (error: any) {
      console.log(error.response);
    }
  };

  /**
   * Change status to order
   */
  const [status, setStatus] = useState(item?.status);
  const [openStatusItems, setOpenStatusItems] = useState(false);

  const statusItems = [
    { label: activeLanguage.new, value: "Pending" },
    { label: activeLanguage.warehouse, value: "Warehouse" },
    { label: activeLanguage.courier, value: "Courier" },
    { label: activeLanguage.completed, value: "Completed" },
    { label: activeLanguage.canceled, value: "Canceled" },
  ];

  const ChangeStatus = async (s: any) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Change order's status is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    try {
      setOpenStatusItems(false);
      setStatus(s.value);
      await axios.patch(backendUrl + "/api/v1/orders/" + item?._id, {
        status: s.value,
      });
    } catch (error: any) {
      console.log(error.response);
    }
  };

  return (
    <Container
      style={{
        border: `2px solid ${theme.primaryText}`,
        color: theme.primaryText,
        fontSize: isMobile ? "14px" : "inherit",
        fontWeight: 500,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          zIndex: 999,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 999,
              width: isMobile ? "100%" : "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>{activeLanguage.status}: </span>
              <span
                onClick={() => setOpenStatusItems((p: boolean) => !p)}
                style={{
                  cursor: "pointer",
                  color:
                    status === "Pending"
                      ? "green"
                      : status === "Warehouse"
                      ? "orange"
                      : status === "Completed"
                      ? theme.primaryText
                      : status === "Courier"
                      ? theme.primary
                      : theme.secondaryText,
                }}
              >
                {status === "Pending"
                  ? activeLanguage.new
                  : statusItems?.find((i: any) => i.value === status)?.label}
              </span>

              {openStatusItems ? (
                <MdArrowDropDown
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpenStatusItems(false)}
                />
              ) : (
                <MdArrowDropUp
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpenStatusItems(true)}
                />
              )}
              {isMobile && (
                <MdDelete
                  className="icon"
                  color={theme.primary}
                  size={24}
                  cursor="pointer"
                  style={{ marginLeft: "auto" }}
                  onClick={() =>
                    setConfirm({
                      active: true,
                      text: activeLanguage.askDeleteOrder,
                      close: () => setConfirm(false),
                      agree: () => DeletOrder(),
                    })
                  }
                />
              )}
            </div>
            {openStatusItems && (
              <div
                style={{
                  marginTop: "8px",
                  marginLeft: "40px",
                  position: "absolute",
                  background: theme.background,
                  borderRadius: "10px",
                  padding: "16px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  boxShadow: `0px 1px 3px ${theme.primaryText}`,
                }}
              >
                {statusItems?.map((i: any, x: number) => {
                  if (
                    item?.shipping.shippingTitle === "Pick Up" &&
                    i.value === "Courier"
                  ) {
                    return;
                  }
                  return (
                    <div
                      key={x}
                      onClick={() => ChangeStatus(i)}
                      style={{
                        padding: "4px 16px",
                        border:
                          status === i.value
                            ? `1px solid ${theme.primary}`
                            : `1px solid ${theme.lineDark}`,
                        borderRadius: "50px",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      {i.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div
            style={{
              width: isMobile ? "100%" : "auto",
              justifyContent: isMobile ? "space-between" : "auto",
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <p>{DefineDate(item?.createdAt)}</p>
            {!isMobile && (
              <MdDelete
                className="icon"
                color="red"
                size={24}
                cursor="pointer"
                onClick={() =>
                  setConfirm({
                    active: true,
                    text: activeLanguage.askDeleteOrder,
                    close: () => setConfirm(false),
                    agree: () => DeletOrder(),
                  })
                }
              />
            )}
          </div>
        </div>
        <div
          style={{
            border: isMobile ? "none" : `1px solid ${theme.line}`,
            borderRadius: "15px",
            padding: isMobile ? "0px" : "16px",
            overflow: "hidden",
            overflowY: "auto",
          }}
        >
          {item?.items?.map((it: any, x: number) => {
            return (
              <div
                key={x}
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: "16px",
                  marginBottom: "8px",
                  border: `1px solid ${theme.line}`,
                  padding: "16px",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: isMobile ? "100%" : "auto",
                    gap: "24px",
                  }}
                >
                  <Link
                    to={`/products/${it.id}`}
                    style={{ width: isMobile ? "auto" : "20%" }}
                  >
                    <ImgWrapper>
                      {it?.cover?.type.startsWith("video") ? (
                        <video
                          key={it?.cover?.url}
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
                          <source src={it?.cover?.url} type={it?.cover?.type} />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={it?.cover.url || "/cosmetics.png"}
                          alt="Cosmetics"
                          style={{ objectFit: "cover", aspectRatio: 1 }}
                          width="100%"
                        />
                      )}
                    </ImgWrapper>
                  </Link>
                  {isMobile && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <p style={{ fontWeight: "bold" }}>{it.title}</p>

                      <p style={{ fontSize: "14px" }}>
                        <span style={{ color: theme.secondaryText }}>
                          {activeLanguage.brand}:
                        </span>{" "}
                        {it.brand}
                      </p>
                      <p style={{ fontSize: "14px" }}>
                        <span style={{ color: theme.secondaryText }}>
                          {activeLanguage.color}:
                        </span>{" "}
                        {it.color}
                      </p>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    gap: "20%",
                  }}
                >
                  {!isMobile && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <p style={{ fontWeight: "bold" }}>{it.title}</p>

                      <p style={{ fontSize: "14px" }}>
                        <span style={{ color: theme.secondaryText }}>
                          {activeLanguage.brand}:
                        </span>{" "}
                        {it.brand}
                      </p>
                      <p style={{ fontSize: "14px" }}>
                        <span style={{ color: theme.secondaryText }}>
                          {activeLanguage.color}:
                        </span>{" "}
                        {it.color}
                      </p>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <p style={{ fontSize: "14px" }}>
                      <span style={{ color: theme.secondaryText }}>
                        {activeLanguage.qnt}:
                      </span>{" "}
                      {it.quantity}
                    </p>

                    <p style={{ fontSize: "14px" }}>
                      <span style={{ color: theme.secondaryText }}>
                        {activeLanguage.size}:
                      </span>{" "}
                      {it.size}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      <span style={{ color: theme.secondaryText }}>
                        {activeLanguage.price}:
                      </span>{" "}
                      {it.sale > 0 && (
                        <span style={{ color: theme.Text }}>
                          {storeInfo?.currency === "Dollar"
                            ? "$"
                            : storeInfo?.currency == "Euro"
                            ? "€"
                            : "₾"}
                          {(it.price - (it.price / 100) * it.sale).toFixed(2)}
                        </span>
                      )}{" "}
                      {it.sale && (
                        <span
                          style={{
                            color:
                              it.sale > 0
                                ? theme.secondaryText
                                : theme.primaryText,
                            textDecoration:
                              it.sale > 0 ? "line-through" : "none",
                          }}
                        >
                          {storeInfo?.currency === "Dollar"
                            ? "$"
                            : storeInfo?.currency == "Euro"
                            ? "€"
                            : "₾"}
                          {it.price.toFixed(2)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            padding: isMobile ? "8px" : "24px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            border: isMobile ? "none" : `1px solid ${theme.line}`,
            borderRadius: "15px",
            fontSize: "14px",
            letterSpacing: "0.5px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  color: theme.secondaryText,
                  width: isMobile ? "100%" : "130px",
                }}
              >
                {activeLanguage.user}:{"  "}
              </div>
              <span style={{ whiteSpace: "nowrap" }}>
                {item?.buyer.firstName} {item?.buyer.lastName}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  color: theme.secondaryText,
                  width: isMobile ? "100%" : "130px",
                }}
              >
                {activeLanguage.email}:{"  "}
              </div>
              <span>{item?.buyer.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  color: theme.secondaryText,
                  width: isMobile ? "100%" : "130px",
                }}
              >
                {activeLanguage.phone}:{"  "}
              </div>
              <span>{item?.shipping.phone}</span>
            </div>
          </div>
          <div style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: `1px solid ${theme.line}`,
                borderRadius: "15px",
                padding: "8px",
              }}
            >
              <MdLocationPin size={24} color={theme.Text} />
              <div
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "start" : "center",
                    gap: isMobile ? "2px" : "8px",
                  }}
                >
                  <div style={{ color: theme.primaryText }}>
                    {item?.shipping.shippingTitle === "Pick Up"
                      ? activeLanguage.pickUp
                      : activeLanguage.address}
                  </div>
                  <span>
                    {item?.shipping.shippingTitle === "Pick Up"
                      ? item?.shipping.pickUpAddress?.address
                      : item?.shipping.address.address}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "start" : "center",
                    gap: isMobile ? "2px" : "8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div style={{ color: theme.secondaryText }}>
                    {item?.shipping.deliveryType === "Pick Up"
                      ? activeLanguage.workingHours
                      : activeLanguage.addationalInfo}
                  </div>
                  <span>
                    {item?.shipping.deliveryType === "Pick Up" ? (
                      <span>
                        {item?.shipping.pickUpAddress?.workingHours ? (
                          <>
                            {item?.shipping.pickUpAddress?.workingHours
                              .starting +
                              " - " +
                              item?.shipping.pickUpAddress?.workingHours
                                .starting}
                          </>
                        ) : (
                          "—"
                        )}
                      </span>
                    ) : (
                      <span>{item?.shipping.addationalInfo || "—"}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "16px",
              }}
            >
              <div
                style={{
                  color: theme.secondaryText,
                  width: isMobile ? "100%" : "130px",
                }}
              >
                {activeLanguage.comment}:
              </div>
              <span style={{ whiteSpace: "nowrap" }}>
                {item?.comment || "Bina 24"}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: isMobile ? "start" : "flex-end",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                width: isMobile ? "100%" : "auto",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    color: theme.secondaryText,
                    width: isMobile ? "100%" : "130px",
                  }}
                >
                  {activeLanguage.subtotal}:{"  "}
                </div>
                <span>
                  {storeInfo?.currency === "Dollar"
                    ? "$"
                    : storeInfo?.currency == "Euro"
                    ? "€"
                    : "₾"}
                  {item?.subtotal.toFixed(2)}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    color: theme.secondaryText,
                    width: isMobile ? "100%" : "130px",
                  }}
                >
                  {activeLanguage.discount}:{"  "}
                </div>
                <span style={{ color: theme.secondaryText }}>
                  {item?.discount > 0
                    ? storeInfo?.currency === "Dollar"
                      ? "-$"
                      : storeInfo?.currency == "Euro"
                      ? "-€"
                      : "-₾"
                    : "—"}
                  {item?.discount > 0 && item?.discount.toFixed(2)}
                </span>
              </div>
              {item?.promotions?.length > 0 && (
                <div style={{ margin: "8px 0 8px 16px" }}>
                  <div
                    style={{
                      color: theme.secondaryText,
                      width: isMobile ? "100%" : "130px",
                      marginBottom: "8px",
                    }}
                  >
                    {activeLanguage.coupon}:
                  </div>
                  {item?.promotions.map((i: any, x: number) => {
                    return (
                      <div
                        key={x}
                        style={{
                          width: "100%",
                          borderRadius: "10px",
                          border: `1px solid ${theme.line}`,
                          padding: "4px 8px",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div style={{ color: theme.secondaryText }}>Id: </div>
                        <span style={{ color: theme.primaryText }}>
                          {i.specialId}
                        </span>
                        <div style={{ color: theme.secondaryText }}>
                          {activeLanguage.description}:{" "}
                        </div>
                        <span style={{ color: theme.primaryText }}>
                          {i.description}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              {item?.shipping?.shippingTitle !== "Pick Up" && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      color: theme.secondaryText,
                      width: isMobile ? "100%" : "130px",
                    }}
                  >
                    {activeLanguage.shipping}:
                  </div>
                  <span
                    style={{ color: theme.secondaryText, whiteSpace: "nowrap" }}
                  >
                    {item?.shipping.cost > 0
                      ? storeInfo?.currency === "Dollar"
                        ? "$"
                        : storeInfo?.currency == "Euro"
                        ? "€"
                        : "₾" + item?.shipping.cost.toFixed(2)
                      : "—"}{" "}
                    ({item?.shipping.shippingTime} {activeLanguage.day})
                  </span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "8px",
                  fontSize: "16px",
                }}
              >
                <div
                  style={{
                    color: theme.secondaryText,
                    width: isMobile ? "100%" : "130px",
                  }}
                >
                  {activeLanguage.total}:
                </div>
                <span style={{ color: theme.primaryText, fontWeight: "bold" }}>
                  {storeInfo?.currency === "Dollar"
                    ? "$"
                    : storeInfo?.currency == "Euro"
                    ? "€"
                    : "₾"}
                  {item?.total.toFixed(2)}
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                position: "relative",
                marginTop: "16px",
              }}
            >
              {copy === item?.orderId && (
                <div
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    borderRadius: "50px",
                    background: theme.line,
                    position: "absolute",
                    right: 0,
                    top: -35,
                    color: theme.primary,
                  }}
                >
                  {activeLanguage.copied}
                </div>
              )}
              <p>ID: {item?.orderId}</p>
              <BiCopy
                style={{ cursor: "pointer" }}
                onClick={() => handleCopyClick(item?.orderId)}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  border-radius: 15px;
  margin-bottom: 16px;
  z-index: 999;

  .icon {
    &:hover {
      opacity: 0.8;
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 8px;
  }
`;

const ImgWrapper = styled.div`
  width: 80px;
  height: 80px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  position: relative;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
